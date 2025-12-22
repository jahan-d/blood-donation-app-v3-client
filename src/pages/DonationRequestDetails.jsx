import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext/AuthProvider";
import { useState } from "react";

const DonationRequestDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: request, isLoading, isError } = useQuery({
        queryKey: ["donation-request", id],
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/donation-requests/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access-token")}`
                    }
                }
            );
            return res.data;
        },
    });

    const handleDonate = async () => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/donation-requests/donate/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access-token")}`
                    }
                }
            );
            toast.success("Thank you! Please contact the requester.");
            setIsModalOpen(false);
            // Ideally refetch or navigate
            navigate("/donation-requests");
        } catch {
            toast.error("Failed to process donation.");
        }
    };

    if (isLoading) return <p className="text-center py-10">Loading details...</p>;
    if (isError || !request) return <p className="text-center py-10">Request not found.</p>;

    return (
        <div className="container mx-auto py-10 px-5 max-w-4xl">
            <div className="card bg-base-100 shadow-xl border">
                <div className="card-body">
                    <h2 className="card-title text-3xl mb-4">
                        Details for {request.recipientName}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <p><strong>Hospital:</strong> {request.hospitalName}</p>
                            <p><strong>Location:</strong> {request.recipientDistrict}, {request.recipientUpazila}</p>
                            <p><strong>Address:</strong> {request.fullAddress}</p>
                        </div>
                        <div>
                            <p><strong>Blood Group:</strong> <span className="badge badge-error text-white font-bold">{request.bloodGroup}</span></p>
                            <p><strong>Date:</strong> {request.donationDate}</p>
                            <p><strong>Time:</strong> {request.donationTime}</p>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div>
                        <h3 className="font-semibold mb-2">Requester Info</h3>
                        <p><strong>Name:</strong> {request.requesterName}</p>
                        <p><strong>Message:</strong> {request.requestMessage}</p>
                    </div>

                    <div className="card-actions justify-end mt-6">
                        {user ? (
                            <button
                                className="btn btn-primary"
                                onClick={() => setIsModalOpen(true)}
                                disabled={request.status !== 'pending'}
                            >
                                {request.status === 'pending' ? 'Donate Now' : 'Donation In Progress/Done'}
                            </button>
                        ) : (
                            <button
                                className="btn btn-warning"
                                onClick={() => navigate("/login")}
                            >
                                Login to Donate
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg max-w-sm w-full">
                        <h3 className="text-xl font-bold mb-4">Confirm Donation</h3>
                        <p className="mb-6">Are you sure you want to donate blood for this request? This will change the status to "In Progress".</p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleDonate}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationRequestDetails;
