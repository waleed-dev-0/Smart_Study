import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import {
  Users,
  FileUp,
  HardDrive,
  ArrowUpRight,
  UserCheck,
  Loader2,
} from "lucide-react";

export default function ReportsPage() {
  const navigate = useNavigate();
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
      label: "Total Users",
      value: data?.totalUsers?.toLocaleString() || "0",
      growth: "Active",
      icon: Users,
      color: "text-academic-blue",
      bg: "bg-academic-blue/5",
    },
    {
      label: "Archived Sources",
      value: data?.archivedSources?.toLocaleString() || "0",
      growth: "Growing",
      icon: FileUp,
      color: "text-academic-gold",
      bg: "bg-academic-gold/5",
    },
    {
      label: "Digital Storage",
      value: data?.digitalStorage || "0 B",
      growth: "Used",
      icon: HardDrive,
      color: "text-academic-navy",
      bg: "bg-academic-navy/5",
    },
  ];

  const userActivity = data?.scholarActivity || [];

  return (
    <div className="flex min-h-screen bg-academic-paper">
      <Sidebar currentScreen="reports" isAdmin={isAdmin} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-academic-navy/5 flex items-center justify-between px-6 md:px-10 shrink-0 z-10">
          <div>
            <h1 className="text-2xl font-serif font-bold text-academic-navy">
              Administrative Oversight
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              System Analytics & User Audit
            </p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-academic-navy text-white rounded-xl flex items-center justify-center shadow-lg shadow-academic-navy/10">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-academic-navy">
                    User Activity Audit
                  </h2>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white">
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                        User
                      </th>
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                        Archived Files
                      </th>

                      <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-right">
                        Last Signal
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
                                Units
                              </span>
                            </span>
                          </div>
                        </td>

                        <td className="px-8 py-5 text-right">
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
          </div>
        </main>
      </div>
    </div>
  );
}
