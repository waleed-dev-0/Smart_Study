import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { useAppContext } from "../context/AppContext";
import { API_BASE_URL } from "../config";
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

const SERVER_ORIGIN = API_BASE_URL.replace('/api', '');

function getFullAvatarUrl(avatar: string): string {
  if (!avatar) return "";
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar;
  return `${SERVER_ORIGIN}${avatar}`;
}

export default function DashboardPage({ isAdmin }: { isAdmin?: boolean }) {
  const navigate = useNavigate();
  const { isArabic, user } = useAppContext();

  const t = {
    researchHub: isArabic ? "مركز الأبحاث" : "Research Hub",
    welcome: isArabic ? "مرحباً بك مجدداً. لديك" : "Welcome back. You have",
    reposActive: isArabic ? "ملفات نشط في المكتبة الخاص بك." : "Documents active in your library.",
    archiveNewSource: isArabic ? "أرشفة مصدر جديد" : "Archive New Source",
    digitalCurricula: isArabic ? "المناهج الرقمية" : "Digital Curricula",
    activeArchive: isArabic ? "الأرشيف النشط" : "Active Document PDF",
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
  documents.forEach((document) => {
    Count++;
  });
  const formatSize = (bytes?: number) => {
    if (!bytes) return "0 MB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="flex min-h-screen bg-cafe-surface dark:bg-cafe-surface-dark" dir={isArabic ? "rtl" : "ltr"}>
      <Sidebar currentScreen="dashboard" isAdmin={isAdmin} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 sm:h-20 bg-white/80 dark:bg-cafe-surface-dark/80 backdrop-blur-md border-b border-cafe-primary/5 flex items-center justify-between px-4 sm:px-6 md:px-10 shrink-0 z-10">
          <div className="flex items-center gap-4 sm:gap-8 ms-auto">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-end hidden sm:block">
                <p className="text-xs sm:text-sm font-bold text-cafe-primary dark:text-white leading-tight">
                  {user?.name || user?.username || 'User'}
                </p>
              </div>
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-cafe-primary p-0.5 shadow-lg shadow-cafe-primary/10 overflow-hidden transform transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                <img
                  src={getFullAvatarUrl(user?.avatar || '') || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"}
                  alt={user?.name || "Avatar"}
                  className="w-full h-full object-cover rounded-[14px]"
                  referrerPolicy="no-referrer"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"; }}
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 pb-24 md:pb-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-cafe-primary dark:text-white mb-1 sm:mb-2 tracking-tight">
                  {t.researchHub}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-cafe-text-dark-muted font-medium">
                  {t.welcome} at least 4 {t.reposActive}
                </p>
              </div>
              <button
                onClick={() => navigate("/upload")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 bg-cafe-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold hover:bg-cafe-primary-light transition-all shadow-xl shadow-cafe-primary/20"
              >
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                {t.archiveNewSource}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div className="bg-white dark:bg-cafe-surface-dark-alt p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-slate-100 dark:border-cafe-border-dark shadow-xl shadow-slate-200/40 dark:shadow-black/20 flex items-center gap-4 sm:gap-6 group hover:border-cafe-primary-light/20 transition-all">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-cafe-primary-light/5 text-cafe-primary-light rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-cafe-primary-light/10">
                  <Library className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-cafe-primary dark:text-white leading-none mb-1">
                    {Count}
                  </p>
                    <p className="text-[10px] sm:text-xs text-slate-400 dark:text-cafe-text-dark-muted font-bold uppercase tracking-widest">
                    {t.digitalCurricula}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-cafe-primary dark:text-white">
                {t.activeArchive}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {documents.slice(0, 4).map((document: document) => (
                <div
                  key={document._id}
                  onClick={() =>
                    document.processing_status === "completed" &&
                    navigate(`/summary/${document._id}`)
                  }
                  className={`bg-white dark:bg-cafe-surface-dark-alt rounded-2xl sm:rounded-[2rem] border border-slate-100 dark:border-cafe-border-dark p-5 sm:p-7 transition-all group flex flex-col h-full relative overflow-hidden 
                  shadow-sm dark:shadow-black/20 hover:shadow-2xl hover:shadow-cafe-primary/5 hover:border-cafe-primary-light/10 dark:hover:border-cafe-border-dark/50
                  ${document.processing_status === "completed"
                      ? "cursor-pointer hover:-translate-y-1 sm:hover:-translate-y-2"
                      : "opacity-80 cursor-not-allowed"
                    }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                        document.processing_status === "completed"
                          ? "bg-cafe-primary-light/5 text-cafe-primary-light border-cafe-primary-light/10 group-hover:bg-cafe-primary group-hover:text-white"
                          : "bg-cafe-warning/5 text-cafe-warning border-cafe-warning/10"
                        }`}
                    >
                      <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3
                        className={`text-base sm:text-lg font-display font-bold truncate transition-colors leading-tight 
                      ${
                        document.processing_status === "completed"
                          ? "text-cafe-primary group-hover:text-cafe-primary-light dark:text-white dark:group-hover:text-cafe-primary-light"
                          : "text-slate-700 dark:text-cafe-text-dark-muted"
                      }`}
                        title={document.title}
                      >
                        {document.title}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="pt-4 sm:pt-6 border-t border-slate-50 dark:border-cafe-border-dark flex items-center gap-3 sm:gap-4 text-[10px] font-bold text-slate-400 dark:text-cafe-text-dark-muted uppercase tracking-widest mb-4 sm:mb-6">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-300" />
                        {t.uploaded}{" "}
                        {new Date(document.createdAt).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
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
                          <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full">
                            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                              {t.indexed}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-cafe-warning/10 text-cafe-warning rounded-full">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider italic">
                              {t.synthesizing}
                            </span>
                          </div>
                        )}
                      </div>

                      {document.processing_status === "completed" && (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-cafe-border-dark flex items-center justify-center group-hover:bg-cafe-primary-light/10 transition-colors">
                          <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-cafe-primary-light transition-colors ${isArabic ? 'rotate-180' : ''}`} />
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
