import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiXCircle,
  FiDownload,
  FiLoader,
  FiList,
  FiGrid,
} from "react-icons/fi";
import apiClient from "../../config/api";

interface Reservation {
  id: number;
  reservationNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  guests: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  notes?: string;
  createdAt: string;
}

const AdminReservations: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<string>(
    searchParams.get("filter") || "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const limit = 10;

  useEffect(() => {
    setShowAll(false);
    setPage(1);
  }, [selectedStatus, searchQuery]);

  useEffect(() => {
    fetchReservations();
  }, [page, selectedStatus, searchQuery, showAll]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const statusFilter =
        selectedStatus !== "all" ? selectedStatus : undefined;

      const requestLimit = showAll ? total : limit;
      const requestPage = showAll ? 1 : page;

      const response = await apiClient.getReservations(
        token,
        requestPage,
        requestLimit,
        undefined,
        statusFilter,
        searchQuery || undefined,
      );

      if (response.success && response.data) {
        setReservations(response.data);
        setTotal(response.meta?.total || 0);
        setTotalPages(response.meta?.totalPages || 1);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  const handleShowAll = () => {
    setShowAll(true);
    setPage(1);
  };

  const handleShowPaged = () => {
    setShowAll(false);
    setPage(1);
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      setActionLoading(id);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await apiClient.updateReservationStatus(
        token,
        id,
        status,
      );

      if (response.success) {
        await fetchReservations();
      }
    } catch (err: any) {
      setError(err.message || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm("Yakin ingin membatalkan reservasi ini?")) return;

    try {
      setActionLoading(id);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await apiClient.cancelReservation(token, id);

      if (response.success) {
        await fetchReservations();
      }
    } catch (err: any) {
      setError(err.message || "Failed to cancel reservation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const params: { from?: string; to?: string; status?: string } = {};

      if (selectedStatus !== "all") {
        params.status = selectedStatus;
      }

      const blob = await apiClient.exportReservations(token, params);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reservations-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; className: string }> = {
      PENDING: {
        label: "Menunggu",
        className: "bg-yellow-800 text-white",
      },
      CONFIRMED: {
        label: "Terkonfirmasi",
        className: "bg-green-800 text-white",
      },
      COMPLETED: {
        label: "Selesai",
        className: "bg-blue-800 text-white",
      },
      CANCELLED: {
        label: "Dibatalkan",
        className: "bg-red-800 text-white",
      },
    };
    const config = configs[status] || configs["PENDING"];
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  const statusOptions = [
    { value: "all", label: "Semua" },
    { value: "PENDING", label: "Menunggu" },
    { value: "CONFIRMED", label: "Terkonfirmasi" },
    { value: "COMPLETED", label: "Selesai" },
    { value: "CANCELLED", label: "Dibatalkan" },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && page === 1 && !showAll) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-natarsal-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="font-display text-2xl font-bold text-natarsal-white/70 text-center">
            Total {total} reservasi
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || reservations.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? (
            <FiLoader className="animate-spin" />
          ) : (
            <FiDownload size={18} />
          )}
          Export Excel
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-natarsal-black/40" />
            <input
              type="text"
              placeholder="Cari nama, email, atau nomor reservasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedStatus === option.value
                    ? "bg-natarsal-gold text-white"
                    : "bg-natarsal-cream/50 text-natarsal-black/60 hover:bg-natarsal-cream"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-white border border-red-600 rounded-lg p-4 mb-6 text-red-600">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-natarsal-cream/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-natarsal-black/60 uppercase tracking-wider">
                  No. Reservasi
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-natarsal-black/60 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-natarsal-black/60 uppercase tracking-wider">
                  Tanggal & Jam
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-natarsal-black/60 uppercase tracking-wider">
                  Tamu
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-natarsal-black/60 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-natarsal-black/60 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-natarsal-black/5">
              {reservations.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-natarsal-black/40"
                  >
                    Tidak ada reservasi yang ditemukan
                  </td>
                </tr>
              ) : (
                reservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="hover:bg-natarsal-cream/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-medium text-natarsal-black">
                        {reservation.reservationNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-natarsal-black">
                          {reservation.customerName}
                        </p>
                        <p className="text-xs text-natarsal-black/40">
                          {reservation.customerEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-natarsal-black/80">
                        {formatDate(reservation.date)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-natarsal-black/80">
                        {reservation.guests} orang
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(reservation.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {reservation.status === "PENDING" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(reservation.id, "CONFIRMED")
                              }
                              disabled={actionLoading === reservation.id}
                              className="p-1.5 bg-white text-green-600 rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50"
                              title="Konfirmasi"
                            >
                              <FiCheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => handleCancel(reservation.id)}
                              disabled={actionLoading === reservation.id}
                              className="p-1.5 bg-white text-red-600 rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50"
                              title="Batalkan"
                            >
                              <FiXCircle size={18} />
                            </button>
                          </>
                        )}
                        {reservation.status === "CONFIRMED" && (
                          <button
                            onClick={() =>
                              handleStatusChange(reservation.id, "COMPLETED")
                            }
                            disabled={actionLoading === reservation.id}
                            className="p-1.5 bg-white text-blue-600 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50"
                            title="Tandai Selesai"
                          >
                            <FiCheckCircle size={18} />
                          </button>
                        )}
                        {actionLoading === reservation.id && (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-natarsal-gold border-t-transparent" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-natarsal-black/5">
          <p className="text-sm text-natarsal-black/40">
            {showAll
              ? `Menampilkan semua ${total} data`
              : `Menampilkan ${(page - 1) * limit + 1} - ${Math.min(
                  page * limit,
                  total,
                )} dari ${total}`}
          </p>

          <div className="flex items-center gap-2">
            {showAll ? (
              <button
                onClick={handleShowPaged}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-natarsal-cream/50 text-natarsal-black/60 hover:bg-natarsal-cream hover:text-natarsal-black transition-all"
                title="Kembali ke tampilan per halaman"
              >
                <FiGrid size={16} />
                Tampilkan Per Halaman
              </button>
            ) : (
              <>
                {total > limit && (
                  <button
                    onClick={handleShowAll}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-natarsal-gold text-white hover:bg-natarsal-black transition-all"
                    title={`Tampilkan semua ${total} data`}
                  >
                    <FiList size={16} />
                    Tampilkan Semua ({total})
                  </button>
                )}

                {totalPages > 1 && (
                  <>
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-natarsal-black/10 hover:bg-natarsal-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Halaman sebelumnya"
                    >
                      <FiChevronLeft />
                    </button>
                    <span className="text-sm text-natarsal-black/60 px-2">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="p-2 rounded-lg border border-natarsal-black/10 hover:bg-natarsal-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Halaman berikutnya"
                    >
                      <FiChevronRight />
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReservations;
