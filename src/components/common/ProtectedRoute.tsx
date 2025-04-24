
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoadingPage from "@/pages/LoadingPage";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingPage />;
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && ["/login", "/register"].includes(location.pathname)) {
    // Redirect clients to client dashboard, admins to admin dashboard
    return <Navigate to={user?.role === "client" ? "/client" : "/dashboard"} replace />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access control
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect clients to client dashboard, admins to admin dashboard
    return <Navigate to={user.role === "client" ? "/client" : "/dashboard"} replace />;
  }

  // If all checks pass, render the protected content
  return children;
};

export default ProtectedRoute;
