import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

const MyDonationRequests = () => {
  const token = localStorage.getItem("access-token");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["my-donation-requests"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/donation-requests/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
        }
        return [];
      }
    },
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return axios.delete(
        `${import.meta.env.VITE_API_URL}/donation-requests/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    onSuccess: () => {
      toast.success("Request deleted successfully!");
      queryClient.invalidateQueries(["my-donation-requests"]);
    },
    onError: () => {
      toast.error("Failed to delete request.");
    },
  });

  const handleDelete = (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this donation request?"
    );
    if (confirm) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Loading your requests...</p>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-5">My Donation Requests</h2>

      {requests.length === 0 ? (
        <p>You have not created any donation requests yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Blood Group</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>{req.title}</td>
                  <td>{req.bloodGroup}</td>
                  <td>{req.location}</td>
                  <td>
                    <span className="badge badge-outline">
                      {req.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-error btn-sm"
                      disabled={
                        req.status !== "pending" ||
                        deleteMutation.isLoading
                      }
                      onClick={() => handleDelete(req._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyDonationRequests;
