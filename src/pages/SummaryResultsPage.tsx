import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import { useAppContext } from "../context/AppContext";
import api from "../services/api";
import {
    ArrowLeft, Brain, FileText, MessageSquare, Zap,
    Sparkles, Loader2, AlertCircle,
    StickyNote
} from 'lucide-react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type SummaryType = "brief" | "detailed" | "technical";

interface DocumentData {
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
    extracted_text: string;
}

interface ISummary {
    _id: string;
    document_id: string;
    summary_content: string;
    summary_type: "brief" | "detailed" | "technical";
    createdAt: string;
    updatedAt: string;
}

const markdownComponents = {
  h1: ({ children }: any) => (
    <h1 className="text-xl font-display font-bold text-cafe-primary dark:text-white mt-4 mb-2 first:mt-0">{children}</h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-lg font-display font-bold text-cafe-primary dark:text-white mt-4 mb-2 first:mt-0">{children}</h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-base font-bold text-cafe-primary dark:text-cafe-secondary mt-3 mb-1 first:mt-0">{children}</h3>
  ),
  p: ({ children }: any) => (
    <p className="mb-3 last:mb-0 leading-relaxed text-slate-700 dark:text-[#E5E0D8]">{children}</p>
  ),
  strong: ({ children }: any) => (
    <strong className="font-bold text-cafe-primary dark:text-white">{children}</strong>
  ),
  em: ({ children }: any) => <em className="italic text-slate-600 dark:text-[#D6CFCA]">{children}</em>,
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside space-y-1 mb-3 ml-2 text-slate-700 dark:text-[#E5E0D8]">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside space-y-1 mb-3 ml-2 text-slate-700 dark:text-[#E5E0D8]">{children}</ol>
  ),
  li: ({ children }: any) => <li className="leading-relaxed text-slate-700 dark:text-[#E5E0D8]">{children}</li>,
  code: ({ inline, children }: any) =>
    inline ? (
      <code className="bg-slate-100 dark:bg-cafe-surface-dark text-cafe-primary dark:text-cafe-secondary px-1.5 py-0.5 rounded text-[12px] font-mono">{children}</code>
    ) : (
      <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto text-[12px] font-mono my-3">
        <code>{children}</code>
      </pre>
    ),
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-3">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: any) => <thead className="bg-slate-100 dark:bg-cafe-surface-dark">{children}</thead>,
  th: ({ children }: any) => (
    <th className="border border-slate-200 dark:border-cafe-border-dark px-3 py-2 font-bold text-cafe-primary dark:text-white text-xs uppercase tracking-wide text-left">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="border border-slate-200 dark:border-cafe-border-dark px-3 py-2 text-slate-700 dark:text-[#E5E0D8]">{children}</td>
  ),
  tr: ({ children }: any) => <tr className="hover:bg-slate-50 dark:hover:bg-cafe-surface-dark transition-colors">{children}</tr>,
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 pl-4 border-cafe-primary-light italic text-slate-600 dark:text-[#D6CFCA] my-3">{children}</blockquote>
  ),
  a: ({ href, children }: any) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-cafe-primary-light dark:text-cafe-secondary underline hover:text-cafe-primary dark:hover:text-white transition-colors">
      {children}
    </a>
  ),
  hr: () => <hr className="border-slate-200 dark:border-cafe-border-dark my-4" />,
};

