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

  const refreshAccessToken = async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.log("No refresh token found");
      return false;
    }

    try {
      console.log("Attempting to refresh token...");
      const response = await apiClient.refreshToken(refreshToken);

      if (response.success && response.data?.token) {
        localStorage.setItem("token", response.data.token);
        console.log("Token refreshed successfully");
        return true;
      }

      console.log("Refresh token failed:", response.error?.message);
      return false;
    } catch (error) {
      console.error("Refresh token error:", error);
      return false;
    }
  };

  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No token found, redirecting to login");
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        let response = await apiClient.getMe(token);

        if (!response.success && response.error?.code === "UNAUTHORIZED") {
          console.log("Token expired, attempting refresh...");
          const refreshed = await refreshAccessToken();

          if (refreshed) {
            const newToken = localStorage.getItem("token")!;
            response = await apiClient.getMe(newToken);
            console.log("Auth verified after refresh");
          } else {
            console.log("Refresh failed, redirecting to login");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
          }
        }

        if (response.success && response.data) {
          setIsAuthenticated(true);
          setIsAdmin(response.data.role === "ADMIN");
          localStorage.setItem("user", JSON.stringify(response.data));
        } else {
          console.log("Auth verification failed:", response.error?.message);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();

    const refreshInterval = setInterval(
      () => {
        if (isAuthenticated) {
          refreshAccessToken();
        }
      },
      10 * 60 * 1000,
    );

    return () => clearInterval(refreshInterval);
  }, [location, isAuthenticated]);

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
