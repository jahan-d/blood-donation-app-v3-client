import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";

const DonationRequests = () => {
  const { data: requests = [], isLoading, isError } = useQuery({
    queryKey: ["public-donation-requests"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/donation-requests/public`
      );
      return res.data;
    },
  });

  if (isLoading)
    return <p className="text-center mt-10">Loading requests...</p>;

  if (isError)
    return <p className="text-center mt-10">Failed to load requests.</p>;

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold mb-6">
        Pending Blood Donation Requests
      </h2>

      {!requests.length ? (
        <p>No pending requests at the moment.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="card bg-base-100 shadow-md p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  {req.recipientName}
                </h3>

                <p className="text-sm text-gray-600">
                  {req.recipientDistrict}, {req.recipientUpazila}
                </p>

                <p className="mt-2">
                  <strong>Blood Group:</strong> {req.bloodGroup}
                </p>

                <p className="text-sm">
                  <strong>Date:</strong> {req.donationDate}
                </p>

                <p className="text-sm">
                  <strong>Time:</strong> {req.donationTime}
                </p>
              </div>

              <Link
                to={`/donation-requests/${req._id}`}
                className="btn btn-primary btn-sm mt-4"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationRequests;
