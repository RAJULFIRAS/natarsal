import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiArrowRight, FiSearch } from "react-icons/fi";

const ReservationCTA: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative section-padding overflow-hidden">
      {/* Background dengan efek gradasi dan pattern */}
      <div className="absolute inset-0 bg-natarsal-gold">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10 bg-repeat" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-block px-4 py-1.5 border border-white/30 rounded-full text-white/80 text-xs tracking-widest uppercase mb-6">
            ✦ {t("reservation.title")}
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4">
            {t("reservationCta.title")}
            <br />
            <span className="italic text-white/90">
              {t("reservationCta.subtitle")}
            </span>
          </h2>

          {/* Description */}
          <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-8">
            {t("reservationCta.description")}
          </p>

          {/* ✅ DUA TOMBOL: Reserve Now + Cek Status */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Tombol 1: Reserve Now */}
            <Link
              to="/reservation"
              className="inline-flex items-center gap-3 bg-white text-natarsal-gold px-8 py-4 rounded-lg font-medium text-lg hover:bg-natarsal-gold hover:text-natarsal-white hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 group"
            >
              {t("reservationCta.button")}
              <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            {/* ✅ Tombol 2: Cek Status Reservasi - OUTLINE WHITE */}
            <Link
              to="/check-status"
              className="inline-flex items-center gap-3 border-2 border-white/80 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-black hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <FiSearch className="text-lg" />
              {t("reservationCta.check.reservation")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationCTA;
