import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router";

const Funding = () => {
  const token = localStorage.getItem("access-token");
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");

  // PUBLIC funding data
  const { data = [], isLoading } = useQuery({
    queryKey: ["fundings"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/fundings/public`
      );
      return res.data;
    },
  });

  const handleDonate = async () => {
    if (!token) {
      toast.error("Please login to donate");
      return navigate("/login");
    }

    if (!amount || Number(amount) < 10) {
      return toast.error("Minimum donation is 10");
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-payment-intent`,
        { amount: Number(amount) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      window.location.replace(res.data.url);
    } catch {
      toast.error("Payment initiation failed");
    }
  };

  const totalAmount = data.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  if (isLoading) return <p>Loading funding info...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Funding</h2>

      {/* Donate Box */}
      <div className="card bg-base-200 mb-6">
        <div className="card-body">
          <h3 className="font-semibold">Support Our Mission</h3>

          <input
            type="number"
            placeholder="Enter amount"
            className="input input-bordered w-full max-w-xs"
            value={amount}
            min={10}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            className="btn btn-primary mt-3 w-fit"
            onClick={handleDonate}
          >
            Donate
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="stats shadow mb-6">
        <div className="stat">
          <div className="stat-title">Total Funding</div>
          <div className="stat-value">৳ {totalAmount}</div>
        </div>
      </div>

      {/* Funding History */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((fund) => (
              <tr key={fund._id}>
                <td>Anonymous</td>
                <td>৳ {fund.amount}</td>
                <td>
                  {new Date(fund.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Funding;
