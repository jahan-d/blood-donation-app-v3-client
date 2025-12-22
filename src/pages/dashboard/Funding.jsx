import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Initialize Stripe (Replace with your actual Publishable Key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK || "pk_test_51L1nmKBCp6l...example");

const CheckoutForm = ({ amount, closeModal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth(); // Assuming useAuth is available or passed via props
  const token = localStorage.getItem("access-token");
  const queryClient = useQueryClient();

  // Helper to get user info if not passed directly, but we can assume parent passes it or we fetch form context
  // For simplicity, we just use what we have.

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setProcessing(true);

    try {
      // 1. Create Payment Intent
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-payment-intent`,
        { amount: parseInt(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const clientSecret = data.clientSecret;

      // 2. Confirm Payment
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: "Donor", // Can be dynamic
            email: "donor@example.com"
          },
        },
      });

      if (error) {
        toast.error(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // 3. Save to Funds Collection
        await axios.post(
          `${import.meta.env.VITE_API_URL}/funds`,
          {
            amount: parseInt(amount),
            transactionId: paymentIntent.id,
            userName: "Donor", // ideally from auth
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success("Donation successful!");
        queryClient.invalidateQueries(["fundings"]);
        closeModal();
      }

    } catch (err) {
      // console.error(err);
      toast.error("Payment failed");
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded bg-base-100">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn btn-primary w-full"
      >
        {processing ? "Processing..." : `Pay $${amount}`}
      </button>
    </form>
  );
};

// Need to import useAuth to get user name usually, but let's keep it simple
import { useAuth } from "../../contexts/AuthContext/AuthProvider";

const Funding = () => {
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // FETCH FUNDS
  const [page, setPage] = useState(1);
  const limit = 10;

  // FETCH FUNDS
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Make a Donation</h3>

            {!amount ? (
              <div className="space-y-4">
                <label className="label">Enter Amount ($)</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button
                  className="btn btn-primary w-full"
                  onClick={() => { if (!amount) toast.error("Enter amount"); }}
                >
                  Next
                </button>
              </div>
            ) : (
              <Elements stripe={stripePromise}>
                <CheckoutForm amount={amount} closeModal={() => { setIsModalOpen(false); setAmount(""); }} />
              </Elements>
            )}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => { setIsModalOpen(false); setAmount(""); }}
            >✕</button>
            <div className="modal-action">
              <button className="btn" onClick={() => { setIsModalOpen(false); setAmount(""); }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funding;
