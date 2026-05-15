import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import {
  Search,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  ChevronRight,
  Calendar,
  HardDrive,
  ArrowRight,
  Library,
  BookOpen,
  GraduationCap,
} from "lucide-react";

export default function DashboardPage({ isAdmin }: { isAdmin?: boolean }) {
  const navigate = useNavigate();

  const [items, setItems] = useState<Item[]>([]);
  type Item = {
    _id: string;
    title: string;
    file_path: string;
    file_size_bytes?: number;
    file_format?: string;
    page_count?: number;
    processing_status?: string;
    is_secondary?: boolean;
    createdAt: string;
    updatedAt: string;
  };

  useEffect(() => {
    api.get("/documents")
      .then((res) => {
        setItems(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  let Count = 0;
  items.forEach((items) => {
    Count++;
  });
  const formatSize = (bytes?: number) => {
    if (!bytes) return "0 MB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="flex min-h-screen bg-academic-paper">
      <Sidebar currentScreen="dashboard" isAdmin={isAdmin} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-academic-navy/5 flex items-center justify-between px-6 md:px-10 shrink-0 z-10">
          <div className="flex items-center gap-8 ml-auto">
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-academic-navy leading-tight">
                  Scholar: Alex Johnson
                </p>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Active Access
                  </p>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-academic-navy p-0.5 shadow-lg shadow-academic-navy/10 overflow-hidden transform transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                  alt="Scholar Avatar"
                  className="w-full h-full object-cover rounded-[14px]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-24 md:pb-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-academic-navy mb-2 tracking-tight">
                  Research Hub
                </h1>
                <p className="text-slate-500 font-medium">
                  Welcome back, Scholar. You have 4 repositories active in your
                  archive.
                </p>
              </div>
              <button
                onClick={() => navigate("/upload")}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-academic-navy text-white px-8 py-4 rounded-2xl text-sm font-bold hover:bg-academic-blue transition-all shadow-xl shadow-academic-navy/20 hover:-translate-y-1 active:translate-y-0"
              >
                <Upload className="w-5 h-5 stroke-[2.5]" />
                Archive New Source
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-6 group hover:border-academic-blue/20 transition-all">
                <div className="w-16 h-16 bg-academic-blue/5 text-academic-blue rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-academic-blue/10">
                  <Library className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-3xl font-serif font-bold text-academic-navy leading-none mb-1">
                    {Count}
                  </p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Digital Curricula
                  </p>
                </div>
              </div>

              {/*<div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-6 group hover:border-academic-gold/20 transition-all">*/}
              {/*  <div className="w-16 h-16 bg-academic-gold/5 text-academic-gold rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-academic-gold/10">*/}
              {/*    <BookOpen className="w-8 h-8" />*/}
              {/*  </div>*/}
              {/*  /!*<div>*!/*/}
              {/*  /!*  <p className="text-3xl font-serif font-bold text-academic-navy leading-none mb-1">*!/*/}
              {/*  /!*    8*!/*/}
              {/*  /!*  </p>*!/*/}
              {/*  /!*  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">*!/*/}
              {/*  /!*    Technical Syntheses*!/*/}
              {/*  /!*  </p>*!/*/}
              {/*  /!*</div>*!/*/}
              {/*</div>*/}
            </div>

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold text-academic-navy">
                Active Archive
              </h2>
              <button
                onClick={() => navigate("/library")}
                className="text-xs font-bold text-academic-blue hover:text-academic-navy flex items-center gap-2 transition-all uppercase tracking-widest group"
              >
                View Full Library
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.slice(0, 4).map((item: Item) => (
                <div
                  key={item._id}
                  onClick={() =>
                    item.processing_status === "completed" &&
                    navigate(`/chat?docId=${item._id}`)
                  }
                  className={`bg-white rounded-[2rem] border border-slate-100 p-7 transition-all group flex flex-col h-full relative overflow-hidden 
                  shadow-sm hover:shadow-2xl hover:shadow-academic-navy/5 hover:border-academic-blue/10 
                  ${
                    item.processing_status === "completed"
                      ? "cursor-pointer hover:-translate-y-2"
                      : "opacity-80 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                        item.processing_status === "completed"
                          ? "bg-academic-blue/5 text-academic-blue border-academic-blue/10 group-hover:bg-academic-navy group-hover:text-white"
                          : "bg-academic-gold/5 text-academic-gold border-academic-gold/10"
                      }`}
                    >
                      <FileText className="w-7 h-7" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3
                        className={`text-lg font-serif font-bold truncate transition-colors leading-tight 
                      ${
                        item.processing_status === "completed"
                          ? "text-academic-navy group-hover:text-academic-blue"
                          : "text-slate-700"
                      }`}
                        title={item.title}
                      >
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="pt-6 border-t border-slate-50 flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-300" />
                        Uploaded:{" "}
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <HardDrive className="w-3 h-3 text-slate-300" />
                        {formatSize(item.file_size_bytes)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.processing_status === "completed" ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              Indexed
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-academic-gold/10 text-academic-gold rounded-full">
                            <Clock className="w-3.5 h-3.5 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-wider italic">
                              Synthesizing...
                            </span>
                          </div>
                        )}
                      </div>

                      {item.processing_status === "completed" && (
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-academic-blue/10 transition-colors">
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-academic-blue transition-colors" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
