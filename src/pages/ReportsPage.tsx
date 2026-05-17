import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { Users, FileUp, HardDrive, UserCheck, Loader2 } from "lucide-react";

export default function ReportsPage() {
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
    adminOversight: isArabic ? "الإشراف الإداري" : "Admin Oversight",
    totalUsers: isArabic ? "إجمالي المستخدمين" : "Total Users",
    archivedSources: isArabic ? "المصادر المؤرشفة" : "Archived Sources",
    digitalStorage: isArabic ? "التخزين الرقمي" : "Digital Storage",
    userActivity: isArabic ? "نشاط المستخدمين" : "User Activity",
    name: isArabic ? "الاسم" : "Name",
    email: isArabic ? "البريد الإلكتروني" : "Email",
    files: isArabic ? "الملفات" : "Files",
    status: isArabic ? "الحالة" : "Status",
    active: isArabic ? "نشط" : "Active",
    inactive: isArabic ? "غير نشط" : "Inactive",
  };

  const stats = [
    {
      label: t.totalUsers,
      value: data?.totalUsers?.toLocaleString() || "0",
      icon: Users,
      color: "text-cafe-primary-light",
      bg: "bg-cafe-primary-light/10",
    },
    {
      label: t.archivedSources,
      value: data?.archivedSources?.toLocaleString() || "0",
      icon: FileUp,
      color: "text-cafe-warning",
      bg: "bg-cafe-warning/10",
    },
    {
      label: t.digitalStorage,
      value: data?.digitalStorage || "0 B",
      icon: HardDrive,
      color: "text-cafe-primary",
      bg: "bg-cafe-primary/10",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-cafe-surface dark:bg-cafe-surface-dark">
        <Sidebar currentScreen="reports" isAdmin={isAdmin} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-cafe-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-cafe-surface dark:bg-cafe-surface-dark">
        <Sidebar currentScreen="reports" isAdmin={isAdmin} />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-red-500 font-bold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cafe-primary text-white rounded-lg font-bold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen bg-cafe-surface dark:bg-cafe-surface-dark"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Sidebar currentScreen="reports" isAdmin={isAdmin} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 sm:h-20 bg-white/80 dark:bg-cafe-surface-dark-alt/80 backdrop-blur-md border-b border-cafe-primary/5 dark:border-cafe-border-dark flex items-center px-4 sm:px-6 md:px-10 shrink-0 z-10">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-cafe-primary dark:text-white">
              {t.adminOversight}
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-cafe-surface-dark-alt p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-cafe-border-dark shadow-sm"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bg} ${stat.color} rounded-lg sm:rounded-xl flex items-center justify-center`}
                    >
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-display font-bold text-cafe-primary dark:text-white leading-none">
                        {stat.value}
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-400 dark:text-cafe-text-dark-muted font-medium mt-1">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-cafe-surface-dark-alt rounded-xl sm:rounded-2xl border border-slate-100 dark:border-cafe-border-dark shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-slate-50 dark:border-cafe-border-dark">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cafe-primary/10 text-cafe-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                    <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-display font-bold text-cafe-primary dark:text-white">
                      {t.userActivity}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-start min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-cafe-surface-dark">
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-cafe-text-dark-muted uppercase tracking-wide">
                        {t.name}
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-cafe-text-dark-muted uppercase tracking-wide hidden md:table-cell">
                        {t.email}
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide">
                        {t.files}
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide">
                        {t.status}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-cafe-border-dark">
                    {data?.scholarActivity?.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 sm:px-6 py-10 sm:py-12 text-center text-slate-400 dark:text-cafe-text-dark-muted text-xs sm:text-sm"
                        >
                          {isArabic ? "لا توجد نتائج" : "No results found"}
                        </td>
                      </tr>
                    ) : (
                      data?.scholarActivity?.map((user: any) => (
                        <tr
                          key={user.id || user.email}
                          className="hover:bg-slate-50 dark:hover:bg-cafe-surface-dark transition-colors"
                        >
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-cafe-primary/10 text-cafe-primary font-bold text-xs sm:text-sm flex items-center justify-center flex-shrink-0">
                                {user.name
                                  ? user.name.charAt(0).toUpperCase()
                                  : "?"}
                              </div>
                              <p className="font-semibold text-cafe-primary dark:text-white text-xs sm:text-sm truncate">
                                {user.name || "—"}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-cafe-text-dark truncate max-w-[200px]">
                              {user.email || "—"}
                            </p>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-cafe-text-dark">
                              {user.files || 0}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <span
                              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                                user.status === "Active"
                                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  user.status === "Active"
                                    ? "bg-emerald-500"
                                    : "bg-slate-400"
                                }`}
                              />
                              {user.status === "Active" ? t.active : t.inactive}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
