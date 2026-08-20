// D:/natarsal/natarsal-frontend/src/pages/admin/dashboard.tsx
import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FiLayout,
  FiCalendar,
  FiMenu,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  // ✅ FIX: Hanya 1 deklarasi navItems
  const navItems = [
    { path: "/admin/dashboard", icon: FiLayout, label: "Dashboard" },
    { path: "/admin/reservations", icon: FiCalendar, label: "Reservasi" },
    { path: "/admin/menu", icon: FiMenu, label: "Menu" },
  ];

  return (
    <div className="min-h-screen bg-natarsal-cream/20">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        } ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-natarsal-black/5">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-natarsal-gold rounded-lg flex items-center justify-center text-white font-bold text-sm">
                N
              </div>
              <span
                className={`font-display font-bold text-natarsal-black ${!isSidebarOpen && "hidden"}`}
              >
                NATARSAL
              </span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex p-2 rounded-lg hover:bg-natarsal-cream transition-colors"
            >
              <FiChevronDown
                className={`transform transition-transform duration-300 ${
                  !isSidebarOpen ? "rotate-90" : ""
                }`}
              />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-natarsal-cream transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-natarsal-gold text-white"
                      : "text-natarsal-black/60 hover:bg-natarsal-cream hover:text-natarsal-black"
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className={`${!isSidebarOpen && "hidden"}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="border-t border-natarsal-black/5 p-4">
            <div
              className={`flex items-center gap-3 ${!isSidebarOpen && "justify-center"}`}
            >
              <div className="w-10 h-10 rounded-full bg-natarsal-gold text-white flex items-center justify-center font-bold">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div className={`flex-1 ${!isSidebarOpen && "hidden"}`}>
                <p className="font-medium text-natarsal-black">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-natarsal-black/40">
                  {user?.role || "ADMIN"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors ${
                  !isSidebarOpen && "ml-0"
                }`}
                title="Logout"
              >
                <FiLogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-sm px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-natarsal-cream transition-colors"
          >
            <FiMenu size={24} />
          </button>
          <h1 className="font-display text-xl font-bold text-natarsal-black md:hidden">
            NATARSAL
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-natarsal-black/60 hidden sm:inline">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              onClick={handleLogout}
              className="md:hidden p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
