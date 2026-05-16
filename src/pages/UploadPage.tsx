import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  UploadCloud,
  File,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  GraduationCap,
  Clock,
  Copy,
} from "lucide-react";
import { uploadFile, UploadError } from "../features/upload/services/uploadService";
import { useAppContext } from "../context/AppContext";

export default function UploadPage({ isAdmin }: { isAdmin?: boolean }) {
  const navigate = useNavigate();
  const { isArabic } = useAppContext();
  const [searchParams] = useSearchParams();
  const parentId = searchParams.get("parentId");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);

  const t = {
    archiveIngestion: isArabic ? "استيراد المستندات" : "Archive Ingestion",
    secureScholarIngestion: isArabic ? "استيراد آمن" : "Secure Scholar Ingestion",
    ingestNewSource: isArabic ? "استيراد مصدر جديد" : "Ingest New Source Material",
    provideDesc: isArabic ? "قم بتقديم مستنداتك الأكاديمية لبدء التوليف الدلالي وإنشاء التقييمات." : "Provide your academic documentation to initiate semantic synthesis and evaluation generation.",
    depositManuscript: isArabic ? "إيداع المستند" : "Deposit Manuscript",
    pdfFormat: isArabic ? "صيغة PDF • حد أقصى 50 ميجابايت" : "PDF Format • Maximum 50MB",
    browseLocal: isArabic ? "تصفح الملفات المحلية" : "Browse Local Archive",
    formatRejection: isArabic ? "رفض التنسيق" : "Format Rejection",
    formatRejectionDesc: isArabic ? "المستند المقدم لا يتوافق مع معيار PDF المقبول. يرجى التحقق من تنسيق الملف والمحاولة مرة أخرى." : "The provided document does not adhere to the accepted PDF standard. Please verification the file format and try again.",
    resetIngestion: isArabic ? "إعادة تعيين" : "Reset Ingestion",
    status: isArabic ? "الحالة" : "Status",
    ingestingIndexing: isArabic ? "جاري الاستيراد والفهرسة..." : "Ingesting and Indexing...",
    archiveNavigation: isArabic ? "تصفح الأرشيف" : "Archive Navigation",
    processingArchive: isArabic ? "جاري المعالجة..." : "Processing Archive...",
    archiveSecured: isArabic ? "تم تأمين الأرشيف" : "Archive Secured",
    initiateSynthesis: isArabic ? "بدء التوليف" : "Initiate Synthesis",
    documentAlreadyIndexed: isArabic ? "المستند مفهرس بالفعل" : "Document Already Indexed",
    aFileNamed: isArabic ? "ملف باسم" : "A file named",
    alreadyExists: isArabic ? "موجود بالفعل في أرشيفك." : "already exists in your archive.",
    duplicateWarning: isArabic ? "إعادة الرفع ستؤدي إلى إنشاء إدخال مكرر. هل تريد المتابعة؟" : "Re-uploading will create a duplicate entry. Would you like to continue anyway?",
    cancel: isArabic ? "إلغاء" : "Cancel",
    uploadAnyway: isArabic ? "رفع على أي حال" : "Upload Anyway",
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setUploadStatus("idle");
      } else {
        setUploadStatus("error");
      }
    }
  };

  const handleFileChange = (e: { target: HTMLInputElement }) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setUploadStatus("idle");
      } else {
        setUploadStatus("error");
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus("uploading");
    setUploadProgress(30);

    try {
      const result = await uploadFile(selectedFile, parentId || undefined);
      setUploadProgress(100);
      setUploadStatus("success");

      localStorage.setItem("activeDocumentId", result.data.documentId);

      setTimeout(() => {
        navigate("/chat");
      }, 1500);
    } catch (error: any) {
      console.error("Upload failed:", error);
      if (error instanceof UploadError && error.status === 409) {
        setShowDuplicateDialog(true);
        setUploadStatus("idle");
      } else {
        setUploadStatus("error");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-cafe-surface dark:bg-cafe-surface-dark" dir={isArabic ? "rtl" : "ltr"}>
      <Sidebar currentScreen="upload" isAdmin={isAdmin} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 sm:h-20 bg-white/80 dark:bg-cafe-surface-dark/80 backdrop-blur-md border-b border-cafe-primary/5 flex items-center px-4 sm:px-6 md:px-10 shrink-0 z-10">
          <h1 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-cafe-primary dark:text-white tracking-tight">
            {t.archiveIngestion}
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 pb-24 md:pb-10 flex items-center justify-center">
          <div className="w-full max-w-2xl sm:max-w-3xl">
            <div className="bg-white dark:bg-cafe-surface-dark-alt rounded-2xl sm:rounded-[2.5rem] border border-slate-100 dark:border-cafe-border-dark shadow-2xl shadow-cafe-primary/5 dark:shadow-black/20 p-6 sm:p-8 md:p-14 relative overflow-hidden">
              <div className="absolute top-0 start-0 w-full h-1.5 bg-gradient-to-r from-cafe-primary via-cafe-primary-light to-cafe-warning opacity-30"></div>

              <div className="text-center mb-8 sm:mb-12">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-cafe-primary-light/5 rounded-full mb-4 sm:mb-6">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cafe-primary-light" />
                  <span className="text-[10px] font-bold text-cafe-primary-light uppercase tracking-widest">
                    {t.secureScholarIngestion}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-cafe-primary dark:text-white mb-3 sm:mb-4">
                  {t.ingestNewSource}
                </h2>
                <p className="text-sm sm:text-base text-slate-500 dark:text-cafe-text-dark-muted font-medium max-w-lg mx-auto leading-relaxed">
                  {t.provideDesc}
                </p>
              </div>

              {!selectedFile && uploadStatus !== "error" && (
                <div
                  className={`border-2 border-dashed rounded-xl sm:rounded-[2rem] p-8 sm:p-12 md:p-16 flex flex-col items-center justify-center transition-all group ${
                    isDragging
                      ? "border-cafe-primary-light bg-cafe-primary-light/5 scale-[0.99]"
                       : "border-slate-200 dark:border-cafe-border-dark bg-slate-50/50 dark:bg-cafe-surface-dark hover:bg-white dark:hover:bg-cafe-surface-dark-alt hover:border-cafe-primary-light/30 hover:shadow-xl hover:shadow-cafe-primary/5"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white dark:bg-cafe-surface-dark-alt rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 dark:border-cafe-border-dark mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-7 h-7 sm:w-10 sm:h-10 text-cafe-primary dark:text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-cafe-primary dark:text-white mb-2">
                    {t.depositManuscript}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium mb-6 sm:mb-10 tracking-wide uppercase">
                    {t.pdfFormat}
                  </p>

                  <label className="bg-cafe-primary text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold hover:bg-cafe-primary-light transition-all shadow-xl shadow-cafe-primary/20 cursor-pointer active:scale-95">
                    {t.browseLocal}
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}

              {uploadStatus === "error" && !selectedFile && (
                <div className="border-2 border-dashed border-red-200 dark:border-red-900/30 bg-red-50/50 rounded-xl sm:rounded-[2rem] p-8 sm:p-12 md:p-16 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white dark:bg-red-950/50 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg mb-4 sm:mb-6 border border-red-100 dark:border-red-900/30">
                    <AlertCircle className="w-7 h-7 sm:w-10 sm:h-10 text-red-500" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-red-900 mb-2">
                    {t.formatRejection}
                  </h3>
                  <p className="text-xs sm:text-sm text-red-600 font-medium mb-6 sm:mb-10 leading-relaxed">
                    {t.formatRejectionDesc}
                  </p>
                  <button
                    onClick={() => setUploadStatus("idle")}
                    className="bg-white dark:bg-transparent border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/30 transition-all shadow-sm"
                  >
                    {t.resetIngestion}
                  </button>
                </div>
              )}

              {selectedFile && (
                <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white dark:bg-cafe-surface-dark-alt border border-slate-100 dark:border-cafe-border-dark shadow-xl shadow-cafe-primary/5 dark:shadow-black/20 rounded-xl sm:rounded-[1.5rem] p-4 sm:p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4 sm:gap-6 overflow-hidden">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-cafe-primary-light/5 text-cafe-primary-light rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border border-cafe-primary-light/10">
                        <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base sm:text-lg font-display font-bold text-cafe-primary dark:text-white truncate">
                          {selectedFile.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                    </div>

                    {uploadStatus === "idle" && (
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="p-2 sm:p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all shrink-0"
                      >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                    )}

                    {uploadStatus === "success" && (
                      <div className="p-2 sm:p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 shrink-0" />
                      </div>
                    )}
                  </div>

                  {uploadStatus === "uploading" && (
                    <div className="space-y-3 sm:space-y-4 px-2">
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-cafe-primary-light uppercase tracking-widest">
                            {t.status}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-cafe-primary">
                            {t.ingestingIndexing}
                          </span>
                        </div>
                        <span className="text-xl sm:text-2xl font-display font-bold text-cafe-primary-light">
                          {uploadProgress}%
                        </span>
                      </div>
                      <div className="w-full h-2 sm:h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full bg-cafe-primary rounded-full transition-all duration-300 relative"
                          style={{ width: `${uploadProgress}%` }}
                        >
                          <div className="absolute top-0 end-0 w-6 sm:w-8 h-full bg-white/20 skew-x-12 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-slate-50 dark:border-cafe-surface-dark">
                    <button
                      onClick={() => navigate("/dashboard")}
                      disabled={uploadStatus === "uploading"}
                      className="flex-1 bg-white dark:bg-transparent border border-slate-200 dark:border-cafe-border-dark text-slate-500 dark:text-cafe-text-dark px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold hover:bg-slate-50 dark:hover:bg-cafe-surface-dark transition-all disabled:opacity-50 uppercase tracking-widest"
                    >
                      {t.archiveNavigation}
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={
                        uploadStatus === "uploading" ||
                        uploadStatus === "success"
                      }
                      className="flex-[2] bg-cafe-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold hover:bg-cafe-primary-light transition-all shadow-xl shadow-cafe-primary/20 disabled:opacity-50 flex items-center justify-center gap-2 sm:gap-3 active:scale-95"
                    >
                      {uploadStatus === "uploading" ? (
                        <>
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          {t.processingArchive}
                        </>
                      ) : uploadStatus === "success" ? (
                        <>
                          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                          {t.archiveSecured}
                        </>
                      ) : (
                        <>
                          <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                          {t.initiateSynthesis}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {showDuplicateDialog && (
                <div className="mt-6 sm:mt-8 border-2 border-amber-200 dark:border-amber-900/30 bg-amber-50/60 dark:bg-amber-900/20 rounded-xl sm:rounded-[2rem] p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white dark:bg-amber-950/50 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg mb-4 sm:mb-6 border border-amber-100 dark:border-amber-900/30">
                    <Copy className="w-7 h-7 sm:w-10 sm:h-10 text-amber-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-amber-900 dark:text-amber-100 mb-2 sm:mb-3">
                    {t.documentAlreadyIndexed}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-200 font-medium mb-1 sm:mb-2 leading-relaxed max-w-md">
                    {t.aFileNamed} <strong className="text-amber-900 dark:text-amber-100">{selectedFile?.name}</strong> {t.alreadyExists}
                  </p>
                  <p className="text-[10px] sm:text-xs text-amber-600/80 font-medium mb-6 sm:mb-8">
                    {t.duplicateWarning}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-sm">
                    <button
                      onClick={() => {
                        setShowDuplicateDialog(false);
                        setSelectedFile(null);
                      }}
                      className="flex-1 bg-white dark:bg-transparent border border-amber-200 dark:border-amber-900/30 text-amber-700 dark:text-amber-400 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all shadow-sm"
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={() => {
                        setShowDuplicateDialog(false);
                        setUploadStatus("uploading");
                        setUploadProgress(30);
                        uploadFile(selectedFile!, parentId || undefined, true)
                          .then((result) => {
                            setUploadProgress(100);
                            setUploadStatus("success");
                            localStorage.setItem("activeDocumentId", result.data.documentId);
                            setTimeout(() => navigate("/chat"), 1500);
                          })
                          .catch(() => setUploadStatus("error"));
                      }}
                      className="flex-1 bg-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20 active:scale-95"
                    >
                      {t.uploadAnyway}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
