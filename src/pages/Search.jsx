import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: requests = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["searchRequests", searchTerm],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/donation-requests/search`,
          { params: { q: searchTerm } }
        );
        return res.data;
      } catch (err) {
        toast.error("Failed to fetch donation requests");
        return [];
      }
    },
    keepPreviousData: true,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold mb-5">Search Donation Requests</h2>

      <form onSubmit={handleSearch} className="mb-5 flex gap-2">
        <input
          type="text"
          placeholder="Search by blood group, district, or upazila"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered flex-1"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {isLoading && <p className="text-center">Loading...</p>}
      {isError && <p className="text-center text-red-500">Error loading results.</p>}

      {!isLoading && requests.length === 0 && searchTerm && (
        <p className="text-center">No results found for "{searchTerm}"</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {requests.map((req) => (
          <div key={req._id} className="card shadow-lg p-5 bg-base-200">
            <h3 className="text-xl font-semibold mb-1">
              {req.title || "Donation Request"}
            </h3>
            {req.description && <p className="text-sm mb-2">{req.description}</p>}
            <p>
              <strong>Requested By:</strong> {req.requesterEmail}
            </p>
            <p>
              <strong>Blood Group:</strong> {req.bloodGroup}
            </p>
            <p>
              <strong>Location:</strong> {req.district}, {req.upazila}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
