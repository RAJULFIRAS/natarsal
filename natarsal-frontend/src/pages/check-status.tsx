// D:/natarsal/natarsal-frontend/src/pages/check-status.tsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiLoader,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiArrowLeft,
} from "react-icons/fi";
import Layout from "../components/layout/layout";
import apiClient from "../config/api";

interface ReservationResult {
  reservationNumber: string;
  customerName: string;
  date: string;
  guests: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes: string | null;
}

const CheckStatus: React.FC = () => {
  const { t } = useTranslation();
  const [reservationNumber, setReservationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReservationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reservationNumber || !email) {
      setError(t("reservation.checkStatus.required"));
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

      if (response.success && response.data) {
        setResult(response.data as ReservationResult);
      } else {
        setError(
          response.error?.message || t("reservation.checkStatus.notFound"),
        );
      }
    } catch (err: any) {
      setError(err.message || t("reservation.checkStatus.error"));
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
        label: t("reservation.checkStatus.status.pending"),
        icon: <FiClock className="text-yellow-500" />,
        className: "bg-white text-yellow-700 border-yellow-500",
      },
      CONFIRMED: {
        label: t("reservation.checkStatus.status.confirmed"),
        icon: <FiCheckCircle className="text-green-500" />,
        className: "bg-white text-green-700 border-green-500",
      },
      COMPLETED: {
        label: t("reservation.checkStatus.status.completed"),
        icon: <FiCheckCircle className="text-blue-500" />,
        className: "bg-white text-blue-700 border-blue-500",
      },
      CANCELLED: {
        label: t("reservation.checkStatus.status.cancelled"),
        icon: <FiXCircle className="text-red-500" />,
        className: "bg-white text-red-700 border-red-500",
      },
    };

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
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-natarsal-white/60 hover:text-natarsal-white transition-colors mb-6"
          >
            <FiArrowLeft size={18} />
            <span className="text-sm">Kembali</span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-natarsal-white mb-2">
              {t("reservation.checkStatus.title")}
            </h1>
            <p className="text-natarsal-white/60">
              {t("reservation.checkStatus.description")}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                  {t("reservation.checkStatus.reservationNumber")} *
                </label>
                <input
                  type="text"
                  value={reservationNumber}
                  onChange={(e) =>
                    setReservationNumber(e.target.value.toUpperCase())
                  }
                  placeholder={t(
                    "reservation.checkStatus.reservationNumberPlaceholder",
                  )}
                  className="w-full px-4 py-3 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                  {t("reservation.checkStatus.email")} *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("reservation.checkStatus.emailPlaceholder")}
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
                    {t("reservation.checkStatus.submitting")}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FiSearch />
                    {t("reservation.checkStatus.submit")}
                  </span>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 bg-white border border-red-500 rounded-lg p-4 flex items-start gap-3">
                <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {result && (
              <div className="mt-6 p-6 bg-natarsal-cream/30 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-natarsal-black/60">
                      {t("reservation.checkStatus.fields.reservationNumber")}
                    </p>
                    <p className="font-mono font-bold text-natarsal-black">
                      {result.reservationNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-natarsal-black/60">
                      {t("reservation.checkStatus.fields.status")}
                    </p>
                    {getStatusBadge(result.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-natarsal-black/10">
                  <div>
                    <p className="text-sm text-natarsal-black/60">
                      {t("reservation.checkStatus.fields.name")}
                    </p>
                    <p className="font-medium text-natarsal-black">
                      {result.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-natarsal-black/60">
                      {t("reservation.checkStatus.fields.guests")}
                    </p>
                    <p className="font-medium text-natarsal-black">
                      {result.guests} {result.guests > 1 ? "orang" : "orang"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-natarsal-black/60">
                      {t("reservation.checkStatus.fields.dateTime")}
                    </p>
                    <p className="font-medium text-natarsal-black">
                      {new Date(result.date).toLocaleString(
                        localStorage.getItem("i18nextLng") === "en"
                          ? "en-US"
                          : "id-ID",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                  {result.notes && (
                    <div className="col-span-2">
                      <p className="text-sm text-natarsal-black/60">
                        {t("reservation.checkStatus.fields.notes")}
                      </p>
                      <p className="text-natarsal-black/80">{result.notes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-natarsal-black/10">
                  <p className="text-xs text-natarsal-black/40">
                    {t("reservation.checkStatus.saveNumber")}
                  </p>
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-natarsal-white/40 mt-4">
            {t("reservation.checkStatus.hint")}
          </p>

          <div className="text-center mt-6">
            <Link
              to="/reservation"
              className="inline-flex items-center gap-2 text-natarsal-gold hover:text-natarsal-white transition-colors text-sm"
            >
              <FiArrowLeft size={16} />
              {t("reservation.backHome")}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CheckStatus;
