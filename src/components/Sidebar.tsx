import { useNavigate, useLocation } from "react-router-dom";
import React from "react";
import api from "../services/api";
import { useAppContext } from "../context/AppContext";
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  Search,
  Settings,
  Info,
  BarChart3,
  LogOut,
  History,
  Globe,
} from "lucide-react";

interface SidebarProps {
  currentScreen: string;
  isAdmin?: boolean;
}

export default function Sidebar({ currentScreen, isAdmin }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isArabic, updateLanguage } = useAppContext();

  const t = {
    monitor: isArabic ? "لوحة المراقبة" : "Monitor",
    archives: isArabic ? "الأرشيف" : "Archives",
    chats: isArabic ? "المحادثات" : "Chats",
    records: isArabic ? "السجلات" : "Records",
    quizHistory: isArabic ? "سجل الاختبارات" : "Quiz History",
    adminReports: isArabic ? "تقارير الإدارة" : "Admin Reports",
    preferences: isArabic ? "التفضيلات" : "Preferences",
    aboutUs: isArabic ? "من نحن" : "About Us",
    logOut: isArabic ? "تسجيل الخروج" : "Log Out"
  };

  const navItems = [
    { id: "dashboard", label: t.monitor, icon: LayoutDashboard },
    { id: "my_documents", label: t.archives, icon: FileText },
    { id: "chat", label: t.chats, icon: Search },
    { id: "academic-records", label: t.records, icon: BarChart3 },
    { id: "quiz-history", label: t.quizHistory, icon: History },
    { id: "reports", label: t.adminReports, icon: BarChart3, isAdminOnly: true },
    { id: "settings", label: t.preferences, icon: Settings },
    { id: "about", label: t.aboutUs, icon: Info },
  ].filter(item => !item.isAdminOnly || isAdmin);

  const routeMap: Record<string, string> = {
    dashboard: "/dashboard",
    my_documents: "/dashboard",
    chat: "/chat",
    "academic-records": "/academic-records",
    "quiz-history": "/quiz-history",
    reports: "/reports",
    settings: "/settings",
    about: "/about",
  };

  return (
    <>
      <div 
        dir={isArabic ? "rtl" : "ltr"}
        className="hidden md:flex w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex-col shrink-0"
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 bg-academic-navy rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-slate-900/10">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-serif font-bold text-academic-navy tracking-tight truncate">
            Smart Study
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentScreen === item.id ||
              (currentScreen === "question_bank" && item.id === "dashboard");

            return (
              <button
                key={item.id}
                onClick={() => navigate(routeMap[item.id] || `/${item.id}`)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-start group
                  ${
                    isActive
                      ? "bg-slate-100 text-academic-blue shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-academic-navy"
                  }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${isActive ? "text-academic-blue" : "text-slate-400 group-hover:text-academic-navy"}`}
                />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <button
            onClick={() => updateLanguage(isArabic ? "English" : "Arabic")}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-academic-navy transition-all group"
          >
            <div className="w-5 h-5 flex items-center justify-center text-slate-400 group-hover:text-academic-blue transition-colors">
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
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {t.logOut}
          </button>
        </div>
      </div>

      <div className="md:hidden fixed bottom-6 start-6 end-6 bg-white/90 backdrop-blur-xl border border-white/20 flex justify-around items-center px-4 py-3 z-40 rounded-3xl shadow-2xl shadow-slate-900/10 lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentScreen === item.id ||
            (currentScreen === "question_bank" && item.id === "dashboard");

          return (
            <button
              key={item.id}
              onClick={() => navigate(routeMap[item.id] || `/${item.id}`)}
              className={`flex flex-col items-center justify-center w-12 h-10 rounded-xl transition-all
                ${isActive ? "text-academic-blue scale-110" : "text-slate-400 active:scale-95"}`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-academic-blue" : ""}`}
              />
            </button>
          );
        })}
        <button
          onClick={() => updateLanguage(isArabic ? "English" : "Arabic")}
          className="flex flex-col items-center justify-center w-12 h-10 rounded-xl text-slate-400 active:scale-95 transition-all hover:text-academic-blue"
        >
          <Globe className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            const lang = localStorage.getItem("language");
            localStorage.clear();
            if (lang) localStorage.setItem("language", lang);
            navigate("/login");
          }}
          className="flex flex-col items-center justify-center w-12 h-10 rounded-xl text-red-400 active:scale-95 transition-all"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
