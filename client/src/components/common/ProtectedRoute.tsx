// ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoadingPage from "@/pages/LoadingPage";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // If still loading, show a loading page or something similar
  if (loading) {
    return <LoadingPage />;
  }

  // If the user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If the user is authenticated, render the children (the protected route)
  return children;
};

export default ProtectedRoute;
