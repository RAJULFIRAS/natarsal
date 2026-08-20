import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../ui/button";
import { FiCheckCircle } from "react-icons/fi";

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="section-padding bg-natarsal-gold">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/interior.png"
                alt="Tentang Natarsal"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
              <p className="text-xs text-natarsal-black/60">
                {t("about.since")}
              </p>
              <p className="text-natarsal-gold font-display text-4xl font-bold">
                1999
              </p>
            </div>
          </div>

          <div>
            <div className="inline-block px-4 py-1.5 border border-white rounded-full text-white text-xs tracking-widest uppercase mb-4">
              {t("about.title")}
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-bold text-natarsal-black mb-6">
              {t("about.heading")}
              <br />
              <span className="text-white">{t("about.subheading")}</span>
            </h2>

            <p className="text-natarsal-black/70 text-lg leading-relaxed mb-6">
              {t("about.description")}
            </p>

            <div className="space-y-4 mb-8">
              {[
                t("about.features.0"),
                t("about.features.1"),
                t("about.features.2"),
                t("about.features.3"),
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <FiCheckCircle
                    className="text-white flex-shrink-0"
                    size={20}
                  />
                  <span className="text-natarsal-black/80">{item}</span>
                </div>
              ))}
            </div>

            <Link to="/about">
              <Button
                variant="white-outline"
                size="lg"
                className="hover:!bg-natarsal-black hover:!text-white hover:!border-natarsal-black"
              >
                {t("about.learnMore")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
