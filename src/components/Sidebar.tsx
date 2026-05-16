import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import api from "../services/api";
import { useAppContext } from "../context/AppContext";
import {
  LayoutDashboard,
  Library,
  Search,
  Settings,
  BarChart3,
  LogOut,
  History,
  Globe,
  Menu,
  X,
} from "lucide-react";
import Logo from "./Logo";

interface SidebarProps {
  currentScreen: string;
  isAdmin?: boolean;
}

export default function Sidebar({ currentScreen, isAdmin }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isArabic, updateLanguage } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  const t = {
    monitor: isArabic ? "لوحة التحكم" : "Dashboard",
    library: isArabic ? "المكتبة" : "Library",
    chats: isArabic ? "المحادثات" : "Chats",
    quizHistory: isArabic ? "سجل الاختبارات" : "Quiz History",
    adminReports: isArabic ? "تقارير الإدارة" : "Admin Reports",
    preferences: isArabic ? "الإعدادات" : "Settings",
    logOut: isArabic ? "تسجيل الخروج" : "Log Out"
  };

  const navItems = [
    { id: "dashboard", label: t.monitor, icon: LayoutDashboard },
    { id: "my_documents", label: t.library, icon: Library },
    { id: "chat", label: t.chats, icon: Search },
    { id: "quiz-history", label: t.quizHistory, icon: History },
    { id: "reports", label: t.adminReports, icon: BarChart3, isAdminOnly: true },
    { id: "settings", label: t.preferences, icon: Settings },
  ].filter(item => !item.isAdminOnly || isAdmin);

  const routeMap: Record<string, string> = {
    dashboard: "/dashboard",
    my_documents: "/library",
    chat: "/chat",
    "quiz-history": "/quiz-history",
    reports: "/reports",
    settings: "/settings",
  };

  const handleNav = (route: string) => {
    navigate(route);
    setMobileOpen(false);
  };

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div dir={isArabic ? "rtl" : "ltr"} className="flex flex-col h-full">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-cafe-border-dark">
        <Logo className="w-10 h-10" />
        <span className="text-xl font-display font-bold text-cafe-primary dark:text-white tracking-tight truncate">
          Smart Study
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentScreen === item.id ||
            (currentScreen === "summary" && item.id === "dashboard") ||
            (currentScreen === "question_bank" && item.id === "dashboard");

          return (
            <button
              key={item.id}
              onClick={() => handleNav(routeMap[item.id] || `/${item.id}`)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-start group active:scale-95
                ${
                  isActive
                    ? "bg-slate-100 dark:bg-cafe-border-dark text-cafe-primary dark:text-white shadow-sm dark:shadow-black/20"
                    : "text-slate-500 dark:text-cafe-text-dark-muted hover:bg-slate-50 dark:hover:bg-cafe-border-dark hover:text-cafe-primary dark:hover:text-white"
                }`}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${isActive ? "text-cafe-primary dark:text-white" : "text-slate-400 dark:text-cafe-text-dark-muted group-hover:text-cafe-primary dark:group-hover:text-white"}`}
              />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-cafe-border-dark space-y-2">
        <button
          onClick={() => {
            updateLanguage(isArabic ? "English" : "Arabic");
            if (mobile) setMobileOpen(false);
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-500 dark:text-cafe-text-dark-muted hover:bg-slate-50 dark:hover:bg-cafe-border-dark hover:text-cafe-primary dark:hover:text-white transition-all group"
        >
          <div className="w-5 h-5 flex items-center justify-center text-slate-400 dark:text-cafe-text-dark-muted group-hover:text-cafe-primary-light transition-colors">
            <Globe className="w-5 h-5" />
          </div>
          <span className="flex items-center gap-2">
            {isArabic ? "English" : "العربية"}
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              {isArabic ? "EN" : "AR"}
            </span>
          </span>
        </button>
        <button
          onClick={() => {
            const lang = localStorage.getItem("language");
            localStorage.clear();
            if (lang) localStorage.setItem("language", lang);
            navigate("/login");
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <LogOut className="w-5 h-5" />
          {t.logOut}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 start-4 z-50 flex items-center justify-center w-11 h-11 rounded-xl bg-white dark:bg-cafe-surface-dark-alt shadow-lg shadow-slate-900/10 dark:shadow-black/30 border border-slate-200 dark:border-cafe-border-dark text-cafe-primary dark:text-white hover:bg-slate-50 dark:hover:bg-cafe-border-dark transition-all"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile slide-in sidebar */}
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className={`md:hidden fixed top-0 ${isArabic ? "right-0" : "left-0"} bottom-0 w-72 bg-white dark:bg-cafe-surface-dark-alt shadow-2xl dark:shadow-black/40 z-50 transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : isArabic ? "translate-x-full" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className={`absolute top-4 ${isArabic ? "start-4" : "end-4"} z-10 flex items-center justify-center w-10 h-10 rounded-xl text-slate-500 hover:bg-slate-100 transition-all`}
        >
          <X className="w-5 h-5" />
        </button>
        <div className="h-full pt-14">
          <SidebarContent mobile />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div 
        className="hidden md:flex w-64 bg-white dark:bg-cafe-surface-dark-alt border-r border-slate-200 dark:border-cafe-border-dark h-screen sticky top-0 flex-col shrink-0"
      >
        <SidebarContent />
      </div>
    </>
  );
}
