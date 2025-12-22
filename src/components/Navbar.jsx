// src/components/Navbar.jsx
import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext/AuthProvider";
import useUserRole from "../hooks/useUserRole";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const [role, status, roleLoading] = useUserRole();

  return (
    <nav className="navbar bg-base-100 shadow px-6">
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold text-primary">
          🩸 Blood Donation
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link to="/donation-requests" className="btn btn-ghost btn-sm">
          Requests
        </Link>

        <Link to="/search" className="btn btn-ghost btn-sm">
          Search
        </Link>
        <Link to="/blog" className="btn btn-ghost btn-sm">
          Blog
        </Link>

        {!user && !roleLoading && (
          <>
            <Link to="/login" className="btn btn-sm btn-primary">
              Login
            </Link>
            <Link to="/register" className="btn btn-sm btn-outline">
              Register
            </Link>
          </>
        )}

        {user && !roleLoading && (
          <>
            <Link to="/dashboard" className="btn btn-sm btn-ghost">
              Dashboard
            </Link>

            {role === "donor" && (
              <Link
                to="/dashboard/my-donation-requests"
                className="btn btn-sm btn-ghost"
              >
                My Requests
              </Link>
            )}

            {(role === "admin" || role === "volunteer") && (
              <Link
                to="/dashboard/all-donation-requests"
                className="btn btn-sm btn-ghost"
              >
                All Requests
              </Link>
            )}

            {(role === "admin" || role === "volunteer") && (
              <Link
                to="/dashboard/content-management-add-blog"
                className="btn btn-sm btn-ghost"
              >
                Add Blog
              </Link>
            )}

            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={
                      user.photoURL ||
                      "https://i.ibb.co/ZYW3VTp/brown-brim.png"
                    }
                    alt="avatar"
                  />
                </div>
              </label>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li className="text-center font-semibold">{user.displayName}</li>
                <li>
                  <Link to="/dashboard/profile">Profile</Link>
                </li>
                <li>
                  <button onClick={logoutUser} className="text-error">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
