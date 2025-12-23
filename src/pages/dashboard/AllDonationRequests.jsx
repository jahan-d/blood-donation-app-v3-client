import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { Link } from "react-router";
const STATUSES = ["pending", "inprogress", "done", "canceled"];
import { useAuth } from "../../contexts/AuthContext/AuthProvider";

const AllDonationRequests = () => {
  const { user: currentUser } = useAuth();
  const token = localStorage.getItem("access-token");
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["all-donation-requests", statusFilter, page],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/donation-requests`,
        {
          params: { status: statusFilter || undefined, page, limit },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
  });

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
      queryClient.invalidateQueries(["all-donation-requests"]);
    },
    onError: () => toast.error("Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => axios.delete(`${import.meta.env.VITE_API_URL}/donation-requests/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: () => { toast.success("Request deleted"); queryClient.invalidateQueries(["all-donation-requests"]); },
    onError: () => toast.error("Failed to delete")
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this check?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p className="p-5">Loading...</p>;

  return (
    <div className="p-5">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <h2 className="text-2xl font-bold">All Blood Donation Requests</h2>

        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Recipient</th>
              <th>Location</th>
              <th>Date/Time</th>
              <th>Blood</th>
              <th>Status</th>
              <th>Donor</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.recipientName}</td>
                <td>
                  {req.recipientDistrict}, {req.recipientUpazila}
                </td>
                <td>{req.donationDate} at {req.donationTime}</td>
                <td>{req.bloodGroup}</td>
                <td>
                  <span className={`badge ${req.status === 'inprogress' ? 'badge-warning' : req.status === 'done' ? 'badge-success' : 'badge-ghost'}`}>
                    {req.status}
                  </span>
                </td>
                <td>
                  {req.status === "inprogress"
                    ? `${req.donorName || "—"}`
                    : "—"}
                </td>

                <td className="flex flex-col gap-2">
                  {/* Status Update - Admin & Volunteer */}
                  {(currentUser.role === "admin" ||
                    currentUser.role === "volunteer") && (
                      <select
                        className="select select-xs select-bordered mb-1"
                        value={req.status}
                        onChange={(e) =>
                          statusMutation.mutate({
                            id: req._id,
                            status: e.target.value,
                          })
                        }
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    )}

                  <div className="flex gap-1 flex-wrap">
                    <Link to={`/donation-requests/${req._id}`} className="btn btn-xs btn-info">View</Link>

                    {/* Admin Only Actions */}
                    {currentUser.role === "admin" && (
                      <>
                        <Link to={`/dashboard/update-donation-request/${req._id}`} className="btn btn-xs btn-primary">Edit</Link>
                        <button className="btn btn-xs btn-error" onClick={() => handleDelete(req._id)}>Delete</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {!requests.length && (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  No donation requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="btn btn-sm"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>
        <button className="btn btn-sm" onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default AllDonationRequests;
