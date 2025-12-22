import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { districts } from "../../data/districts"; // Ensure this matches path

const Profile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = localStorage.getItem("access-token");
  const [isEditing, setIsEditing] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    enabled: !!token,
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 401) navigate("/login");
        return null;
      }
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bloodGroup: user.bloodGroup || "",
        district: user.district || "",
        upazila: user.upazila || "",
      });
      setSelectedDistrict(user.district || "");
    }
  }, [user]);

  const updateProfile = useMutation({
    mutationFn: async (data) => {
      return axios.put(
        `${import.meta.env.VITE_API_URL}/users/profile`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      toast.success("Profile updated!");
      queryClient.invalidateQueries(["profile"]);
      setIsEditing(false); // Disable edit mode
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

  if (isLoading) return <p className="p-10">Loading profile...</p>;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Profile</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn btn-secondary">
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center">
          <img
            src={user?.avatar || "https://i.ibb.co.com/M6hj99z/avatar.png"}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-primary"
          />
          <span className="badge badge-lg badge-primary mb-2">{user?.role}</span>
          <span className={`badge badge-lg ${user?.status === 'active' ? 'badge-accent' : 'badge-error'}`}>
            {user?.status}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
          <div className="form-control">
            <label className="label">Email (Cannot be changed)</label>
            <input value={user?.email || ""} readOnly className="input input-bordered bg-base-200" />
          </div>

          <div className="form-control">
            <label className="label">Name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              readOnly={!isEditing}
              className={`input input-bordered ${!isEditing ? 'bg-base-100' : ''}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">District</label>
              {isEditing ? (
                <select
                  className="select select-bordered"
                  value={formData.district}
                  onChange={(e) => {
                    setFormData({ ...formData, district: e.target.value, upazila: "" });
                    setSelectedDistrict(e.target.value);
                  }}
                >
                  <option value="">Select</option>
                  {districts?.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                </select>
              ) : (
                <input value={formData.district} readOnly className="input input-bordered bg-base-100" />
              )}
            </div>
            <div className="form-control">
              <label className="label">Upazila</label>
              {isEditing ? (
                <select
                  className="select select-bordered"
                  value={formData.upazila}
                  onChange={(e) => setFormData({ ...formData, upazila: e.target.value })}
                  disabled={!selectedDistrict}
                >
                  <option value="">Select</option>
                  {districts?.find(d => d.name === selectedDistrict)?.upazilas.map(u =>
                    <option key={u} value={u}>{u}</option>
                  )}
                </select>
              ) : (
                <input value={formData.upazila} readOnly className="input input-bordered bg-base-100" />
              )}
            </div>
          </div>

          <div className="form-control">
            <label className="label">Blood Group</label>
            {isEditing ? (
              <select
                className="select select-bordered"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            ) : (
              <input value={formData.bloodGroup} readOnly className="input input-bordered bg-base-100" />
            )}
          </div>

          {isEditing && (
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={updateProfile.isLoading}
            >
              Save Changes
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
