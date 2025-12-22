import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

const STATUSES = ["pending", "inprogress", "done", "canceled"];

const AllDonationRequests = ({ currentUser }) => {
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
              <th>Date</th>
              <th>Time</th>
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
                <td>{req.donationDate}</td>
                <td>{req.donationTime}</td>
                <td>{req.bloodGroup}</td>
                <td className="capitalize">{req.status}</td>
                <td>
                  {req.status === "inprogress"
                    ? `${req.donorName || "—"}`
                    : "—"}
                </td>

                <td>
                  {/* Volunteers & Admin can update status */}
                  {(currentUser.role === "admin" ||
                    currentUser.role === "volunteer") && (
                    <select
                      className="select select-sm select-bordered"
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
                </td>
              </tr>
            ))}

            {!requests.length && (
              <tr>
                <td colSpan="8" className="text-center py-6">
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
