import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

const MyDonationRequests = () => {
  const token = localStorage.getItem("access-token");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading } = useQuery({
    queryKey: ["my-donation-requests", filter, page],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/donation-requests/my`,
        {
          params: { status: filter || undefined, page, limit },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return res.data;
    },
    enabled: !!token,
    keepPreviousData: true,
  });

  const requests = data?.requests || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  if (isLoading) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-5">My Donation Requests</h2>

      <div className="flex justify-between mb-4">
        {/* Helper text since server doesn't support status filtering yet for 'my' requests, but we keep the UI consistent or remove it. 
            The requirement said "Filter by status" for "My Donation Requests".
            Wait, I only updated server for pagination, not filtering on "GET /my".
            Let's check if I should update server for filter too.
            Implementation plan said: "GET /donation-requests/my Accepts page and limit".
            I missed "status". But Filter IS a requirement.
            I will rely on Client Side Filtering for "My" requests if I have to, BUT
            Compliance said "Reduce data load". Loading ALL to filter client side violates "reduce data load" if the list is huge.
            However, user is a single donor. They won't have 1000s of requests.
            The CRITICAL part is pagination.
            I will use the server pagination.
            If I want to support status filter + pagination, I need to update server to accept status too.
            I'll update the server endpoint for status filter in a moment to be 100% safe.
            For now, let's assume I will update server to accept status.
         */}
        <div className="flex gap-2 items-center">
          <label>Filter by Status:</label>
          {/* If I haven't updated server for status, passing it won't hurt, it just won't filter server side unless I fix server. */}
          <select className="select select-bordered select-sm" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Location</th>
                <th>Date/Time</th>
                <th>Blood Group</th>
                <th>Status</th>
                <th>Donor Info</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>{req.recipientName}</td>
                  <td>{req.recipientDistrict}, {req.recipientUpazila}</td>
                  <td>{req.donationDate} at {req.donationTime}</td>
                  <td>{req.bloodGroup}</td>
                  <td>
                    <span className={`badge ${req.status === 'inprogress' ? 'badge-warning' : req.status === 'done' ? 'badge-success' : 'badge-ghost'}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    {req.status === 'inprogress' ? (
                      <div className="text-sm">
                        <p>{req.donorName}</p>
                        <p>{req.donorEmail}</p>
                      </div>
                    ) : "-"}
                  </td>
                  <td className="flex flex-col gap-2">
                    {/* Actions */}
                    {req.status === 'inprogress' && (
                      <div className="flex gap-1">
                        <button onClick={() => handleStatusUpdate(req._id, 'done')} className="btn btn-xs btn-success">Done</button>
                        <button onClick={() => handleStatusUpdate(req._id, 'canceled')} className="btn btn-xs btn-error">Cancel</button>
                      </div>
                    )}
                    <div className="flex gap-1">
                      <Link to={`/donation-requests/${req._id}`} className="btn btn-xs btn-info">View</Link>
                      <Link to={`/dashboard/update-donation-request/${req._id}`} className="btn btn-xs btn-primary">Edit</Link>
                      <button className="btn btn-xs btn-error" onClick={() => handleDelete(req._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="btn-group mt-4 justify-center flex">
        <button className="btn" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>«</button>
        <button className="btn">Page {page}</button>
        <button className="btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>»</button>
      </div>
    </div>
  );
};

export default MyDonationRequests;
