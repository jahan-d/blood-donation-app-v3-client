import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { districts } from "../data/districts";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Search = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");

  const { data: donors = [], isLoading, refetch } = useQuery({
    queryKey: ["searchDonors", bloodGroup, district, upazila],
    queryFn: async () => {
      // Only fetch if at least one filter is applied or on button click
      const params = {};
      if (bloodGroup) params.bloodGroup = bloodGroup;
      if (district) params.district = district;
      if (upazila) params.upazila = upazila;

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/search/donors`,
        { params }
      );
      return res.data;
    },
    enabled: false, // Wait for search button
  });

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-3xl font-bold mb-6 text-center">Search Donors</h2>

      <form
        onSubmit={handleSearch}
        className="bg-base-200 p-6 rounded-lg shadow-md mb-8 grid md:grid-cols-4 gap-4"
      >
        <select
          className="select select-bordered w-full"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          required
        >
          <option value="">Blood Group</option>
          {bloodGroups.map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered w-full"
          value={district}
          onChange={(e) => {
            setDistrict(e.target.value);
            setUpazila(""); // Reset upazila on district change
          }}
          required
        >
          <option value="">District</option>
          {districts.map((d) => (
            <option key={d.name} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered w-full"
          value={upazila}
          onChange={(e) => setUpazila(e.target.value)}
          disabled={!district}
          required
        >
          <option value="">Upazila</option>
          {districts
            .find((d) => d.name === district)
            ?.upazilas.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
        </select>

        <button type="submit" className="btn btn-primary w-full">
          Search
        </button>
      </form>

      {isLoading && <p className="text-center">Searching...</p>}

      {!isLoading && donors.length === 0 && (
        <p className="text-center text-gray-500">No donors found with these criteria.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donors.map((donor) => (
          <div key={donor._id} className="card bg-base-100 shadow-xl border">
            <div className="card-body items-center text-center">
              <div className="avatar">
                <div className="w-20 rounded-full">
                  <img
                    src={donor.avatar || "https://i.ibb.co/ZYW3VTp/brown-brim.png"}
                    alt={donor.name}
                  />
                </div>
              </div>
              <h3 className="card-title mt-2">{donor.name}</h3>
              <div className="badge badge-error text-white font-bold mb-2">
                {donor.bloodGroup}
              </div>
              <p className="text-sm text-gray-600">
                {donor.district}, {donor.upazila}
              </p>
              <p className="text-xs text-gray-400 mt-2 truncate max-w-xs">{donor.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
