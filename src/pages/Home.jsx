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
        // console.error("Failed to load donation requests");
        return [];
      }
    },
  });

  const latestRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);
  // console.log(requests);
  return (
    <div>
      {/* Hero Banner */}
      <div className="hero min-h-[400px] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Donate Blood, Save Life</h1>
            <p className="py-6">
              Join our community of donors and make a difference today.
              Find donors near you or become one yourself.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/register" className="btn btn-primary">Join as a donor</Link>
              <Link to="/search" className="btn btn-secondary">Search Donors</Link>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default Home;
