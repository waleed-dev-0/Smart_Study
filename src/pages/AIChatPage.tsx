import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  ArrowLeft,
  Sparkles,
  Bot,
  MoreHorizontal,
  BookOpen,
  Search,
  Copy,
  Pencil,
  Check,
  X,
  Plus,
  Upload,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useChat, getFreeWelcomeMessage } from "../features/chat/hooks/useChat";
import {
  fetchDocuments,
  uploadFile,
  UploadError,
} from "../features/upload/services/uploadService";
import api from "../services/api";
import ChatSidebar from "../features/chat/components/ChatSidebar";
import ChatMessageList from "../features/chat/components/ChatMessageList";
import ChatInput from "../features/chat/components/ChatInput";
import QuizPanel from "../features/chat/components/QuizPanel";
import FloatingActionButton from "../components/FloatingActionButton";

export default function AIChatPage({ isAdmin }: { isAdmin?: boolean }) {
  const navigate = useNavigate();
  const { isArabic } = useAppContext();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    isFetchingHistory,
    loadingStatus,
    streamingText,
    sendMessage,
    sendFreeMessage,
    fetchHistory,
    clearMessages,
    setInitialMessages,
  } = useChat(isArabic);

  const t = {
    chatHistory: isArabic ? "سجل المحادثة" : "Chat history",
    activeAnalysis: isArabic ? "تحليل نشط" : "Active Analysis",
    indexed: isArabic ? "مفهرس" : "Indexed",
    noDocs: isArabic ? "لم تتم فهرسة مستندات بعد." : "No documents indexed yet.",
    uploadNow: isArabic ? "ارفع الآن" : "Upload Now",
    researchAssistant: isArabic ? "مساعد البحث" : "Research Assistant",
    analysis: isArabic ? "التحليل:" : "Analysis:",
    selectDoc: isArabic ? "اختر مستنداً" : "Select a document",
    evaluations: isArabic ? "التقييمات" : "Evaluations",
    academicSession: isArabic ? "الجلسة الأكاديمية" : "Academic Session",
    scholar: isArabic ? "الطالب" : "Scholar",
    referencePage: isArabic ? "المرجع: صفحة" : "Reference: Page",
    uploadingIndexing: isArabic ? "جاري رفع وفهرسة السجل الجديد..." : "Uploading and indexing new record...",
    academicArchive: isArabic ? "الأرشيف الأكاديمي" : "Academic Archive",
    indexNewRecord: isArabic ? "فهرسة سجل جديد" : "Index New Record",
    inputPlaceholderDoc: isArabic ? "صُغ استفسارك بخصوص المستند..." : "Formulate your inquiry regarding the document...",
    inputPlaceholderNoDoc: isArabic ? "يرجى رفع مستند أولاً لبدء المحادثة." : "Please upload a document first to start chatting.",
    autoAnalysisMsg: isArabic ? "تحليل آلي. يخضع للتدقيق الأكاديمي." : "Automated analysis. Subject to academic verification.",
    evaluationsTitle: isArabic ? "التقييمات الأكاديمية" : "Academic Evaluations",
    reviewResults: isArabic ? "مراجعة النتائج" : "Review Results",
    freeChat: isArabic ? "المحادثة الحرة" : "Free Chat",
    freeChatSubtitle: isArabic ? "اسألني أي شيء، أو ارفع مستنداً لتحليله" : "Ask me anything, or upload a document to analyze",
    newChat: isArabic ? "محادثة جديدة" : "New Chat",
    uploadDocument: isArabic ? "رفع مستند" : "Upload document",
    docAlreadyIndexed: isArabic ? "المستند موجود مسبقاً" : "Document Already Indexed",
    duplicateMsg: isArabic ? "هذا الملف موجود بالفعل في أرشيفك. هل تريد رفع نسخة مكررة؟" : "This file already exists in your archive. Upload a duplicate copy anyway?",
    cancel: isArabic ? "إلغاء" : "Cancel",
    uploadAnyway: isArabic ? "رفع على أي حال" : "Upload Anyway",
    clickToRename: isArabic ? "انقر لإعادة التسمية" : "Click to rename",
    failedDelete: isArabic ? "فشل في حذف المستند" : "Failed to delete document",
    failedUpload: isArabic ? "فشل رفع المستند. يرجى التأكد من أنه PDF صالح." : "Failed to upload document. Please ensure it is a valid PDF.",
    freeChatSession: isArabic ? "محادثة حرة" : "Free Chat",
    failedUploadGeneric: isArabic ? "فشل رفع المستند." : "Failed to upload document.",
    failedRename: isArabic ? "فشل إعادة التسمية" : "Failed to rename",
  };

  const [provider, setProvider] = useState<"gemini" | "ollama">("gemini");
  const [documents, setDocuments] = useState<any[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(
    localStorage.getItem("activeDocumentId"),
  );
  const [isFreeChat, setIsFreeChat] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isQuizzesOpen, setIsQuizzesOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [duplicateFile, setDuplicateFile] = useState<File | null>(null);
  const [headerRenameDocId, setHeaderRenameDocId] = useState<string | null>(
    null,
  );
  const [headerRenameTitle, setHeaderRenameTitle] = useState("");

  const [freeChatSessions, setFreeChatSessions] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("freeChatSessions") || "[]");
    } catch { return []; }
  });
  const [currentFreeChatId, setCurrentFreeChatId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("freeChatSessions", JSON.stringify(freeChatSessions));
  }, [freeChatSessions]);

  useEffect(() => {
    const docId = new URLSearchParams(location.search).get("docId");
    if (docId) {
      setActiveDocId(docId);
      localStorage.setItem("activeDocumentId", docId);
    }
  }, [location.search]);

  const loadDocs = async () => {
    try {
      const res = await fetchDocuments();
      setDocuments(res.data);
      if (res.data.length > 0 && !activeDocId) {
        setActiveDocId(res.data[0]._id);
        localStorage.setItem("activeDocumentId", res.data[0]._id);
      }
    } catch (err) {
      console.error("Failed to load documents", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isUploading]);

  useEffect(() => {
    loadDocs();
  }, []);

  useEffect(() => {
    if (activeDocId) {
      clearMessages();
      fetchHistory(activeDocId);
    }
  }, [activeDocId]);

  const handleSend = (input: string) => {
    if (isFreeChat) {
      sendFreeMessage(input, provider);
    } else {
      sendMessage(input, activeDocId!, provider);
    }
  };

  const handleNewChat = () => {
    const id = `free-${Date.now()}`;
    setCurrentFreeChatId(id);
    setInitialMessages([getFreeWelcomeMessage(isArabic)]);
    setActiveDocId(null);
    localStorage.removeItem("activeDocumentId");
    setIsFreeChat(true);
  };

  useEffect(() => {
    if (isFreeChat && currentFreeChatId && messages.length > 1) {
      setFreeChatSessions((prev: any[]) => {
        const exists = prev.some((s: any) => s.id === currentFreeChatId);
        if (!exists) {
          return [
            {
              id: currentFreeChatId,
              title: `${t.freeChatSession} ${new Date().toLocaleDateString(isArabic ? "ar-EG" : "en-US")}`,
              messages,
              createdAt: new Date().toISOString(),
            },
            ...prev,
          ];
        }
        return prev.map((s: any) =>
          s.id === currentFreeChatId ? { ...s, messages } : s,
        );
      });
    }
  }, [messages, isFreeChat, currentFreeChatId]);

  const handleSelectFreeChat = (sessionId: string) => {
    const session = freeChatSessions.find((s: any) => s.id === sessionId);
    if (session) {
      setCurrentFreeChatId(sessionId);
      setInitialMessages(session.messages || [getFreeWelcomeMessage(isArabic)]);
      setActiveDocId(null);
      localStorage.removeItem("activeDocumentId");
      setIsFreeChat(true);
    }
    setIsHistoryOpen(false);
  };

  const handleDeleteFreeChat = (sessionId: string) => {
    setFreeChatSessions((prev: any[]) => prev.filter((s: any) => s.id !== sessionId));
    if (currentFreeChatId === sessionId) {
      setCurrentFreeChatId(null);
      clearMessages();
      setIsFreeChat(false);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      await api.delete(`/documents/${docId}`);
      await loadDocs();
      if (activeDocId === docId) {
        setActiveDocId(null);
        localStorage.removeItem("activeDocumentId");
        clearMessages();
      }
    } catch (err: any) {
      console.error("Delete failed", err);
      alert(err.response?.data?.message || err.message || t.failedDelete);
    }
  };

  const handleRenameFreeChat = (sessionId: string, title: string) => {
    setFreeChatSessions((prev: any[]) =>
      prev.map((s: any) =>
        s.id === sessionId ? { ...s, title } : s,
      ),
    );
  };

  const handleDocumentUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const res = await uploadFile(file, activeDocId || undefined);
      await loadDocs();
      if (isFreeChat && res?.data?.documentId) {
        setActiveDocId(res.data.documentId);
        localStorage.setItem("activeDocumentId", res.data.documentId);
        setIsFreeChat(false);
      }
    } catch (err: any) {
      if (err instanceof UploadError && err.status === 409) {
        setDuplicateFile(file);
      } else {
        console.error("File upload failed", err);
        alert(t.failedUpload);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleForceUpload = async () => {
    if (!duplicateFile) return;
    setIsUploading(true);
    setDuplicateFile(null);
    try {
      await uploadFile(duplicateFile, activeDocId || undefined, true);
      await loadDocs();
    } catch (err) {
      console.error("Force upload failed", err);
      alert(t.failedUploadGeneric);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectDocument = (id: string) => {
    if (activeDocId !== id || isFreeChat) {
      setActiveDocId(id);
      localStorage.setItem("activeDocumentId", id);
      setIsFreeChat(false);
      clearMessages();
    }
    setIsHistoryOpen(false);
  };

  const handleHeaderRenameStart = () => {
    const doc = documents.find((d) => d._id === activeDocId);
    if (doc) {
      setHeaderRenameDocId(doc._id);
      setHeaderRenameTitle(doc.title);
    }
  };

  const handleHeaderRenameSave = async () => {
    if (!headerRenameTitle.trim() || !headerRenameDocId) return;
    try {
      const res = await api.put(`/chat/session/${headerRenameDocId}`, {
        title: headerRenameTitle.trim(),
      });
      if (res.data?.success) {
        await loadDocs();
      }
    } catch (err: any) {
      console.error("Header rename failed", err);
      alert(err.response?.data?.message || err.message || t.failedRename);
    }
    setHeaderRenameDocId(null);
  };

  return (
    <div className="flex min-h-screen bg-academic-paper">
      <Sidebar currentScreen="chat" isAdmin={isAdmin} />

      <ChatSidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        documents={documents}
        activeDocId={activeDocId}
        activeFreeChatId={currentFreeChatId}
        onSelectDocument={handleSelectDocument}
        onSelectFreeChat={handleSelectFreeChat}
        onDeleteDocument={handleDeleteDocument}
        onDeleteFreeChat={handleDeleteFreeChat}
        onRenameFreeChat={handleRenameFreeChat}
        onDocsRefreshed={loadDocs}
        freeChatSessions={freeChatSessions}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white relative">
        <header className="h-20 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10 bg-white/80 backdrop-blur-md gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors shrink-0 border border-slate-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 min-w-0">
              <div className="hidden sm:flex w-10 h-10 bg-academic-navy text-white rounded-xl items-center justify-center shrink-0 shadow-lg shadow-academic-navy/20">
                <Search className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-serif font-bold text-academic-navy leading-tight flex items-center gap-2 truncate">
                  <span className="truncate">
                    {isFreeChat ? t.freeChat : t.researchAssistant}
                  </span>
                </h1>
                {isFreeChat ? (
                  <p className="text-xs text-slate-500 font-medium">
                    {t.freeChatSubtitle}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 flex items-center gap-1 truncate font-medium">
                    {t.analysis}{" "}
                    {headerRenameDocId === activeDocId && activeDocId ? (
                      <span className="flex items-center gap-1 min-w-0">
                        <input
                          autoFocus
                          value={headerRenameTitle}
                          onChange={(e) => setHeaderRenameTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleHeaderRenameSave();
                            if (e.key === "Escape") setHeaderRenameDocId(null);
                          }}
                          className="text-academic-blue text-xs font-medium bg-accent-blue/10 border border-academic-blue rounded px-1.5 py-0.5 outline-none min-w-0 w-full"
                        />
                        <button
                          onClick={handleHeaderRenameSave}
                          className="p-0.5 text-emerald-500 hover:text-emerald-600 shrink-0"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setHeaderRenameDocId(null)}
                          className="p-0.5 text-slate-400 hover:text-slate-600 shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={handleHeaderRenameStart}
                        className="text-academic-blue truncate hover:bg-accent-blue/10 rounded px-1 -mx-1 transition-colors flex items-center gap-1"
                        title={t.clickToRename}
                      >
                        <span className="truncate">
                          {documents.find((d) => d._id === activeDocId)?.title ||
                            t.selectDoc}
                        </span>
                        <Pencil className="w-3 h-3 shrink-0 opacity-50" />
                      </button>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleNewChat}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isFreeChat
                  ? "bg-academic-navy text-white shadow-sm"
                  : "text-slate-500 hover:text-academic-navy hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <Plus className="w-4 h-4" />
              {t.newChat}
            </button>

            <button
              onClick={() => navigate("/upload")}
              className="p-2 text-slate-400 hover:text-academic-navy hover:bg-slate-50 rounded-xl transition-colors border border-slate-200"
              title={t.uploadDocument}
            >
              <Upload className="w-4 h-4" />
            </button>

            <div className="hidden sm:flex bg-slate-50 border border-slate-200 rounded-xl p-1 gap-1">
              <button
                onClick={() => setProvider("gemini")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${provider === "gemini" ? "bg-academic-navy text-white shadow-sm" : "text-slate-500 hover:text-academic-navy"}`}
              >
                <Sparkles className="w-3 h-3" />
                Gemini
              </button>
              <button
                onClick={() => setProvider("ollama")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${provider === "ollama" ? "bg-academic-navy text-white shadow-sm" : "text-slate-500 hover:text-academic-navy"}`}
              >
                <Bot className="w-3 h-3" />
                Ollama
              </button>
            </div>

            <button
              onClick={() => setIsQuizzesOpen(true)}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-academic-navy transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">{t.evaluations}</span>
            </button>

            <button className="p-2 text-slate-400 hover:text-academic-navy hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 scroll-smooth">
          <div className="text-center my-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
              {t.academicSession} •{" "}
              {new Date().toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <ChatMessageList
            messages={messages}
            streamingText={streamingText}
            isLoading={isLoading}
            isUploading={isUploading}
            loadingStatus={loadingStatus}
            isFetchingHistory={isFetchingHistory}
          />

          <div ref={messagesEndRef} className="h-4" />
        </main>

        <ChatInput
          activeDocId={activeDocId}
          isLoading={isLoading}
          onSend={handleSend}
          onDocumentUpload={handleDocumentUpload}
          onLoadDocs={loadDocs}
          onToggleHistory={() => setIsHistoryOpen(true)}
          isFreeChat={isFreeChat}
        />
      </div>

      {duplicateFile && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-md w-full animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-amber-100">
                <Copy className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-serif font-bold text-amber-900 mb-2">
                {t.docAlreadyIndexed}
              </h3>
              <p className="text-sm text-amber-700 mb-1">
                <strong className="text-amber-900">{duplicateFile.name}</strong>
              </p>
              <p className="text-xs text-amber-600/80 mb-6">
                {t.duplicateMsg}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDuplicateFile(null)}
                  className="flex-1 bg-white border border-amber-200 text-amber-700 px-6 py-3 rounded-xl text-sm font-bold hover:bg-amber-50 transition-all"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleForceUpload}
                  className="flex-1 bg-amber-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-amber-700 transition-all shadow-md shadow-amber-600/20"
                >
                  {t.uploadAnyway}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <QuizPanel isOpen={isQuizzesOpen} onClose={() => setIsQuizzesOpen(false)} />

      <FloatingActionButton activeDocId={activeDocId} />
    </div>
  );
}
