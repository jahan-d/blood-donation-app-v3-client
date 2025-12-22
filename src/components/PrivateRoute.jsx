// src/routes/PrivateRoute.jsx
import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext/AuthProvider";

const PrivateRoute = ({ children }) => {
  const { user, firebaseUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Not logged in
  if (!firebaseUser || !user) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;
