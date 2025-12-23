import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router";
import { useState } from "react";

const MyDonationRequests = () => {
  const token = localStorage.getItem("access-token");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading } = useQuery({
    queryKey: ["my-donation-requests", filter, page],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/donation-requests/my`,
        {
          params: { status: filter || undefined, page, limit },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return res.data;
    },
    enabled: !!token,
    keepPreviousData: true,
  });

  const requests = data?.requests || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/donation-requests/status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries(["my-donation-requests"]);
    },
    onError: () => toast.error("Failed to update status"),
  });

  const handleStatusUpdate = (id, status) => {
    statusMutation.mutate({ id, status });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id) => axios.delete(`${import.meta.env.VITE_API_URL}/donation-requests/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: () => { toast.success("Request deleted"); queryClient.invalidateQueries(["my-donation-requests"]); },
    onError: () => toast.error("Failed to delete")
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this check?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-5">My Donation Requests</h2>

      <div className="flex justify-between mb-4">
        {/* Helper text since server doesn't support status filtering yet for 'my' requests, but we keep the UI consistent or remove it. */}
        <div className="flex gap-2 items-center">
          <label>Filter by Status:</label>
          <select className="select select-bordered select-sm" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Location</th>
                <th>Date/Time</th>
                <th>Blood Group</th>
                <th>Status</th>
                <th>Donor Info</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>{req.recipientName}</td>
                  <td>{req.recipientDistrict}, {req.recipientUpazila}</td>
                  <td>{req.donationDate} at {req.donationTime}</td>
                  <td>{req.bloodGroup}</td>
                  <td>
                    <span className={`badge ${req.status === 'inprogress' ? 'badge-warning' : req.status === 'done' ? 'badge-success' : 'badge-ghost'}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    {req.status === 'inprogress' ? (
                      <div className="text-sm">
                        <p>{req.donorName}</p>
                        <p>{req.donorEmail}</p>
                      </div>
                    ) : "-"}
                  </td>
                  <td className="flex flex-col gap-2">
                    {/* Actions */}
                    {req.status === 'inprogress' && (
                      <div className="flex gap-1">
                        <button onClick={() => handleStatusUpdate(req._id, 'done')} className="btn btn-xs btn-success">Done</button>
                        <button onClick={() => handleStatusUpdate(req._id, 'canceled')} className="btn btn-xs btn-error">Cancel</button>
                      </div>
                    )}
                    <div className="flex gap-1">
                      <Link to={`/donation-requests/${req._id}`} className="btn btn-xs btn-info">View</Link>
                      <Link to={`/dashboard/update-donation-request/${req._id}`} className="btn btn-xs btn-primary">Edit</Link>
                      <button className="btn btn-xs btn-error" onClick={() => handleDelete(req._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="btn-group mt-4 justify-center flex">
        <button className="btn" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>«</button>
        <button className="btn">Page {page}</button>
        <button className="btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>»</button>
      </div>
    </div>
  );
};

export default MyDonationRequests;
