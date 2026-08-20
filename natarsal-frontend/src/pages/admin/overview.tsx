// D:/natarsal/natarsal-frontend/src/pages/admin/overview.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiArrowRight,
} from "react-icons/fi";
import apiClient from "../../config/api";

interface DashboardStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  today: number;
}

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    today: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await apiClient.getReservations(token, 1, 100);

        if (response.success && response.data) {
          const reservations = response.data;
          const today = new Date().toISOString().split("T")[0];

          setStats({
            total: reservations.length,
            pending: reservations.filter((r: any) => r.status === "PENDING")
              .length,
            confirmed: reservations.filter((r: any) => r.status === "CONFIRMED")
              .length,
            completed: reservations.filter((r: any) => r.status === "COMPLETED")
              .length,
            cancelled: reservations.filter((r: any) => r.status === "CANCELLED")
              .length,
            today: reservations.filter(
              (r: any) =>
                new Date(r.date).toISOString().split("T")[0] === today,
            ).length,
          });
        }
      } catch (err: any) {
        setError(err.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Reservasi",
      value: stats.total,
      icon: FiCalendar,
      color: "bg-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Menunggu Konfirmasi",
      value: stats.pending,
      icon: FiClock,
      color: "bg-yellow-500",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
    },
    {
      title: "Terkonfirmasi",
      value: stats.confirmed,
      icon: FiCheckCircle,
      color: "bg-green-500",
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      title: "Selesai",
      value: stats.completed,
      icon: FiCheckCircle,
      color: "bg-emerald-500",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      title: "Dibatalkan",
      value: stats.cancelled,
      icon: FiXCircle,
      color: "bg-red-500",
      bg: "bg-red-50",
      text: "text-red-600",
    },
    {
      title: "Hari Ini",
      value: stats.today,
      icon: FiCalendar,
      color: "bg-purple-500",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-natarsal-gold border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-natarsal-black">
            Dashboard
          </h1>
          <p className="text-natarsal-black/60 text-sm">
            Ringkasan reservasi restoran
          </p>
        </div>
        <Link
          to="/admin/reservations"
          className="inline-flex items-center gap-2 px-4 py-2 bg-natarsal-gold text-white rounded-lg hover:bg-natarsal-black transition-colors"
        >
          Lihat Semua Reservasi
          <FiArrowRight />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className={`${card.bg} p-2 rounded-lg`}>
                  <Icon className={`${card.text} text-lg`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-natarsal-black">
                    {card.value}
                  </p>
                  <p className="text-xs text-natarsal-black/50">{card.title}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-display font-semibold text-natarsal-black mb-4">
            Reservasi Hari Ini
          </h3>
          {stats.today === 0 ? (
            <p className="text-natarsal-black/40 text-sm">
              Tidak ada reservasi hari ini
            </p>
          ) : (
            <p className="text-natarsal-black/60 text-sm">
              Ada{" "}
              <span className="font-bold text-natarsal-gold">
                {stats.today}
              </span>{" "}
              reservasi hari ini
            </p>
          )}
          <Link
            to="/admin/reservations?filter=today"
            className="inline-block mt-3 text-sm text-natarsal-gold hover:text-natarsal-black transition-colors"
          >
            Lihat Detail →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-display font-semibold text-natarsal-black mb-4">
            Perlu Konfirmasi
          </h3>
          {stats.pending === 0 ? (
            <p className="text-natarsal-black/40 text-sm">
              Semua reservasi sudah dikonfirmasi
            </p>
          ) : (
            <p className="text-natarsal-black/60 text-sm">
              Ada{" "}
              <span className="font-bold text-yellow-600">{stats.pending}</span>{" "}
              reservasi menunggu konfirmasi
            </p>
          )}
          <Link
            to="/admin/reservations?filter=pending"
            className="inline-block mt-3 text-sm text-natarsal-gold hover:text-natarsal-black transition-colors"
          >
            Lihat Detail →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
