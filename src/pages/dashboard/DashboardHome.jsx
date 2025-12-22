import { useAuth } from "../../contexts/AuthContext/AuthProvider";
import useUserRole from "../../hooks/useUserRole";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";

const DashboardHome = () => {
    const { user } = useAuth();
    const [role] = useUserRole();
    const token = localStorage.getItem("access-token");

    // Fetch recent requests for donors
    const { data: recentRequests = [] } = useQuery({
        queryKey: ["recent-requests"],
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/donation-requests/my`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Sort by date/time (simplified) or creation and take 3
            return res.data.slice(0, 3);
        },
        enabled: role === "donor",
    });

    // Fetch stats for Admin/Volunteer
    const { data: stats } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: async () => {
            const authHeader = { headers: { Authorization: `Bearer ${token}` } };
            const [users, funds, requests] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/users`, authHeader),
                axios.get(`${import.meta.env.VITE_API_URL}/funds/total`, authHeader),
                axios.get(`${import.meta.env.VITE_API_URL}/donation-requests`, authHeader),
            ]);
            return {
                totalUsers: users.data.length,
                totalFunds: funds.data.total,
                totalRequests: requests.data.length,
            };
        },
        enabled: role === "admin" || role === "volunteer",
    });

    return (
        <div className="p-5">
            <h2 className="text-3xl font-bold mb-4">Welcome, {user.displayName}!</h2>

            {/* DONOR VIEW */}
            {role === "donor" && (
                <div>
                    <h3 className="text-xl font-semibold mb-3">Your Recent Donation Requests</h3>
                    {recentRequests.length === 0 ? (
                        <p>You haven't made any donation requests yet.</p>
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
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentRequests.map((req) => (
                                        <tr key={req._id}>
                                            <td>{req.recipientName}</td>
                                            <td>{req.recipientDistrict}, {req.recipientUpazila}</td>
                                            <td>
                                                {req.donationDate} at {req.donationTime}
                                            </td>
                                            <td>{req.bloodGroup}</td>
                                            <td>
                                                <span className={`badge ${req.status === 'inprogress' ? 'badge-warning' : req.status === 'done' ? 'badge-success' : 'badge-ghost'}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="flex gap-2 flex-wrap">
                                                {/* View Button */}
                                                <Link to={`/donation-requests/${req._id}`} className="btn btn-xs btn-info">View</Link>

                                                {/* Edit/Delete if status is pending (usually) or always? Requirement says "Edit" and "Delete" button to delete... confirmation modal. */}
                                                <Link to={`/dashboard/update-donation-request/${req._id}`} className="btn btn-xs btn-primary">Edit</Link>

                                                {/* Status Actions */}
                                                {req.status === 'inprogress' && (
                                                    <>
                                                        <button className="btn btn-xs btn-success">Done</button>
                                                        <button className="btn btn-xs btn-error">Cancel</button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="mt-4">
                        <Link to="/dashboard/my-donation-requests" className="btn btn-primary btn-sm">
                            View My All Requests
                        </Link>
                    </div>
                </div>
            )}

            {/* ADMIN/VOLUNTEER VIEW */}
            {(role === "admin" || role === "volunteer") && stats && (
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="stat bg-base-100 shadow rounded-box">
                        <div className="stat-figure text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </div>
                        <div className="stat-title">Total Users</div>
                        <div className="stat-value">{stats.totalUsers}</div>
                        <div className="stat-desc">Donors & Volunteers</div>
                    </div>

                    <div className="stat bg-base-100 shadow rounded-box">
                        <div className="stat-figure text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div className="stat-title">Total Funding</div>
                        <div className="stat-value text-green-600">${stats.totalFunds}</div>
                        <div className="stat-desc">Donations collected</div>
                    </div>

                    <div className="stat bg-base-100 shadow rounded-box">
                        <div className="stat-figure text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        </div>
                        <div className="stat-title">Blood Requests</div>
                        <div className="stat-value">{stats.totalRequests}</div>
                        <div className="stat-desc">Total requests made</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardHome;
