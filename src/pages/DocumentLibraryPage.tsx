import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { useAppContext } from "../context/AppContext";
import {
  Search,
  FileText,
  HardDrive,
  ChevronRight,
  ArrowLeft,
  Library,
  Trash2,
} from "lucide-react";
import { useEffect } from "react";

export default function DocumentLibraryPage({isAdmin,}: { isAdmin?: boolean; }) {
  const navigate = useNavigate();
  const { isArabic } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");

  const t = {
    title: isArabic ? "الملفات الأكاديمي" : "Documents",
    searchPlaceholder: isArabic ? "ابحث عن المواد المصدرية حسب التسمية" : "Search documents...",
    uploaded: isArabic ? "تاريخ الرفع:" : "Uploaded:",
    deleteFailed: isArabic ? "فشل في حذف المستند" : "Failed to delete document",
    noRecords: isArabic ? "لم يتم العثور على سجلات" : "No Documents Found",
    noRecordsDesc: isArabic ? "لم يتطابق استعلام البحث الخاص بك مع أي أرشيف في هذا المستودع." : "We couldn't find any documents matching your search.",
    clearParams: isArabic ? "مسح جميع المعايير" : "Clear Search",
  };

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
      extracted_text:string;
  };

  const [documents, setDocuments] = useState<document[]>([]);

  useEffect(() => {

   fetch("http://localhost:5000/api/documents",{
       headers: {
           Authorization: `Bearer ${localStorage.getItem("token")}`,
       }
   }).then(res=>res.json())
       .then(data=>{
           setDocuments(data.data)
       })
  }, []);

  const filteredDocs = documents.filter((document) => {
    const q = searchQuery.toLowerCase();
    return (
      document.title.toLowerCase().includes(q) ||
      (document.extracted_text && document.extracted_text.toLowerCase().includes(q))
    );
  });

  const formatSize = (bytes?: number) => {
    if (!bytes) return "0 MB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/documents/${id}`, {
            method: "DELETE",
                headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

      const data = await res.json();
      if (data.success) {
        const updatedDocuments = documents.filter((document) => document._id !== id);
        setDocuments(updatedDocuments);
      } else {
        alert(t.deleteFailed);
      }
    } catch (error) {
        console.error("Delete error:", error);
    }
};

  return (
    <div className="flex min-h-screen bg-cafe-surface dark:bg-cafe-surface-dark">
      <Sidebar currentScreen="my_documents" isAdmin={isAdmin} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 sm:h-20 bg-white/80 dark:bg-cafe-surface-dark-alt/80 backdrop-blur-md border-b border-cafe-primary/5 dark:border-cafe-border-dark flex items-center px-4 sm:px-6 md:px-10 shrink-0 z-10 gap-4 sm:gap-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 sm:p-3 bg-slate-50 dark:bg-cafe-surface-dark hover:bg-cafe-primary dark:hover:bg-cafe-primary hover:text-white dark:text-cafe-text-dark dark:hover:text-white rounded-xl text-slate-500 transition-all shrink-0 hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Library className="w-5 h-5 sm:w-6 sm:h-6 text-cafe-primary shrink-0" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-cafe-primary dark:text-white tracking-tight truncate">
              {t.title}
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 pb-24 md:pb-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-10 md:mb-12 flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 start-0 ps-4 sm:ps-6 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
                </div>
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full ps-12 sm:ps-14 pe-4 sm:pe-6 py-3 sm:py-4 md:py-4.5 bg-white dark:bg-cafe-surface-dark border border-slate-200 dark:border-cafe-border-dark rounded-xl sm:rounded-[1.5rem] text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-cafe-primary-light/5 focus:border-cafe-primary-light shadow-xl shadow-cafe-primary/5 dark:shadow-black/20 transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {filteredDocs.map((document: document) => (
                <div
                  key={document._id}
                  onClick={() => navigate(`/summary/${document._id}`)}
                  className="bg-white dark:bg-cafe-surface-dark-alt rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-cafe-border-dark p-5 sm:p-7 hover:border-cafe-primary-light/30 hover:shadow-2xl dark:hover:shadow-black/20 transition-all cursor-pointer group flex flex-col justify-between h-full relative overflow-hidden"
                >
                  <div className="absolute top-0 start-0 w-1.5 h-full bg-cafe-primary-light -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>

                  <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-cafe-primary-light/10 dark:bg-cafe-primary-light/20 text-cafe-primary-light dark:text-white flex items-center justify-center group-hover:bg-cafe-primary-light group-hover:text-white transition-all shrink-0">
                      <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <h3
                        className="text-lg sm:text-xl md:text-2xl font-bold text-cafe-primary-light dark:text-white truncate"
                        title={document.title}
                      >
                        {document.title}
                      </h3>

                      <span className="text-xs sm:text-sm font-medium text-cafe-primary-light/70 dark:text-cafe-text-dark-muted uppercase tracking-widest mt-1">
                        {document.file_format}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto space-y-3 sm:space-y-4">
                    <div className="flex flex-col gap-1 text-xs sm:text-sm text-cafe-primary-light/70 dark:text-cafe-text-dark">
                      <span>
                        {t.uploaded}{" "}
                        {new Date(document.createdAt).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center pt-3 sm:pt-4 border-t border-cafe-primary-light/10">
                      <span className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-cafe-primary-light dark:text-cafe-text-dark font-medium">
                        <HardDrive className="w-4 h-4 sm:w-5 sm:h-5" />
                        {formatSize(document.file_size_bytes)}
                      </span>

                      <div className="flex items-center gap-1.5 sm:gap-2 ms-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(document._id);
                          }}
                          className="p-1.5 sm:p-2 rounded-xl text-red-500 hover:bg-red-100 hover:text-red-700 hover:scale-110
                                          transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        <ChevronRight className={`w-5 h-5 sm:w-6 sm:h-6 text-cafe-primary-light/60 group-hover:text-cafe-primary-light transition-colors ${isArabic ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {documents.length > 0 && filteredDocs.length === 0 && (
              <div className="text-center py-16 sm:py-24 bg-white/50 dark:bg-cafe-surface-dark-alt/50 backdrop-blur-sm rounded-2xl sm:rounded-[3rem] border border-slate-200 dark:border-cafe-border-dark border-dashed">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-cafe-surface-dark rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl border border-slate-100 dark:border-cafe-border-dark">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-cafe-primary dark:text-white mb-2">
                  {t.noRecords}
                </h3>
                <p className="text-sm sm:text-base text-slate-500 dark:text-cafe-text-dark px-4">
                  {t.noRecordsDesc}
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-6 sm:mt-8 text-cafe-primary-light font-bold uppercase tracking-widest text-xs hover:text-cafe-primary transition-colors"
                >
                  {t.clearParams}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
