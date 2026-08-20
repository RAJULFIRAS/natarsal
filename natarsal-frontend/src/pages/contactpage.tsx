import React from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/layout";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";

const ContactPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <section className="section-padding bg-natarsal-cream/20">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block px-4 py-1.5 border border-natarsal-gold rounded-full text-natarsal-gold text-xs tracking-widest uppercase mb-4">
              {t("contact.title")}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              {t("contact.subtitle")}
            </h1>

            <p className="text-lg md:text-xl text-natarsal-gold max-w-2xl mx-auto">
              {t("contact.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm">
                <div className="p-3 bg-natarsal-gold/10 rounded-full text-natarsal-gold">
                  <FiMapPin size={24} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-natarsal-black">
                    {t("contact.address")}
                  </h3>
                  <p className="text-natarsal-black/60">
                    {t("contact.addressDetail")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm">
                <div className="p-3 bg-natarsal-gold/10 rounded-full text-natarsal-gold">
                  <FiPhone size={24} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-natarsal-black">
                    {t("contact.phone")}
                  </h3>
                  <p className="text-natarsal-black/60">+6252 7717 3823</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm">
                <div className="p-3 bg-natarsal-gold/10 rounded-full text-natarsal-gold">
                  <FiMail size={24} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-natarsal-black">
                    {t("contact.email")}
                  </h3>
                  <p className="text-natarsal-black/60">info@natarsal.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm">
                <div className="p-3 bg-natarsal-gold/10 rounded-full text-natarsal-gold">
                  <FiClock size={24} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-natarsal-black">
                    {t("contact.hours")}
                  </h3>
                  <div className="text-natarsal-black/60 space-y-1">
                    <p>{t("contact.hoursDetail.monThu")}</p>
                    <p>{t("contact.hoursDetail.friSat")}</p>
                    <p>{t("contact.hoursDetail.sun")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm h-[525px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126151.01264927817!2d115.16707176958904!3d-8.658030213188807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd2414f8f8e1d8b%3A0x8f8e8e8e8e8e8e8e!2sDenpasar%2C%20Bali!5e0!3m2!1sen!2sid!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Natarsal Restaurant"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
