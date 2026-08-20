import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState } from "../../store";
import {
  toggleMobileMenu,
  closeMobileMenu,
  setScrolled,
} from "../../store/slices/uislice";
import Logo from "./logo";
import { FiMenu, FiX, FiGlobe } from "react-icons/fi";

const navLinks = [
  { name: "home", path: "/" },
  { name: "menu", path: "/menu" },
  { name: "about", path: "/about" },
  { name: "reservation", path: "/reservation" },
  { name: "contact", path: "/contact" },
];

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { isMobileMenuOpen, isScrolled } = useSelector(
    (state: RootState) => state.ui,
  );
  const [isLanguageOpen, setIsLanguageOpen] = React.useState(false);

  useEffect(() => {
    const handleScroll = () => {
      dispatch(setScrolled(window.scrollY > 50));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch]);

  useEffect(() => {
    dispatch(closeMobileMenu());
  }, [location, dispatch]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsLanguageOpen(false);
    localStorage.setItem("i18nextLng", lang);
  };

  const currentLanguage = i18n.language || "id";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-natarsal-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          <Logo
            textColor={isScrolled ? "text-natarsal-black" : "text-white"}
            size="md"
          />

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body text-sm font-medium transition-colors duration-300 relative group ${
                  isScrolled ? "text-natarsal-black" : "text-white"
                } ${location.pathname === link.path ? "text-natarsal-gold" : ""}`}
                aria-current={
                  location.pathname === link.path ? "page" : undefined
                }
              >
                {t(`nav.${link.name}`)}
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 bg-natarsal-gold transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                    location.pathname === link.path ? "scale-x-100" : ""
                  }`}
                />
              </Link>
            ))}

            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-300 ${
                  isScrolled
                    ? "text-natarsal-black hover:bg-natarsal-cream"
                    : "text-white hover:bg-white/10"
                }`}
                aria-label="Select language"
              >
                <FiGlobe size={18} />
                <span className="text-sm font-medium uppercase">
                  {currentLanguage === "id" ? "ID" : "EN"}
                </span>
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-natarsal-black/10">
                  <button
                    onClick={() => changeLanguage("id")}
                    className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-natarsal-cream flex items-center gap-2 ${
                      currentLanguage === "id"
                        ? "text-natarsal-gold font-semibold"
                        : "text-natarsal-black"
                    }`}
                  >
                    <span className="text-lg">🇮🇩</span>
                    {t("language.id")}
                    {currentLanguage === "id" && (
                      <span className="ml-auto text-natarsal-gold">✓</span>
                    )}
                  </button>
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-natarsal-cream flex items-center gap-2 border-t border-natarsal-black/5 ${
                      currentLanguage === "en"
                        ? "text-natarsal-gold font-semibold"
                        : "text-natarsal-black"
                    }`}
                  >
                    <span className="text-lg">🇬🇧</span>
                    {t("language.en")}
                    {currentLanguage === "en" && (
                      <span className="ml-auto text-natarsal-gold">✓</span>
                    )}
                  </button>
                </div>
              )}
            </div>

            <Link
              to="/reservation"
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${
                isScrolled
                  ? "bg-natarsal-gold text-white hover:bg-natarsal-black"
                  : "border-2 border-white text-white hover:bg-white hover:text-natarsal-black"
              }`}
            >
              {t("nav.bookNow")}
            </Link>
          </div>

          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className={`md:hidden transition-colors duration-300 focus:outline-none ${
              isScrolled ? "text-natarsal-black" : "text-white"
            }`}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-0 top-20 bg-natarsal-black/95 backdrop-blur-md transition-all duration-500 transform ${
          isMobileMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-display text-2xl transition-colors duration-300 ${
                location.pathname === link.path
                  ? "text-natarsal-gold"
                  : "text-white hover:text-natarsal-gold"
              }`}
            >
              {t(`nav.${link.name}`)}
            </Link>
          ))}

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => changeLanguage("id")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentLanguage === "id"
                  ? "bg-natarsal-gold text-white"
                  : "text-white/60 hover:text-white border border-white/20 hover:border-white"
              }`}
            >
              🇮🇩 ID
            </button>
            <button
              onClick={() => changeLanguage("en")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentLanguage === "en"
                  ? "bg-natarsal-gold text-white"
                  : "text-white/60 hover:text-white border border-white/20 hover:border-white"
              }`}
            >
              🇬🇧 EN
            </button>
          </div>

          <Link
            to="/reservation"
            className="btn-primary text-lg px-10 py-4 mt-4"
          >
            {t("nav.bookNow")}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
