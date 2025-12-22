// src/components/Sidebar.jsx
import { NavLink } from "react-router";
import { FaUser, FaUsers, FaDonate, FaHeart, FaClipboardList, FaHome } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext/AuthProvider";
import useUserRole from "../hooks/useUserRole";

const Sidebar = () => {
  const { logoutUser } = useAuth();
  const [role, status, roleLoading] = useUserRole();

  if (roleLoading) {
    return (
      <aside className="w-64 bg-base-200 p-4 hidden md:flex items-center justify-center">
        <span className="loading loading-spinner loading-md"></span>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-base-200 min-h-screen p-4 hidden md:block">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      <ul className="menu p-0 gap-1">
        {/* Common */}
        <li>
          <NavLink to="/">
            <FaHome /> Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/profile">
            <FaUser /> Profile
          </NavLink>
        </li>

        {/* Donor */}
        {role === "donor" && (
          <>
            <li>
              <NavLink to="/dashboard/my-donation-requests">
                <FaClipboardList /> My Requests
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/create-donation-request">
                <FaHeart /> Create Request
              </NavLink>
            </li>
          </>
        )}

        {/* Admin */}
        {role === "admin" && (
          <>
            <li>
              <NavLink to="/dashboard/all-users">
                <FaUsers /> All Users
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/all-donation-requests">
                <FaClipboardList /> All Requests
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/funding">
                <FaDonate /> Funding
              </NavLink>
            </li>
          </>
        )}

        {/* Volunteer */}
        {role === "volunteer" && (
          <>
            <li>
              <NavLink to="/dashboard/all-donation-requests">
                <FaClipboardList /> All Requests
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/funding">
                <FaDonate /> Funding
              </NavLink>
            </li>
          </>
        )}

        <div className="divider"></div>

        <li>
          <button onClick={logoutUser} className="text-error">
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
