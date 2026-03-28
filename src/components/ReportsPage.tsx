import React from "react";
import Sidebar from "./Sidebar";
import {
  Users,
  FileUp,
  TrendingUp,
  HardDrive,
  ArrowUpRight,
  UserCheck,
  Calendar,
  MoreVertical,
  Download,
} from "lucide-react";

export default function ReportsPage({
  onNavigate,
}: {
  onNavigate: (screen: string) => void;
}) {
  const stats = [
    {
      label: "Total Scholars",
      value: "1,284",
      growth: "+12%",
      icon: Users,
      color: "text-academic-blue",
      bg: "bg-academic-blue/5",
    },
    {
      label: "Archived Sources",
      value: "45,902",
      growth: "+8.4%",
      icon: FileUp,
      color: "text-academic-gold",
      bg: "bg-academic-gold/5",
    },
    {
      label: "Weekly Growth",
      value: "248",
      growth: "+18%",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Digital Storage",
      value: "1.2 TB",
      growth: "45% used",
      icon: HardDrive,
      color: "text-academic-navy",
      bg: "bg-academic-navy/5",
    },
  ];

  const scholarActivity = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.j@university.edu",
      files: 124,
      lastActive: "2 hours ago",
      status: "Active",
    },
    {
      id: 2,
      name: "Dr. Elena Moretti",
      email: "e.moretti@research.org",
      files: 89,
      lastActive: "5 hours ago",
      status: "Active",
    },
    {
      id: 3,
      name: "Marcus Aurelius",
      email: "marcus.a@stoic.edu",
      files: 56,
      lastActive: "1 day ago",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Sarah Jenkins",
      email: "s.jenkins@academy.edu",
      files: 212,
      lastActive: "Just now",
      status: "Active",
    },
    {
      id: 5,
      name: "Prof. Robert Langdon",
      email: "r.langdon@harvard.edu",
      files: 45,
      lastActive: "3 days ago",
      status: "Active",
    },
  ];

  // Simple mock data for 7 days
  const weeklyTrends = [45, 52, 38, 65, 48, 72, 58];
  const maxTrend = Math.max(...weeklyTrends);

  return (
    <div className="flex min-h-screen bg-academic-paper">
      <Sidebar currentScreen="reports" onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-academic-navy/5 flex items-center justify-between px-6 md:px-10 shrink-0 z-10">
          <div>
            <h1 className="text-2xl font-serif font-bold text-academic-navy">
              Administrative Oversight
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              System Analytics & Scholar Audit
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold hover:bg-white transition-all shadow-sm group">
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              Download Full Dossier
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Quick Metrics */}
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
              {/* Scholar Table */}
              <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-academic-navy text-white rounded-xl flex items-center justify-center shadow-lg shadow-academic-navy/10">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-serif font-bold text-academic-navy">
                      Scholar Activity Audit
                    </h2>
                  </div>
                  <button className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-100">
                    <MoreVertical className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white">
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                          Scholar
                        </th>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                          Archived Files
                        </th>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                          Status
                        </th>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-right">
                          Last Signal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {scholarActivity.map((scholar) => (
                        <tr
                          key={scholar.id}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-academic-navy/5 flex items-center justify-center text-academic-navy font-bold text-xs uppercase border border-academic-navy/10 flex-shrink-0 group-hover:bg-academic-navy group-hover:text-white transition-all">
                                {scholar.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-academic-navy truncate">
                                  {scholar.name}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                  {scholar.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <FileUp className="w-4 h-4 text-slate-300" />
                              <span className="font-bold text-slate-700">
                                {scholar.files}{" "}
                                <span className="text-[10px] text-slate-400 font-medium">
                                  Units
                                </span>
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                scholar.status === "Active"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              {scholar.status}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <span className="text-xs font-semibold text-slate-500 italic">
                              {scholar.lastActive}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Activity Trend (CSS Chart) */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 bg-academic-gold/10 text-academic-gold rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-academic-navy leading-tight">
                      Enrollment Velocity
                    </h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                      Past 7 Calendar Days
                    </p>
                  </div>
                </div>

                <div className="flex-1 flex items-end justify-between gap-4 h-64 mb-6">
                  {weeklyTrends.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                       <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-academic-gold transition-opacity mb-2">
                        {val}
                      </span>
                      <div 
                        className="w-full bg-academic-gold/10 rounded-full relative overflow-hidden transition-all group-hover:bg-academic-gold/20 flex flex-col justify-end"
                        style={{ height: `${(val / maxTrend) * 100}%` }}
                      >
                         <div className="w-full h-1/2 bg-academic-gold rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                        D0{i + 1}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-50">
                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    "Weekly intake has stabilized at <span className="font-bold text-academic-blue">+12%</span> relative to the previous archival period."
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