export default function SummaryResultsPage({ isAdmin }: { isAdmin?: boolean }) {

    const { documentId } = useParams();
    const navigate = useNavigate();
    const { isArabic } = useAppContext();

    const trans = {
        loadingDoc: isArabic ? "جاري تحميل المستند..." : "Loading Document...",
        pagesSynthesis: isArabic ? "صفحات • توليف بحثي" : "Pages • Research Synthesis",
        chat: isArabic ? "الدردشة" : "Chat",
        brief: isArabic ? "موجز" : "brief",
        detailed: isArabic ? "مفصل" : "detailed",
        technical: isArabic ? "تقني" : "technical",
        briefDesc: isArabic ? "النقاط الأساسية" : "Essential takeaways",
        detailedDesc: isArabic ? "تحليل متعمق" : "In-depth analysis",
        technicalDesc: isArabic ? "الدقة الأكاديمية" : "Academic rigor",
        synthesizing: isArabic ? "تجميع المعرفة" : "Synthesizing Knowledge",
        parsingDoc: isArabic ? "يقوم الذكاء الاصطناعي بتحليل المستند لإنشاء ملخص" : "Our AI is parsing the document to generate a",
        analysisInterrupted: isArabic ? "تمت مقاطعة التحليل" : "Analysis Interrupted",
        tryAgain: isArabic ? "حاول مرة أخرى" : "Try Again",
        generatedOn: isArabic ? "تم التوليد في" : "Generated on",
        noSummary: isArabic ? "لا يوجد ملخص متاح" : "No Summary Available",
        noSummaryDesc: isArabic ? "لم يتم إنشاء هذا المنظور بعد. دع الذكاء الاصطناعي يحلل المصدر لك." : "This {type} perspective hasn't been generated yet. Let our AI analyze the source for you.",
        generate: isArabic ? "توليد ملخص" : "Generate",
    };

    const [activeType, setActiveType] = useState<SummaryType>("brief");
    const [document, setDocument] = useState<DocumentData | null>(null);
    const [summary, setSummary] = useState<ISummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const fetchDocumentInfo = useCallback(async () => {
        try {
            const res = await api.get(`/documents/${documentId}`);
            if (res.data.success) {
                setDocument(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching document info");
        }
    }, [documentId]);


    const fetchSummary = useCallback(async (type: SummaryType) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`/summary/${documentId}?type=${type}`);
            if (res.data.success) {
                setSummary(res.data.summary);
            }
        } catch (err: any) {
            setSummary(null);
            if (err.response?.status !== 404) {
                setError("Failed to communicate with the research engine.");
            }
        } finally {
            setLoading(false);
        }
    }, [documentId]);


    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.post(`/summary/${documentId}`, { type: activeType });
            if (res.data.success) {
                setSummary(res.data.summary);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "AI Generation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocumentInfo();
        fetchSummary(activeType);
    }, [activeType, fetchDocumentInfo, fetchSummary]);

    const summaryTypes: { id: SummaryType; label: string; icon: any; desc: string }[] = [
        { id: "brief", label: trans.brief, icon: Zap, desc: trans.briefDesc },
        { id: "detailed", label: trans.detailed, icon: StickyNote, desc: trans.detailedDesc },
        { id: "technical", label: trans.technical, icon: Brain, desc: trans.technicalDesc },
    ];

    return (
        <div className="flex min-h-screen bg-cafe-surface dark:bg-cafe-surface-dark" dir={isArabic ? "rtl" : "ltr"}>
            <Sidebar currentScreen="summary" isAdmin={isAdmin} />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 sm:h-24 bg-white/80 dark:bg-cafe-surface-dark-alt/80 backdrop-blur-md border-b border-cafe-primary/5 dark:border-cafe-border-dark flex items-center px-4 sm:px-6 md:px-10 shrink-0 sticky top-0 z-10">
                    <div className="flex items-center gap-3 sm:gap-5">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-8 h-8 sm:w-10 sm:h-10 bg-cafe-primary/5 dark:bg-cafe-surface-dark text-cafe-primary dark:text-white rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-cafe-primary hover:text-white transition-all border border-cafe-primary/10 dark:border-cafe-border-dark shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <div className="h-8 sm:h-10 w-px bg-cafe-primary/10 dark:bg-cafe-border-dark hidden sm:block"></div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cafe-warning to-cafe-primary text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-base sm:text-xl font-display font-bold text-cafe-primary dark:text-white truncate">
                                {document?.title || trans.loadingDoc}
                            </h1>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-cafe-text-dark-muted uppercase tracking-widest mt-0.5 hidden sm:block">
                                {document?.page_count || 0} {trans.pagesSynthesis}
                            </p>
                        </div>
                    </div>
                    <div className="ms-auto">
                        <button
                            onClick={() => navigate('/chat')}
                            className="flex items-center gap-1.5 sm:gap-2 bg-cafe-primary text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold hover:bg-cafe-primary-dark transition-all shadow-lg shadow-cafe-primary/20"
                        >
                            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">{trans.chat}</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 pb-24 md:pb-10">
                    <div className="max-w-4xl mx-auto">

                        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
                            {summaryTypes.map((st) => (
                                <button
                                    key={st.id}
                                    onClick={() => setActiveType(st.id)}
                                    className={`relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 text-left transition-all group ${
                                        activeType === st.id
                                            ? "bg-white dark:bg-cafe-surface-dark-alt border-cafe-primary shadow-md shadow-cafe-primary/5 dark:shadow-black/20"
                                            : "bg-white/50 dark:bg-cafe-surface-dark-alt/50 border-transparent hover:border-cafe-primary/20"
                                    }`}
                                >
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 transition-colors ${
                                        activeType === st.id ? "bg-cafe-primary text-white shadow-lg shadow-cafe-primary/20" : "bg-cafe-secondary/50 dark:bg-cafe-border-dark text-cafe-primary dark:text-cafe-text-dark"
                                    }`}>
                                        <st.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <h3 className={`font-display font-bold text-xs sm:text-sm ${activeType === st.id ? "text-cafe-primary dark:text-white" : "text-slate-500 dark:text-cafe-text-dark-muted"}`}>
                                        {st.label}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 dark:text-cafe-text-dark-muted font-medium hidden sm:block">{st.desc}</p>
                                    {activeType === st.id && (
                                        <div className="absolute top-2 sm:top-3 end-2 sm:end-3">
                                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cafe-warning animate-pulse" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="bg-white dark:bg-cafe-surface-dark-alt rounded-2xl sm:rounded-[2.5rem] shadow-xl shadow-cafe-primary/5 dark:shadow-black/20 border border-cafe-secondary/60 dark:border-cafe-border-dark overflow-hidden min-h-[400px] sm:min-h-[500px] flex flex-col">
                            {loading ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-10 sm:p-20 text-center">
                                    <div className="relative">
                                        <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-cafe-primary animate-spin" />
                                        <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-cafe-primary-light absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <h2 className="mt-4 sm:mt-6 text-lg sm:text-xl font-display font-bold text-cafe-primary dark:text-white">{trans.synthesizing}</h2>
                                    <p className="text-slate-500 dark:text-cafe-text-dark mt-2 max-w-xs text-xs sm:text-sm">{trans.parsingDoc} {activeType}...</p>
                                </div>
                            ) : error ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-10 sm:p-20 text-center">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-4">
                                        <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8" />
                                    </div>
                                    <h2 className="text-base sm:text-lg font-display font-bold text-cafe-primary dark:text-white">{trans.analysisInterrupted}</h2>
                                    <p className="text-slate-500 dark:text-cafe-text-dark mt-2 mb-4 sm:mb-6 text-xs sm:text-sm">{error}</p>
                                    <button onClick={handleGenerate} className="bg-cafe-primary text-white px-4 sm:px-6 py-2 rounded-xl font-bold hover:bg-cafe-primary-dark transition-all text-xs sm:text-sm">{trans.tryAgain}</button>
                                </div>
                            ) : summary ? (
                                <div className="p-6 sm:p-10 md:p-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-cafe-secondary/60 dark:border-cafe-border-dark">
                                        <div className="px-2 sm:px-3 py-1 bg-cafe-warning/10 text-cafe-warning rounded-full text-[10px] font-bold uppercase tracking-widest">
                                            {activeType}
                                        </div>
                                        <span className="text-cafe-secondary/80 dark:text-cafe-text-dark-muted text-xs">•</span>
                                        <span className="text-slate-400 dark:text-cafe-text-dark-muted text-xs font-medium">{trans.generatedOn} {new Date(summary.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    <div className="max-w-none text-sm sm:text-base">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                            {summary.summary_content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center p-10 sm:p-20 text-center">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cafe-warning/10 text-cafe-warning rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 transform -rotate-6">
                                        <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-display font-bold text-cafe-primary dark:text-white">{trans.noSummary}</h2>
                                    <p className="text-slate-500 dark:text-cafe-text-dark mt-2 mb-6 sm:mb-8 max-w-sm text-xs sm:text-sm">
                                        {trans.noSummaryDesc.replace("{type}", activeType)}
                                    </p>
                                    <button
                                        onClick={handleGenerate}
                                        className="flex items-center gap-2 sm:gap-3 bg-cafe-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-cafe-primary-dark transition-all hover:scale-105 shadow-xl shadow-cafe-primary/20 text-xs sm:text-sm"
                                    >
                                        <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                                        {trans.generate} {activeType}
                                    </button>
                                </div>
                            )}
                        </div>


                    </div>
                </main>
            </div>
        </div>
    );
}