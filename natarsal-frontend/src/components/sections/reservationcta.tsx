import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../ui/button";

const ReservationCTA: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="section-padding bg-natarsal-gold text-white">
      <div className="container-custom text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 border border-white/30 rounded-full text-white/80 text-xs tracking-widest uppercase mb-4">
            {t("reservation.title")}
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {t("reservationCta.title")}
            <br />
            <span className="italic">{t("reservationCta.subtitle")}</span>
          </h2>
          <p className="text-white/80 text-lg mb-8">
            {t("reservationCta.description")}
          </p>
          <Link to="/reservation">
            <Button variant="white-outline" size="lg">
              {t("reservationCta.button")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ReservationCTA;
