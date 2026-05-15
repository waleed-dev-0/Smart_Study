import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import {
    ArrowLeft, Brain, FileText, MessageSquare, Zap,
    ChevronRight, Sparkles, Loader2, AlertCircle,
    BookOpen, StickyNote
} from 'lucide-react';

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
    extracted_text:string;
}

interface ISummary {
    _id: string;
    document_id: string;
    summary_content: string;
    summary_type: "brief" | "detailed" | "technical";
    createdAt: string;
    updatedAt:string;
}

export default function SummaryResultsPage({ isAdmin }: { isAdmin?: boolean }) {

    const { documentId } = useParams();
    console.log(documentId);
    const navigate = useNavigate();

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
        { id: "brief", label: "brief", icon: Zap, desc: "Essential takeaways" },
        { id: "detailed", label: "detailed", icon: StickyNote, desc: "In-depth analysis" },
        { id: "technical", label: "technical", icon: Brain, desc: "Academic rigor" },
    ];

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar currentScreen="summary" isAdmin={isAdmin} />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="h-8 w-px bg-slate-200 mx-1"></div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-600" />
                                {document?.title || "Loading Document..."}
                            </h1>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-tighter">
                                {document?.page_count || 0} Pages • Research Synthesis
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/chat')}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                        >
                            <MessageSquare className="w-4 h-4" />
                            chat
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                    <div className="max-w-4xl mx-auto">


                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {summaryTypes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveType(t.id)}
                                    className={`relative p-4 rounded-2xl border-2 text-left transition-all group ${
                                        activeType === t.id
                                            ? "bg-white border-indigo-600 shadow-md"
                                            : "bg-white/50 border-transparent hover:border-slate-200"
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                                        activeType === t.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                                    }`}>
                                        <t.icon className="w-5 h-5" />
                                    </div>
                                    <h3 className={`font-bold text-sm ${activeType === t.id ? "text-slate-900" : "text-slate-500"}`}>
                                        {t.label}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-medium">{t.desc}</p>
                                    {activeType === t.id && (
                                        <div className="absolute top-3 right-3">
                                            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
                            {loading ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                                    <div className="relative">
                                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                                        <Brain className="w-6 h-6 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <h2 className="mt-6 text-xl font-bold text-slate-900">Synthesizing Knowledge</h2>
                                    <p className="text-slate-500 mt-2 max-w-xs">Our AI is parsing the document to generate a {activeType} summary...</p>
                                </div>
                            ) : error ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                                        <AlertCircle className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900">Analysis Interrupted</h2>
                                    <p className="text-slate-500 mt-2 mb-6">{error}</p>
                                    <button onClick={handleGenerate} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold">Try Again</button>
                                </div>
                            ) : summary ? (
                                <div className="p-10 md:p-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="flex items-center gap-3 mb-8 pb-8 border-b border-slate-100">
                                        <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                                            {activeType} Model 2.0
                                        </div>
                                        <span className="text-slate-300 text-xs">•</span>
                                        <span className="text-slate-400 text-xs font-medium">Generated on {new Date(summary.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    <div className="prose prose-slate max-w-none">
                                        <p className="text-slate-700 leading-[1.8] text-lg font-serif whitespace-pre-wrap">
                                            {summary.summary_content}
                                        </p>
                                    </div>

                                    <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <BookOpen className="w-5 h-5 text-slate-400" />
                                            <p className="text-sm font-medium text-slate-600">Was this summary helpful for your research?</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50">Yes</button>
                                            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50">No</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                                    <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 transform -rotate-6">
                                        <Sparkles className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">No Summary Available</h2>
                                    <p className="text-slate-500 mt-2 mb-8 max-w-sm">
                                        This {activeType} perspective hasn't been generated yet. Let our AI analyze the source for you.
                                    </p>
                                    <button
                                        onClick={handleGenerate}
                                        className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all hover:scale-105 shadow-xl shadow-indigo-100"
                                    >
                                        <Zap className="w-5 h-5" />
                                        Generate {activeType} Summary
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Bottom Suggestions */}
                        <div className="mt-8 flex justify-center gap-4">
                            <button
                                onClick={() => navigate('/question-bank')}
                                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors"
                            >
                                Test Mastery <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}