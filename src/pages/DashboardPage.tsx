import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { useAppContext } from "../context/AppContext";
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
  const { isArabic } = useAppContext();

  const t = {
    scholar: isArabic ? "الطالب" : "Scholar",
    activeAccess: isArabic ? "وصول نشط" : "Active Access",
    researchHub: isArabic ? "مركز الأبحاث" : "Research Hub",
    welcome: isArabic ? "مرحباً بك مجدداً. لديك" : "Welcome back, Scholar. You have",
    reposActive: isArabic ? "مفهرس نشط في الأرشيف الخاص بك." : "repositories active in your archive.",
    archiveNewSource: isArabic ? "أرشفة مصدر جديد" : "Archive New Source",
    digitalCurricula: isArabic ? "المناهج الرقمية" : "Digital Curricula",
    activeArchive: isArabic ? "الأرشيف النشط" : "Active Archive",
    viewFullLibrary: isArabic ? "عرض المكتبة الكاملة" : "View Full Library",
    uploaded: isArabic ? "تم الرفع:" : "Uploaded:",
    indexed: isArabic ? "مفهرس" : "Indexed",
    synthesizing: isArabic ? "جاري التحليل..." : "Synthesizing..."
  };

  const [documents, setDocuments] = useState<document[]>([]);
  type document = {
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
   extracted_text:string
  };

  useEffect(() => {
    api.get("/documents")
      .then((res) => {
        setDocuments(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  let Count = 0;
  documents.forEach((items) => {
    Count++;
  });
  const formatSize = (bytes?: number) => {
    if (!bytes) return "0 MB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="flex min-h-screen bg-academic-paper" dir={isArabic ? "rtl" : "ltr"}>
      <Sidebar currentScreen="dashboard" isAdmin={isAdmin} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-academic-navy/5 flex items-center justify-between px-6 md:px-10 shrink-0 z-10">
          <div className="flex items-center gap-8 ms-auto">
            <div className="flex items-center gap-4">
              <div className="text-end hidden sm:block">
                <p className="text-sm font-bold text-academic-navy leading-tight">
                  {t.scholar}: Alex Johnson
                </p>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {t.activeAccess}
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
                  {t.researchHub}
                </h1>
                <p className="text-slate-500 font-medium">
<<<<<<< HEAD
                  Welcome back, Scholar. You have 4 newest repositories in your
                  dashboard.
=======
                  {t.welcome} {Count} {t.reposActive}
>>>>>>> dab8ccbf1e9308b705706a8dfce33177cbb807ad
                </p>
              </div>
              <button
                onClick={() => navigate("/upload")}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-academic-navy text-white px-8 py-4 rounded-2xl text-sm font-bold hover:bg-academic-blue transition-all shadow-xl shadow-academic-navy/20 hover:-translate-y-1 active:translate-y-0"
              >
                <Upload className="w-5 h-5 stroke-[2.5]" />
                {t.archiveNewSource}
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
                    {t.digitalCurricula}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold text-academic-navy">
                {t.activeArchive}
              </h2>
              <button
                onClick={() => navigate("/library")}
                className="text-xs font-bold text-academic-blue hover:text-academic-navy flex items-center gap-2 transition-all uppercase tracking-widest group"
              >
                {t.viewFullLibrary}
                <ArrowRight className={`w-4 h-4 transition-transform ${isArabic ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {documents.slice(0, 4).map((document: document) => (
                <div
                  key={document._id}
                  onClick={() =>
                    document.processing_status === "completed" &&
                    navigate(`/summary/${document._id}`)
                  }
                  className={`bg-white rounded-[2rem] border border-slate-100 p-7 transition-all group flex flex-col h-full relative overflow-hidden 
                  shadow-sm hover:shadow-2xl hover:shadow-academic-navy/5 hover:border-academic-blue/10 
<<<<<<< HEAD
                  ${
                    document.processing_status === "completed"
=======
                  ${item.processing_status === "completed"
>>>>>>> dab8ccbf1e9308b705706a8dfce33177cbb807ad
                      ? "cursor-pointer hover:-translate-y-2"
                      : "opacity-80 cursor-not-allowed"
                    }`}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div
<<<<<<< HEAD
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                        document.processing_status === "completed"
=======
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${item.processing_status === "completed"
>>>>>>> dab8ccbf1e9308b705706a8dfce33177cbb807ad
                          ? "bg-academic-blue/5 text-academic-blue border-academic-blue/10 group-hover:bg-academic-navy group-hover:text-white"
                          : "bg-academic-gold/5 text-academic-gold border-academic-gold/10"
                        }`}
                    >
                      <FileText className="w-7 h-7" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3
                        className={`text-lg font-serif font-bold truncate transition-colors leading-tight 
<<<<<<< HEAD
                      ${
                        document.processing_status === "completed"
                          ? "text-academic-navy group-hover:text-academic-blue"
                          : "text-slate-700"
                      }`}
                        title={document.title}
=======
                      ${item.processing_status === "completed"
                            ? "text-academic-navy group-hover:text-academic-blue"
                            : "text-slate-700"
                          }`}
                        title={item.title}
>>>>>>> dab8ccbf1e9308b705706a8dfce33177cbb807ad
                      >
                        {document.title}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="pt-6 border-t border-slate-50 flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-300" />
<<<<<<< HEAD
                        Uploaded:{" "}
                        {new Date(document.createdAt).toLocaleDateString("en-US", {
=======
                        {t.uploaded}{" "}
                        {new Date(item.createdAt).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
>>>>>>> dab8ccbf1e9308b705706a8dfce33177cbb807ad
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <HardDrive className="w-3 h-3 text-slate-300" />
                        {formatSize(document.file_size_bytes)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {document.processing_status === "completed" ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              {t.indexed}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-academic-gold/10 text-academic-gold rounded-full">
                            <Clock className="w-3.5 h-3.5 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-wider italic">
                              {t.synthesizing}
                            </span>
                          </div>
                        )}
                      </div>

                      {document.processing_status === "completed" && (
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-academic-blue/10 transition-colors">
                          <ChevronRight className={`w-5 h-5 text-slate-300 group-hover:text-academic-blue transition-colors ${isArabic ? 'rotate-180' : ''}`} />
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
