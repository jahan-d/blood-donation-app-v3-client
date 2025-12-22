import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import { toast } from "react-hot-toast";

const Home = () => {
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["public-donation-requests"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/donation-requests/public`
        );
        return res.data;
      } catch {
        toast.error("Failed to load donation requests");
        return [];
      }
    },
  });

  const latestRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Latest Donation Requests
      </h1>

      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : latestRequests.length === 0 ? (
        <p className="text-center">No donation requests found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestRequests.map((req) => (
            <div
              key={req._id}
              className="p-5 border rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-1">
                {req.title || "Donation Request"}
              </h2>

              <p>
                <strong>Blood Group:</strong> {req.bloodGroup}
              </p>

              <p>
                <strong>Location:</strong> {req.district}, {req.upazila}
              </p>

              <Link
                to={`/donation-requests/${req._id}`}
                className="inline-block mt-3 text-primary hover:underline"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
