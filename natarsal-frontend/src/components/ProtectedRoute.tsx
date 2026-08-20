// D:/natarsal/natarsal-frontend/src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import apiClient from "../config/api";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requireAdmin = true,
}) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Refresh token function
  const refreshAccessToken = async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;

    try {
      const response = await apiClient.refreshToken(refreshToken);
      if (response.success && response.data) {
        localStorage.setItem("token", response.data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Refresh token failed:", error);
      return false;
    }
  };

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        let token = localStorage.getItem("token");

        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Try to verify token
        let response = await apiClient.getMe(token);

        // If token expired, try refresh
        if (!response.success && response.error?.code === "UNAUTHORIZED") {
          console.log("Token expired, attempting refresh...");
          const refreshed = await refreshAccessToken();

          if (refreshed) {
            const newToken = localStorage.getItem("token")!;
            response = await apiClient.getMe(newToken);
          }
        }

        if (response.success && response.data) {
          setIsAuthenticated(true);
          setIsAdmin(response.data.role === "ADMIN");
        } else {
          // Token invalid
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-natarsal-cream/20">
        <FiLoader className="animate-spin text-natarsal-gold text-4xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
