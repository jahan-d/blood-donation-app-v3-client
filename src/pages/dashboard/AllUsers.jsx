import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";

const AllUsers = ({ currentUser }) => {
  const token = localStorage.getItem("access-token");
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", statusFilter, page],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          params: { status: statusFilter || undefined },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
  });

  const updateRole = async (id, role) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/role/${id}`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Role updated");
      queryClient.invalidateQueries(["users"]);
    } catch {
      toast.error("Role update failed");
    }
  };

  const toggleStatus = async (id, status) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(
        status === "blocked" ? "User blocked" : "User unblocked"
      );
      queryClient.invalidateQueries(["users"]);
    } catch {
      toast.error("Action failed");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Users</h2>

        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Manage</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className="badge badge-outline">{user.role}</span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      user.status === "blocked"
                        ? "badge-error"
                        : "badge-success"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="flex gap-2">
                  {/* Prevent self-modification */}
                  {currentUser.email !== user.email && (
                    <>
                      <select
                        className="select select-xs select-bordered"
                        defaultValue={user.role}
                        onChange={(e) =>
                          updateRole(user._id, e.target.value)
                        }
                      >
                        <option value="donor">Donor</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="admin">Admin</option>
                      </select>

                      <button
                        className="btn btn-xs btn-warning"
                        onClick={() =>
                          toggleStatus(
                            user._id,
                            user.status === "active"
                              ? "blocked"
                              : "active"
                          )
                        }
                      >
                        {user.status === "blocked"
                          ? "Unblock"
                          : "Block"}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {!users.length && (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
