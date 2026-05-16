import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import {
  Users,
  FileUp,
  HardDrive,
  UserCheck,
  Loader2,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function ReportsPage() {
  const navigate = useNavigate();
  const { isArabic } = useAppContext();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

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
    systemAnalytics: isArabic ? "تحليلات النظام ومراجعة المستخدمين" : "System Analytics & User Audit",
    totalUsers: isArabic ? "إجمالي المستخدمين" : "Total Users",
    archivedSources: isArabic ? "المصادر المؤرشفة" : "Archived Sources",
    weeklyGrowth: isArabic ? "النمو الأسبوعي" : "Weekly Growth",
    digitalStorage: isArabic ? "التخزين الرقمي" : "Digital Storage",
    used: isArabic ? "مستخدم" : "used",
    downloadReport: isArabic ? "تحميل التقرير" : "Download Report",
    userActivity: isArabic ? "نشاط المستخدمين" : "User Activity",
    name: isArabic ? "الاسم" : "Name",
    email: isArabic ? "البريد الإلكتروني" : "Email",
    files: isArabic ? "الملفات" : "Files",
    lastActive: isArabic ? "آخر نشاط" : "Last Active",
    status: isArabic ? "الحالة" : "Status",
    active: isArabic ? "نشط" : "Active",
    inactive: isArabic ? "غير نشط" : "Inactive",
    searchPlaceholder: isArabic ? "بحث بالاسم أو البريد..." : "Search by name or email...",
    total: isArabic ? "الإجمالي" : "Total",
    avgFiles: isArabic ? "متوسط الملفات" : "Avg Files",
    units: isArabic ? "ملف" : "files",
  };

  const filteredAndSorted = useMemo(() => {
    let users = [...(data?.scholarActivity || [])];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      users = users.filter(
        (u: any) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      );
    }

    users.sort((a: any, b: any) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      if (sortField === "files") {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else {
        aVal = (aVal || "").toLowerCase();
        bVal = (bVal || "").toLowerCase();
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return users;
  }, [data, searchQuery, sortField, sortDir]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ChevronDown className="w-3.5 h-3.5 opacity-30" />;
    return sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />;
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

  const totalFiles = filteredAndSorted.reduce(
    (sum: number, u: any) => sum + (Number(u.files) || 0),
    0
  );
  const avgFiles = filteredAndSorted.length
    ? (totalFiles / filteredAndSorted.length).toFixed(1)
    : "0";

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
    <div className="flex min-h-screen bg-cafe-surface dark:bg-cafe-surface-dark" dir={isArabic ? "rtl" : "ltr"}>
      <Sidebar currentScreen="reports" isAdmin={isAdmin} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 sm:h-20 bg-white/80 dark:bg-cafe-surface-dark-alt/80 backdrop-blur-md border-b border-cafe-primary/5 dark:border-cafe-border-dark flex items-center justify-between px-4 sm:px-6 md:px-10 shrink-0 z-10">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-cafe-primary dark:text-white">
              {t.adminOversight}
            </h1>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-cafe-text-dark-muted uppercase tracking-widest mt-0.5 hidden sm:block">
              {t.systemAnalytics}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {t.active}
              </span>
              <span className="text-slate-300">=</span>
              <span>{isArabic ? "لديه ملفات" : "has files"}</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                {t.inactive}
              </span>
              <span className="text-slate-300">=</span>
              <span>{isArabic ? "بدون ملفات" : "no files"}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-cafe-surface-dark-alt p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-cafe-border-dark shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bg} ${stat.color} rounded-lg sm:rounded-xl flex items-center justify-center`}>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cafe-primary/10 text-cafe-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                      <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-display font-bold text-cafe-primary dark:text-white">
                        {t.userActivity}
                      </h2>
                      <p className="text-[10px] sm:text-xs text-slate-400 dark:text-cafe-text-dark-muted">
                        {t.total}: {filteredAndSorted.length} &middot; {t.avgFiles}: {avgFiles}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className="w-full sm:w-64 pl-10 pr-4 py-2 sm:py-2.5 bg-slate-50 dark:bg-cafe-surface-dark border border-slate-200 dark:border-cafe-border-dark rounded-lg sm:rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cafe-primary/20 focus:border-cafe-primary/40 transition-all"
                    />
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
                      <th
                        className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide cursor-pointer hover:text-cafe-primary transition-colors select-none"
                        onClick={() => handleSort("files")}
                      >
                        <span className="inline-flex items-center gap-1">
                          {t.files}
                          <SortIcon field="files" />
                        </span>
                      </th>
                      <th
                        className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide cursor-pointer hover:text-cafe-primary transition-colors select-none hidden lg:table-cell"
                        onClick={() => handleSort("lastActive")}
                      >
                        <span className="inline-flex items-center gap-1">
                          {t.lastActive}
                          <SortIcon field="lastActive" />
                        </span>
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide">
                        {t.status}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-cafe-border-dark">
                    {filteredAndSorted.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 sm:px-6 py-10 sm:py-12 text-center text-slate-400 dark:text-cafe-text-dark-muted text-xs sm:text-sm">
                          {isArabic ? "لا توجد نتائج" : "No results found"}
                        </td>
                      </tr>
                    ) : (
                      filteredAndSorted.map((user: any) => {
                        const isActive = user.status === "Active";
                        return (
                          <tr
                            key={user.id || user.email}
                            className="hover:bg-slate-50 dark:hover:bg-cafe-surface-dark transition-colors cursor-pointer"
                            onClick={() =>
                              setExpandedRow(
                                expandedRow === user.id ? null : user.id
                              )
                            }
                          >
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-cafe-primary/10 text-cafe-primary font-bold text-xs sm:text-sm flex items-center justify-center flex-shrink-0">
                                  {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-cafe-primary dark:text-white text-xs sm:text-sm truncate">
                                    {user.name || "—"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-cafe-text-dark truncate max-w-[200px]">
                                {user.email || "—"}
                              </p>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                              <span className="inline-flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-cafe-text-dark">
                                <FileUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                                {user.files || 0}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-cafe-text-dark">
                                {user.lastActive || "—"}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                              <span
                                className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                                  isActive
                                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isActive ? "bg-emerald-500" : "bg-slate-400"
                                  }`}
                                />
                                {isActive ? t.active : t.inactive}
                              </span>
                            </td>
                          </tr>
                        );
                      })
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
