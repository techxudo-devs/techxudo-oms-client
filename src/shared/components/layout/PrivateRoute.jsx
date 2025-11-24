import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const PrivateRoute = ({
  allowAdmin = false,
  allowEmployee = false,
  allowBoth = false,
}) => {
  const { user, isAdmin, isEmployee } = useAuth();

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Allow both admin and employee
  if (allowBoth) {
    return <Outlet />;
  }

  // Admin-only route
  if (allowAdmin && !isAdmin) {
    return <Navigate to="/employee/dashboard" replace />;
  }

  // Employee-only route
  if (allowEmployee && !isEmployee) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
