import React from "react";
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  Search,
  Settings,
  Info,
  BarChart3,
} from "lucide-react";

interface SidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  isAdmin?: boolean;
}

export default function Sidebar({ currentScreen, onNavigate, isAdmin }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Monitor", icon: LayoutDashboard },
    { id: "my_documents", label: "Archives", icon: FileText },
    { id: "chat", label: "Chats", icon: Search },
    { id: "reports", label: "Reports", icon: BarChart3, isAdminOnly: true },
    { id: "settings", label: "Preferences", icon: Settings },
    { id: "about", label: "About Us", icon: Info },
  ].filter(item => !item.isAdminOnly || isAdmin);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex-col shrink-0">
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
              (currentScreen === "summary" && item.id === "dashboard") ||
              (currentScreen === "question_bank" && item.id === "dashboard");

            return (
              <button
                key={item.id}
                onClick={() =>
                  onNavigate(item.id === "my_documents" ? "dashboard" : item.id)
                }
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left group
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

        <div className="p-4 mt-auto border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">
              Status
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <p className="text-xs font-semibold text-slate-700">
                Academic Portal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl border border-white/20 flex justify-around items-center px-4 py-3 z-40 rounded-3xl shadow-2xl shadow-slate-900/10 lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentScreen === item.id ||
            (currentScreen === "summary" && item.id === "dashboard") ||
            (currentScreen === "question_bank" && item.id === "dashboard");

          return (
            <button
              key={item.id}
              onClick={() =>
                onNavigate(item.id === "my_documents" ? "dashboard" : item.id)
              }
              className={`flex flex-col items-center justify-center w-12 h-10 rounded-xl transition-all
                ${isActive ? "text-academic-blue scale-110" : "text-slate-400 active:scale-95"}`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-academic-blue" : ""}`}
              />
            </button>
          );
        })}
      </div>
    </>
  );
}
