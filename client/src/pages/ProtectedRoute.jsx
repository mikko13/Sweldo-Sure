import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import authService from "./services/authService";

function ProtectedRoute({ requireAdmin = false, requireUser = false }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    async function validateUser() {
      try {
        const token = authService.getToken();

        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const userData = await authService.getCurrentUser();
        setIsAuthenticated(true);
        setUserRole(userData.role);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    validateUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requireAdmin && userRole !== "admin") {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  if (requireUser && userRole !== "user" && userRole !== "admin") {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
