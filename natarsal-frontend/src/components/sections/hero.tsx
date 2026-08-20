import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../ui/button";

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero section"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/images/hero-bg.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="container-custom relative z-10 py-32">
        <div className="max-w-2xl animate-fade-in-up">
          <div className="inline-block px-4 py-1.5 border border-natarsal-gold/50 rounded-full text-natarsal-gold text-xs tracking-widest uppercase mb-6">
            ✦ Fine Dining Nusantara
          </div>

          <h1 className="text-5xl md:text-7xl font-display text-white font-bold leading-tight mb-6">
            {t("hero.title")}
            <br />
            <span className="text-natarsal-gold italic">
              {t("hero.subtitle")}
            </span>
          </h1>

          <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
            {t("hero.description")}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/reservation">
              <Button variant="primary" size="lg">
                {t("hero.reserve")}
              </Button>
            </Link>
            <Link to="/menu">
              <Button variant="white-outline" size="lg">
                {t("hero.viewMenu")}
              </Button>
            </Link>
          </div>

          <div className="flex gap-8 mt-12 pt-8 border-t border-white/20">
            <div>
              <p className="text-3xl font-display text-white font-bold">18+</p>
              <p className="text-white/60 text-sm">{t("hero.signature")}</p>
            </div>
            <div>
              <p className="text-3xl font-display text-white font-bold">25+</p>
              <p className="text-white/60 text-sm">{t("hero.experience")}</p>
            </div>
            <div>
              <p className="text-3xl font-display text-white font-bold">4.9</p>
              <p className="text-white/60 text-sm">{t("hero.rating")}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce-slow"
        aria-hidden="true"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-natarsal-gold rounded-full mt-2 animate-pulse-gold" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
