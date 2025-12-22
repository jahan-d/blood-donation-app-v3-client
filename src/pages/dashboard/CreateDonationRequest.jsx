import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext/AuthProvider";
import { districts } from "../../data/districts";
import { useState } from "react";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const CreateDonationRequest = () => {
  const { user } = useAuth(); // logged-in user
  const token = localStorage.getItem("access-token");
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm();
  const [selectedDistrict, setSelectDistrict] = useState("");

  const mutation = useMutation({
    mutationFn: async (data) => {
      return axios.post(
        `${import.meta.env.VITE_API_URL}/donation-requests`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      toast.success("Donation request created");
      queryClient.invalidateQueries(["my-donation-requests"]);
      reset();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Request failed");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      requesterName: user.name,
      requesterEmail: user.email,
    });
  };

  return (
    <div className="p-5 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6">
        Create Donation Request
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Requester info */}
        <input
          value={user.name}
          readOnly
          className="input input-bordered"
        />
        <input
          value={user.email}
          readOnly
          className="input input-bordered"
        />

        {/* Recipient */}
        <input
          {...register("recipientName", { required: true })}
          placeholder="Recipient Name"
          className="input input-bordered"
        />

        <input
          {...register("hospitalName", { required: true })}
          placeholder="Hospital Name"
          className="input input-bordered"
        />

        <select
          {...register("recipientDistrict", { required: true })}
          className="select select-bordered"
          onChange={(e) => setSelectDistrict(e.target.value)}
        >
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d.name} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          {...register("recipientUpazila", { required: true })}
          className="select select-bordered"
          disabled={!selectedDistrict}
        >
          <option value="">Select Upazila</option>
          {districts
            .find((d) => d.name === selectedDistrict)
            ?.upazilas.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
        </select>

        <input
          {...register("fullAddress", { required: true })}
          placeholder="Full Address (Ward, House No, etc.)"
          className="input input-bordered md:col-span-2"
        />

        <select
          {...register("bloodGroup", { required: true })}
          className="select select-bordered"
        >
          <option value="">Select Blood Group</option>
          {bloodGroups.map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>

        <input
          type="date"
          {...register("donationDate", { required: true })}
          className="input input-bordered"
          min={new Date().toISOString().split("T")[0]} // Prevent past dates
        />

        <input
          type="time"
          {...register("donationTime", { required: true })}
          className="input input-bordered"
        />

        <textarea
          {...register("requestMessage", { required: true })}
          placeholder="Why do you need blood?"
          className="textarea textarea-bordered md:col-span-2"
        />

        <button
          type="submit"
          className="btn btn-primary md:col-span-2"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Submitting..." : "Request"}
        </button>
      </form>
    </div>
  );
};

export default CreateDonationRequest;
