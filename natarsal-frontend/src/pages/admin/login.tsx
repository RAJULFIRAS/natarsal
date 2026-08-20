// D:/natarsal/natarsal-frontend/src/pages/admin/login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLoader, FiAlertCircle } from "react-icons/fi";
import apiClient from "../../config/api";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.login(formData);

      if (response.success && response.data) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        navigate("/admin/dashboard");
      } else {
        setError(response.error?.message || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-natarsal-cream/30 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-natarsal-black">
            NATARSAL
          </h1>
          <p className="text-natarsal-black/60 text-sm mt-1">Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="font-display text-2xl font-bold text-natarsal-black mb-2">
            Admin Login
          </h2>
          <p className="text-natarsal-black/60 text-sm mb-6">
            Masuk untuk mengelola reservasi restoran
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-natarsal-black/40" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@natarsal.com"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-natarsal-black/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-natarsal-black/40 hover:text-natarsal-black/60"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-natarsal-gold text-white py-3 rounded-lg font-medium transition-all duration-300 hover:bg-natarsal-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <FiLoader className="animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-natarsal-black/40">
              Gunakan akun admin yang telah disediakan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
