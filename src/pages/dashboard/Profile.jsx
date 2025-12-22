import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

const Profile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = localStorage.getItem("access-token");

  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    enabled: !!token,
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/profile`,
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
      }
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bloodGroup: user.bloodGroup || "",
        district: user.district || "",
        upazila: user.upazila || "",
      });
    }
  }, [user]);

  const updateProfile = useMutation({
    mutationFn: async (data) => {
      return axios.put(
        `${import.meta.env.VITE_API_URL}/users/profile`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(["profile"]);
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

  if (isLoading) return <p>Loading profile...</p>;

  return (
    <div className="p-5 max-w-md">
      <h2 className="text-2xl font-bold mb-5">My Profile</h2>

      {/* Read-only info */}
      <div className="mb-4 space-y-1">
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Role:</strong>{" "}
          <span className="badge badge-outline">{user?.role}</span>
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`badge ${
              user?.status === "active"
                ? "badge-success"
                : "badge-error"
            }`}
          >
            {user?.status}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />

        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Blood Group"
          value={formData.bloodGroup}
          onChange={(e) =>
            setFormData({ ...formData, bloodGroup: e.target.value })
          }
        />

        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="District"
          value={formData.district}
          onChange={(e) =>
            setFormData({ ...formData, district: e.target.value })
          }
        />

        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Upazila"
          value={formData.upazila}
          onChange={(e) =>
            setFormData({ ...formData, upazila: e.target.value })
          }
        />

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={updateProfile.isLoading}
        >
          {updateProfile.isLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
