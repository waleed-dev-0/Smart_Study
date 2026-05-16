import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { GraduationCap, Globe, Menu, X } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import Logo from "./Logo";

export default function PublicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isArabic, updateLanguage } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  const t = {
    smartStudy: isArabic ? "الدراسة الذكية" : "Smart Study",
    home: isArabic ? "الرئيسية" : "Home",
    resources: isArabic ? "المصادر" : "Resources",
    methodology: isArabic ? "المنهجية" : "Methodology",
    institutional: isArabic ? "المؤسسي" : "Institutional",
    about: isArabic ? "حول" : "About",
    logIn: isArabic ? "تسجيل الدخول" : "Log In",
    joinPortal: isArabic ? "انضم للبوابة" : "Join Portal",
  };

  const isHome = location.pathname === "/";

  const handleNavClick = (sectionId: string) => {
    setMobileOpen(false);
    if (isHome) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/", { state: { scrollTo: sectionId } });
    }
  };

  return (
    <nav className="border-b border-slate-200 dark:border-cafe-border-dark bg-white/90 dark:bg-cafe-surface-dark-alt/90 backdrop-blur-lg sticky top-0 z-50 shadow-sm dark:shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <Logo className="w-12 h-12" />
          <span className="text-xl font-display font-bold text-cafe-primary dark:text-white tracking-tight">
            {t.smartStudy}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-cafe-text-dark">
          <button
            onClick={() => navigate("/")}
            className={`hover:text-cafe-primary-light transition-colors bg-transparent border-none p-0 cursor-pointer ${
              location.pathname === "/" ? "text-cafe-primary dark:text-white" : ""
            }`}
          >
            {t.home}
          </button>
          <button
            onClick={() => handleNavClick("resources")}
            className="hover:text-cafe-primary-light transition-colors bg-transparent border-none p-0 cursor-pointer"
          >
            {t.resources}
          </button>
          <button
            onClick={() => handleNavClick("methodology")}
            className="hover:text-cafe-primary-light transition-colors bg-transparent border-none p-0 cursor-pointer"
          >
            {t.methodology}
          </button>
          <button
            onClick={() => handleNavClick("institutional")}
            className="hover:text-cafe-primary-light transition-colors bg-transparent border-none p-0 cursor-pointer"
          >
            {t.institutional}
          </button>
          <button
            onClick={() => handleNavClick("about")}
            className="hover:text-cafe-primary-light transition-colors bg-transparent border-none p-0 cursor-pointer"
          >
            {t.about}
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => updateLanguage(isArabic ? "English" : "Arabic")}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-500 dark:text-cafe-text-dark hover:text-cafe-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-cafe-border-dark transition-all group"
            title={isArabic ? "Switch to English" : "التبديل إلى العربية"}
          >
            <Globe className="w-5 h-5 text-slate-400 group-hover:text-cafe-primary-light transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline text-slate-400 group-hover:text-cafe-primary transition-colors">
              {isArabic ? "EN" : "AR"}
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-bold text-slate-600 dark:text-white hover:text-cafe-primary transition-colors px-4 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-cafe-border-dark"
            >
              {t.logIn}
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-sm font-bold bg-cafe-primary-light text-white px-5 py-2.5 rounded-full hover:bg-cafe-primary transition-all shadow-lg shadow-cafe-primary-light/20"
            >
              {t.joinPortal}
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-slate-500 dark:text-cafe-text-dark hover:bg-slate-100 dark:hover:bg-cafe-border-dark transition-all"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-cafe-border-dark bg-white dark:bg-cafe-surface-dark-alt px-4 py-4 space-y-2">
          <button
            onClick={() => { navigate("/"); setMobileOpen(false); }}
            className="block w-full text-start px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-cafe-border-dark hover:text-cafe-primary transition-all"
          >
            {t.home}
          </button>
          <button
            onClick={() => handleNavClick("resources")}
            className="block w-full text-start px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-cafe-border-dark hover:text-cafe-primary transition-all"
          >
            {t.resources}
          </button>
          <button
            onClick={() => handleNavClick("methodology")}
            className="block w-full text-start px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-cafe-border-dark hover:text-cafe-primary transition-all"
          >
            {t.methodology}
          </button>
          <button
            onClick={() => handleNavClick("institutional")}
            className="block w-full text-start px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-cafe-border-dark hover:text-cafe-primary transition-all"
          >
            {t.institutional}
          </button>
          <button
            onClick={() => handleNavClick("about")}
            className="block w-full text-start px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-cafe-border-dark transition-all"
          >
            {t.about}
          </button>
          <hr className="border-slate-100 dark:border-cafe-surface-dark my-2" />
          <button
            onClick={() => { navigate("/login"); setMobileOpen(false); }}
            className="block w-full text-start px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-cafe-border-dark transition-all"
          >
            {t.logIn}
          </button>
          <button
            onClick={() => { navigate("/register"); setMobileOpen(false); }}
            className="block w-full text-start px-4 py-3 rounded-xl text-sm font-bold bg-cafe-primary-light text-white hover:bg-cafe-primary transition-all"
          >
            {t.joinPortal}
          </button>
        </div>
      )}
    </nav>
  );
}
