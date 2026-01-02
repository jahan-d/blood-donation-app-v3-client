import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router"; // react-router v6+
import { useAuth } from "../../contexts/AuthContext/AuthProvider";

const Funding = () => {
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const token = localStorage.getItem("access-token");
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // FETCH FUNDS
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["fundings", page],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/funds`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${localStorage.getItem("access-token")}` }
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const funds = data?.funds || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Handle Payment Success Return
  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");
    const amountVal = searchParams.get("amount");

    if (success === "true" && sessionId && amountVal) {
      // Confirm and Save to Database
      const savePayment = async () => {
        try {
          // Idempotency check handled by server (409 if exists)
          await axios.post(
            `${import.meta.env.VITE_API_URL}/funds`,
            {
              amount: Number(amountVal),
              transactionId: sessionId,
              userName: user?.displayName || user?.name || "Anonymous Donor",
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("Payment Verified & Recorded!");
          queryClient.invalidateQueries(["fundings"]);
        } catch (error) {
          if (error.response?.status === 409) {
            // Already recorded, just show success
            // toast.success("Donation already recorded.");
          } else {
            console.error("Payment Save Error:", error);
            toast.error("Could not verify payment.");
          }
        } finally {
          // Clear params to prevent re-trigger on refresh
          setSearchParams({});
          navigate("/dashboard/funding", { replace: true });
        }
      };

      savePayment();
    } else if (searchParams.get("canceled") === "true") {
      toast.error("Payment Canceled");
      setSearchParams({});
      navigate("/dashboard/funding", { replace: true });
    }
  }, [searchParams, user, token, queryClient, navigate, setSearchParams]);


  // Handle Initiate Payment (Redirect)
  const handleDonate = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const toastId = toast.loading("Redirecting to Stripe...");
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-checkout-session`,
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect to Stripe
      window.location.href = data.url;

    } catch (error) {
      console.error("Initiate Error:", error);
      toast.error("Failed to start payment");
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-6">Funding</h2>

      <button
        className="btn btn-primary mb-6"
        onClick={() => setIsModalOpen(true)}
      >
        Give Fund
      </button>

      {/* Funding Table */}
      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {funds.map(fund => (
              <tr key={fund._id}>
                <td>{fund.userName || "Anonymous"}</td>
                <td>${fund.amount}</td>
                <td>{new Date(fund.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 btn-group">
        <button
          className="btn"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          «
        </button>
        <button className="btn">Page {page}</button>
        <button
          className="btn"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          »
        </button>
      </div>

      {/* Simplified Modal (DaisyUI Standard) */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-100 text-base-content">
            <h3 className="font-bold text-lg text-center mb-4">Donate with Stripe</h3>
            <p className="text-sm text-center mb-4 opacity-70">You will be redirected to Stripe's secure payment page.</p>

            <div className="form-control w-full max-w-xs mx-auto mb-6">
              <label className="label">
                <span className="label-text">Amount (BDT)</span>
              </label>
              <input
                type="number"
                placeholder="Ex. 100"
                className="input input-bordered w-full"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="modal-action justify-center">
              <button className="btn btn-ghost" onClick={() => { setIsModalOpen(false); setAmount(""); }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleDonate} disabled={!amount}>Pay Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funding;
