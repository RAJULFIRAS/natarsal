// D:/natarsal/natarsal-frontend/src/pages/check-status.tsx
import React, { useState } from "react";
import {
  FiSearch,
  FiLoader,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";
import Layout from "../../components/layout/layout";
import apiClient from "../../config/api";

const CheckStatus: React.FC = () => {
  const [reservationNumber, setReservationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservationNumber || !email) {
      setError("Nomor reservasi dan email wajib diisi");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await apiClient.checkReservationStatus(
        reservationNumber,
        email,
      );

      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error?.message || "Reservasi tidak ditemukan");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<
      string,
      { label: string; icon: JSX.Element; className: string }
    > = {
      PENDING: {
        label: "Menunggu Konfirmasi",
        icon: <FiClock className="text-yellow-500" />,
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      },
      CONFIRMED: {
        label: "Terkonfirmasi",
        icon: <FiCheckCircle className="text-green-500" />,
        className: "bg-green-50 text-green-700 border-green-200",
      },
      COMPLETED: {
        label: "Selesai",
        icon: <FiCheckCircle className="text-blue-500" />,
        className: "bg-blue-50 text-blue-700 border-blue-200",
      },
      CANCELLED: {
        label: "Dibatalkan",
        icon: <FiXCircle className="text-red-500" />,
        className: "bg-red-50 text-red-700 border-red-200",
      },
    };
    // ✅ FIX: Gunakan bracket notation
    const config = configs[status] || configs["PENDING"];
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${config.className}`}
      >
        {config.icon}
        <span className="font-medium text-sm">{config.label}</span>
      </div>
    );
  };

  return (
    <Layout>
      <section className="section-padding bg-natarsal-cream/20 min-h-[80vh]">
        <div className="container-custom max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-natarsal-black mb-2">
              Cek Status Reservasi
            </h1>
            <p className="text-natarsal-black/60">
              Masukkan nomor reservasi dan email Anda untuk melihat status
              reservasi
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                  Nomor Reservasi *
                </label>
                <input
                  type="text"
                  value={reservationNumber}
                  onChange={(e) =>
                    setReservationNumber(e.target.value.toUpperCase())
                  }
                  placeholder="Contoh: RSV-1234567890-ABC12"
                  className="w-full px-4 py-3 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-natarsal-gold text-white rounded-lg font-medium hover:bg-natarsal-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" />
                    Mengecek...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FiSearch />
                    Cek Status
                  </span>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {result && (
              <div className="mt-6 p-6 bg-natarsal-cream/30 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-natarsal-black/60">
                      Nomor Reservasi
                    </p>
                    <p className="font-mono font-bold text-natarsal-black">
                      {result.reservationNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-natarsal-black/60">Status</p>
                    {getStatusBadge(result.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-natarsal-black/10">
                  <div>
                    <p className="text-sm text-natarsal-black/60">Nama</p>
                    <p className="font-medium text-natarsal-black">
                      {result.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-natarsal-black/60">
                      Jumlah Tamu
                    </p>
                    <p className="font-medium text-natarsal-black">
                      {result.guests} orang
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-natarsal-black/60">
                      Tanggal & Waktu
                    </p>
                    <p className="font-medium text-natarsal-black">
                      {new Date(result.date).toLocaleString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {result.notes && (
                    <div className="col-span-2">
                      <p className="text-sm text-natarsal-black/60">Catatan</p>
                      <p className="text-natarsal-black/80">{result.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-natarsal-black/40 mt-4">
            * Jika Anda lupa nomor reservasi, silakan cek email konfirmasi yang
            dikirimkan
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default CheckStatus;
