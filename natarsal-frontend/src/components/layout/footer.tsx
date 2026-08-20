import React from "react";
import { useTranslation } from "react-i18next";
import Logo from "./logo";
import {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiYoutube,
  FiMapPin,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const socialLinks = {
    instagram: "https://www.instagram.com/natarsal_restaurant",
    facebook: "https://www.facebook.com/natarsal_restaurant",
    twitter: "https://twitter.com/natarsal_restaurant",
    youtube: "https://www.youtube.com/@natarsal_restaurant",
  };

  return (
    <footer
      className="bg-natarsal-black text-natarsal-white/80"
      role="contentinfo"
    >
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <Logo textColor="text-white" size="sm" />
            <p className="mt-4 text-sm leading-relaxed text-white/70 max-w-xs">
              {t("footer.description")}
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-natarsal-gold transition-colors duration-300"
                aria-label="Instagram"
              >
                <FiInstagram size={20} />
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-natarsal-gold transition-colors duration-300"
                aria-label="Facebook"
              >
                <FiFacebook size={20} />
              </a>
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-natarsal-gold transition-colors duration-300"
                aria-label="Twitter"
              >
                <FiTwitter size={20} />
              </a>
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-natarsal-gold transition-colors duration-300"
                aria-label="YouTube"
              >
                <FiYoutube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-white text-lg font-semibold mb-4">
              {t("footer.contactUs")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-natarsal-gold mt-0.5 flex-shrink-0" />
                <span className="text-white/70">
                  {t("contact.addressDetail")}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-natarsal-gold flex-shrink-0" />
                <span className="text-white/70">+6252 7717 3823</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-natarsal-gold flex-shrink-0" />
                <span className="text-white/70">info@natarsal.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-white text-lg font-semibold mb-4">
              {t("footer.hours")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-white/60">{t("footer.days.monThu")}</span>
                <span className="text-white font-medium">
                  {t("footer.hoursDetail.monThu")}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-white/60">{t("footer.days.friSat")}</span>
                <span className="text-white font-medium">
                  {t("footer.hoursDetail.friSat")}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-white/60">{t("footer.days.sun")}</span>
                <span className="text-white font-medium">
                  {t("footer.hoursDetail.sun")}
                </span>
              </li>
              <li className="mt-2 text-xs text-white/40">
                {t("footer.kitchenClose")}
              </li>
            </ul>
          </div>

          <div className="flex justify-center items-center">
            <img
              src="/images/halal.png"
              alt="Sertifikasi Halal"
              className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain"
              loading="lazy"
            />
          </div>
        </div>

        <li>
          <Link
            to="/check-status"
            className="text-white/60 hover:text-natarsal-gold transition-colors"
          >
            Cek Status Reservasi
          </Link>
        </li>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-white/40">
          <p>
            &copy; {currentYear} Natarsal Restaurant. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
