import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  ArrowLeft,
  Sparkles,
  Bot,
  MoreHorizontal,
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
} from "../features/upload/services/uploadService";
import api from "../services/api";
import ChatSidebar from "../features/chat/components/ChatSidebar";
import ChatMessageList from "../features/chat/components/ChatMessageList";
import ChatInput from "../features/chat/components/ChatInput";
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
    academicSession: isArabic ? "الجلسة الأكاديمية" : "Academic Session",
    referencePage: isArabic ? "المرجع: صفحة" : "Reference: Page",
    uploadingIndexing: isArabic ? "جاري رفع وفهرسة السجل الجديد..." : "Uploading and indexing new record...",
    academicArchive: isArabic ? "الأرشيف الأكاديمي" : "Academic Archive",
    indexNewRecord: isArabic ? "فهرسة سجل جديد" : "Index New Record",
    inputPlaceholderDoc: isArabic ? "صُغ استفسارك بخصوص المستند..." : "Formulate your inquiry regarding the document...",
    inputPlaceholderNoDoc: isArabic ? "يرجى رفع مستند أولاً لبدء المحادثة." : "Please upload a document first to start chatting.",
    autoAnalysisMsg: isArabic ? "تحليل آلي. يخضع للتدقيق الأكاديمي." : "Automated analysis. Subject to academic verification.",
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
  const [isFreeChat, setIsFreeChat] = useState(() => {
    return localStorage.getItem("isFreeChat") === "true";
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [headerRenameDocId, setHeaderRenameDocId] = useState<string | null>(
    null,
  );
  const [headerRenameTitle, setHeaderRenameTitle] = useState("");

  const [freeChatSessions, setFreeChatSessions] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("freeChatSessions") || "[]");
    } catch { return []; }
  });
  const [currentFreeChatId, setCurrentFreeChatId] = useState<string | null>(() => {
    return localStorage.getItem("currentFreeChatId");
  });

  useEffect(() => {
    localStorage.setItem("freeChatSessions", JSON.stringify(freeChatSessions));
  }, [freeChatSessions]);

  useEffect(() => {
    localStorage.setItem("isFreeChat", String(isFreeChat));
  }, [isFreeChat]);

  useEffect(() => {
    if (currentFreeChatId) {
      localStorage.setItem("currentFreeChatId", currentFreeChatId);
    } else {
      localStorage.removeItem("currentFreeChatId");
    }
  }, [currentFreeChatId]);

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
      if (res.data.length > 0 && !activeDocId && !isFreeChat) {
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
    if (isFreeChat && currentFreeChatId) {
      const session = freeChatSessions.find((s: any) => s.id === currentFreeChatId);
      if (session) {
        setInitialMessages(session.messages || [getFreeWelcomeMessage(isArabic)]);
      } else {
        setIsFreeChat(false);
        setCurrentFreeChatId(null);
      }
    }
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
      } else if (activeDocId) {
        fetchHistory(activeDocId);
      }
    } catch (err: any) {
      console.error("File upload failed", err);
      alert(t.failedUpload);
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
    <div className="flex min-h-screen bg-cafe-surface dark:bg-cafe-surface-dark">
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

      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white dark:bg-cafe-surface-dark-alt relative">
        <header className="h-16 sm:h-20 border-b border-slate-100 dark:border-cafe-border-dark flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-10 bg-white/80 dark:bg-cafe-surface-dark-alt/80 backdrop-blur-md gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-50 dark:hover:bg-cafe-surface-dark rounded-xl text-slate-500 dark:text-cafe-text-dark transition-colors shrink-0 border border-slate-100 dark:border-cafe-border-dark"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="hidden sm:flex w-8 h-8 sm:w-10 sm:h-10 bg-cafe-primary text-white rounded-lg sm:rounded-xl items-center justify-center shrink-0 shadow-lg shadow-cafe-primary/20">
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-display font-bold text-cafe-primary dark:text-white leading-tight flex items-center gap-2 truncate">
                  <span className="truncate">
                    {isFreeChat ? t.freeChat : t.researchAssistant}
                  </span>
                </h1>
                {isFreeChat ? (
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-cafe-text-dark-muted font-medium hidden sm:block">
                    {t.freeChatSubtitle}
                  </p>
                ) : (
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-cafe-text-dark-muted flex items-center gap-1 truncate font-medium">
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
                          className="text-cafe-primary-light text-[10px] sm:text-xs font-medium bg-accent-blue/10 border border-cafe-primary-light rounded px-1 sm:px-1.5 py-0.5 outline-none min-w-0 w-full"
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
                        className="text-cafe-primary-light truncate hover:bg-accent-blue/10 rounded px-1 -mx-1 transition-colors flex items-center gap-1"
                        title={t.clickToRename}
                      >
                        <span className="truncate">
                          {documents.find((d) => d._id === activeDocId)?.title ||
                            t.selectDoc}
                        </span>
                        <Pencil className="w-3 h-3 shrink-0 opacity-50 hidden sm:inline" />
                      </button>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={handleNewChat}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all ${
                isFreeChat
                  ? "bg-cafe-primary text-white shadow-sm"
                  : "text-slate-500 dark:text-cafe-text-dark hover:text-cafe-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-cafe-surface-dark border border-slate-200 dark:border-cafe-border-dark"
              }`}
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t.newChat}</span>
            </button>

            <button
              onClick={() => navigate("/upload")}
              className="p-1.5 sm:p-2 text-slate-400 dark:text-cafe-text-dark-muted hover:text-cafe-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-cafe-surface-dark rounded-lg sm:rounded-xl transition-colors border border-slate-200 dark:border-cafe-border-dark"
              title={t.uploadDocument}
            >
              <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <div className="hidden sm:flex bg-slate-50 dark:bg-cafe-surface-dark border border-slate-200 dark:border-cafe-border-dark rounded-xl p-1 gap-1">
              <button
                onClick={() => setProvider("gemini")}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 sm:gap-1.5 ${provider === "gemini" ? "bg-cafe-primary text-white shadow-sm" : "text-slate-500 hover:text-cafe-primary"}`}
              >
                <Sparkles className="w-3 h-3" />
                Gemini
              </button>
              <button
                onClick={() => setProvider("ollama")}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 sm:gap-1.5 ${provider === "ollama" ? "bg-cafe-primary text-white shadow-sm" : "text-slate-500 hover:text-cafe-primary"}`}
              >
                <Bot className="w-3 h-3" />
                Ollama
              </button>
            </div>

            <button className="hidden sm:block p-2 text-slate-400 dark:text-cafe-text-dark-muted hover:text-cafe-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-cafe-surface-dark rounded-xl transition-colors border border-transparent hover:border-slate-100 dark:hover:border-cafe-border-dark">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6 sm:gap-8 scroll-smooth">
          <div className="text-center my-4 sm:my-6">
            <span className="text-[10px] font-bold text-slate-400 dark:text-cafe-text-dark-muted uppercase tracking-[0.2em] bg-slate-50 dark:bg-cafe-surface-dark px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-slate-100 dark:border-cafe-border-dark">
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
          onToggleHistory={() => setIsHistoryOpen(true)}
          isFreeChat={isFreeChat}
        />
      </div>

      <FloatingActionButton activeDocId={activeDocId} />
    </div>
  );
}
