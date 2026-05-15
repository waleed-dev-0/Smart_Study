import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import {
  Users,
  FileUp,
  HardDrive,
  ArrowUpRight,
  UserCheck,
  Loader2,
  TrendingUp,
  Download,
  MoreVertical,
} from "lucide-react";

export default function ReportsPage() {
  const navigate = useNavigate();
  const { isArabic } = useAppContext();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = (() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64)).role === "admin";
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get("/reports");
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch reports");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const t = {
    totalScholars: isArabic ? "إجمالي الطلاب" : "Total Scholars",
    archivedSources: isArabic ? "المصادر المؤرشفة" : "Archived Sources",
    weeklyGrowth: isArabic ? "النمو الأسبوعي" : "Weekly Growth",
    digitalStorage: isArabic ? "التخزين الرقمي" : "Digital Storage",
    used: isArabic ? "مستخدم" : "used",
    adminOversight: isArabic ? "الإشراف الإداري" : "Admin Oversight",
    systemAnalytics: isArabic ? "تحليلات النظام ومراجعة الطلاب" : "System Analytics & User Audit",
    downloadDossier: isArabic ? "تحميل الملف الكامل" : "Download Dossier",
    scholarActivityAudit: isArabic ? "مراجعة نشاط الطلاب" : "Scholar Activity Audit",
    scholar: isArabic ? "الطالب" : "Scholar",
    archivedFiles: isArabic ? "الملفات المؤرشفة" : "Archived Files",
    lastSignal: isArabic ? "آخر إشارة" : "Last Signal",
    units: isArabic ? "وحدات" : "Units",
    enrollmentVelocity: isArabic ? "سرعة التسجيل" : "Enrollment Velocity",
    past7Days: isArabic ? "آخر 7 أيام" : "Past 7 Days",
    stabilizedStat: isArabic ? "استقر المدخول الأسبوعي عند " : "Weekly intake has stabilized at ",
    stabilizedStat2: isArabic ? " نسبة إلى فترة الأرشفة السابقة." : " relative to the previous archival period.",
    active: isArabic ? "نشط" : "Active",
    inactive: isArabic ? "غير نشط" : "Inactive",
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-academic-paper">
        <Sidebar currentScreen="reports" isAdmin={isAdmin} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-academic-navy animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-academic-paper">
        <Sidebar currentScreen="reports" isAdmin={isAdmin} />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-red-500 font-bold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-academic-navy text-white rounded-lg font-bold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: t.totalScholars,
      value: data?.totalUsers?.toLocaleString() || "0",
      growth: "Active",
      icon: Users,
      color: "text-academic-blue",
      bg: "bg-academic-blue/5",
    },
    {
      label: t.archivedSources,
      value: data?.archivedSources?.toLocaleString() || "0",
      growth: "Growing",
      icon: FileUp,
      color: "text-academic-gold",
      bg: "bg-academic-gold/5",
    },
    {
      label: t.weeklyGrowth,
      value: "248",
      growth: "+18%",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: t.digitalStorage,
      value: data?.digitalStorage || "0 B",
      growth: t.used,
      icon: HardDrive,
      color: "text-academic-navy",
      bg: "bg-academic-navy/5",
    },
  ];

  const userActivity = data?.scholarActivity || [];
  const weeklyTrends = [45, 52, 38, 65, 48, 72, 58];
  const maxTrend = Math.max(...weeklyTrends);

  return (
    <div className="flex min-h-screen bg-academic-paper">
      <Sidebar currentScreen="reports" isAdmin={isAdmin} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-academic-navy/5 flex items-center justify-between px-6 md:px-10 shrink-0 z-10">
          <div>
            <h1 className="text-2xl font-serif font-bold text-academic-navy">
              {t.adminOversight}
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              {t.systemAnalytics}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold hover:bg-white transition-all shadow-sm group">
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              {t.downloadDossier}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:border-academic-blue/10 transition-all"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}
                    >
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      <ArrowUpRight className="w-3 h-3" />
                      {stat.growth}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-serif font-bold text-academic-navy leading-none mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-academic-navy text-white rounded-xl flex items-center justify-center shadow-lg shadow-academic-navy/10">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-serif font-bold text-academic-navy">
                      {t.scholarActivityAudit}
                    </h2>
                  </div>
                  <button className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-100">
                    <MoreVertical className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-start border-collapse">
                    <thead>
                      <tr className="bg-white">
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                          {t.scholar}
                        </th>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                          {t.archivedFiles}
                        </th>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-end">
                          {t.lastSignal}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {userActivity.map((user: any) => (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-academic-navy/5 flex items-center justify-center text-academic-navy font-bold text-xs uppercase border border-academic-navy/10 flex-shrink-0 group-hover:bg-academic-navy group-hover:text-white transition-all">
                                {user.name ? user.name.charAt(0) : "?"}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-academic-navy truncate">
                                  {user.name}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <FileUp className="w-4 h-4 text-slate-300" />
                              <span className="font-bold text-slate-700">
                                {user.files}{" "}
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {t.units}
                                </span>
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-end">
                            <span className="text-xs font-semibold text-slate-500 italic">
                              {user.lastActive}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 bg-academic-gold/10 text-academic-gold rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-academic-navy leading-tight">
                      {t.enrollmentVelocity}
                    </h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                      {t.past7Days}
                    </p>
                  </div>
                </div>

                <div className="flex items-end justify-between gap-1.5 h-32">
                  {weeklyTrends.map((val, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-lg bg-academic-blue/10 hover:bg-academic-blue/20 transition-all relative group/chart"
                      style={{ height: `${(val / maxTrend) * 100}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-academic-navy opacity-0 group-hover/chart:opacity-100 transition-opacity">
                        {val}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                    <span key={i} className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      {isArabic
                        ? ["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"][i]
                        : day}
                    </span>
                  ))}
                </div>

                <div className="pt-6 mt-auto border-t border-slate-50">
                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    {t.stabilizedStat}<span className="font-bold text-academic-blue">+12%</span>{t.stabilizedStat2}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
