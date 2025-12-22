// src/routes/RoleRoute.jsx
import { Navigate } from "react-router";
import useUserRole from "../hooks/useUserRole";
import { useAuth } from "../contexts/AuthContext/AuthProvider";

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const [role, status, roleLoading] = useUserRole();

  if (loading || roleLoading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (status === "blocked") return <Navigate to="/blocked" replace />;

  if (!allowedRoles.includes(role)) return <Navigate to="/dashboard/profile" replace />;

  return children;
};

export default RoleRoute;
