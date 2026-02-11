import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = authService.getUser();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
