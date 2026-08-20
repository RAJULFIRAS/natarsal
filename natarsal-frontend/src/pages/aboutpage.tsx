import React from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/layout";

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <section className="min-h-screen pt-20 bg-natarsal-cream/20">
        <div className="container-custom py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block px-4 py-1.5 border border-natarsal-gold rounded-full text-natarsal-gold text-xs tracking-widest uppercase mb-4">
              {t("about.title")}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              {t("about.heading")}{" "}
              <span className="text-natarsal-gold">
                {t("about.subheading")}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              {t("about.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/interior.png"
                  alt={t("about.title")}
                  className="w-full h-[400px] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold text-natarsal-white mb-4">
                {t("about.heading")} <br />
                <span className="text-natarsal-gold">
                  {t("about.subheading")}
                </span>
              </h2>
              <p className="text-natarsal-white leading-relaxed mb-6">
                {t("about.description")}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <p className="text-2xl font-display text-natarsal-gold font-bold">
                    25+
                  </p>
                  <p className="text-sm text-natarsal-black/60">
                    {t("hero.experience")}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <p className="text-2xl font-display text-natarsal-gold font-bold">
                    18+
                  </p>
                  <p className="text-sm text-natarsal-black/60">
                    {t("hero.signature")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
