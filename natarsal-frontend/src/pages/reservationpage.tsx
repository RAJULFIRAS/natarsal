// D:/natarsal/natarsal-frontend/src/pages/reservationpage.tsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import Layout from "../components/layout/layout";
import apiClient from "../config/api";

const ReservationPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "19:00",
    guests: 2,
    occasion: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservationNumber, setReservationNumber] = useState<string | null>(
    null,
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReservationNumber(null);

    try {
      const result = await apiClient.createReservation({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        date: `${formData.date}T${formData.time}`,
        guests: Number(formData.guests),
        notes: formData.notes,
      });

      if (result.success) {
        setReservationNumber(result.data.reservationNumber);
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "19:00",
          guests: 2,
          occasion: "",
          notes: "",
        });
      } else {
        setError(result.error?.message || "Failed to create reservation");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create reservation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="section-padding bg-natarsal-cream/20">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block px-4 py-1.5 border border-natarsal-gold rounded-full text-natarsal-gold text-xs tracking-widest uppercase mb-4">
              {t("reservation.title")}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              {t("reservation.subtitle")}
            </h1>
            <p className="text-lg md:text-xl text-natarsal-gold max-w-2xl mx-auto">
              {t("reservation.description")}
            </p>
          </div>

          {success ? (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="font-display text-2xl font-bold text-natarsal-black mb-2">
                {t("reservation.success")}
              </h2>
              <p className="text-natarsal-black/60">
                {t("reservation.successMessage")}
              </p>

              {reservationNumber && (
                <div className="mt-6 p-4 bg-natarsal-cream rounded-xl border border-natarsal-gold/20">
                  <p className="text-sm text-natarsal-black/60">
                    Nomor Reservasi
                  </p>
                  <p className="font-mono font-bold text-natarsal-gold text-xl tracking-wider">
                    {reservationNumber}
                  </p>
                  <p className="text-xs text-natarsal-black/40 mt-1">
                    Simpan nomor ini untuk cek status reservasi
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
                <Link to="/check-status" className="btn-primary">
                  Cek Status Reservasi
                </Link>
                <Link to="/" className="btn-outline">
                  {t("reservation.backHome")}
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md"
            >
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                    {t("reservation.name")} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                    {t("reservation.email")} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                    {t("reservation.phone")} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                    {t("reservation.guests")} *
                  </label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    min="1"
                    max="20"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                    {t("reservation.date")} *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                    {t("reservation.time")} *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                  {t("reservation.occasion")}
                </label>
                <select
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all"
                >
                  <option value="">
                    {t("reservation.occasionPlaceholder")}
                  </option>
                  <option value="BIRTHDAY">{t("reservation.birthday")}</option>
                  <option value="ANNIVERSARY">
                    {t("reservation.anniversary")}
                  </option>
                  <option value="BUSINESS">{t("reservation.business")}</option>
                  <option value="OTHER">{t("reservation.other")}</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-natarsal-black/70 mb-1">
                  {t("reservation.notes")}
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder={t("reservation.notesPlaceholder")}
                  className="w-full px-4 py-2 rounded-lg border border-natarsal-black/10 focus:border-natarsal-gold focus:ring-2 focus:ring-natarsal-gold/20 outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" />
                    {t("reservation.processing")}
                  </span>
                ) : (
                  t("reservation.submit")
                )}
              </button>

              <p className="text-xs text-natarsal-black/40 mt-4 text-center">
                * Required fields
              </p>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ReservationPage;
