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
} from "lucide-react";
import { useChat } from "../features/chat/hooks/useChat";
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
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    isFetchingHistory,
    loadingStatus,
    streamingText,
    sendMessage,
    fetchHistory,
    clearMessages,
  } = useChat();

  const [provider, setProvider] = useState<"gemini" | "ollama">("gemini");
  const [documents, setDocuments] = useState<any[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(
    localStorage.getItem("activeDocumentId"),
  );
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isQuizzesOpen, setIsQuizzesOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [duplicateFile, setDuplicateFile] = useState<File | null>(null);
  const [headerRenameDocId, setHeaderRenameDocId] = useState<string | null>(null);
  const [headerRenameTitle, setHeaderRenameTitle] = useState("");

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
    sendMessage(input, activeDocId!, provider);
  };

  const handleDocumentUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await uploadFile(file, activeDocId || undefined);
      await loadDocs();
    } catch (err: any) {
      if (err instanceof UploadError && err.status === 409) {
        setDuplicateFile(file);
      } else {
        console.error("File upload failed", err);
        alert("Failed to upload document. Please ensure it is a valid PDF.");
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
      alert("Failed to upload document.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectDocument = (id: string) => {
    if (activeDocId !== id) {
      setActiveDocId(id);
      localStorage.setItem("activeDocumentId", id);
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
      const res = await api.put(`/chat/session/${headerRenameDocId}`, { title: headerRenameTitle.trim() });
      if (res.data?.success) {
        await loadDocs();
      }
    } catch (err: any) {
      console.error("Header rename failed", err);
      alert(err.response?.data?.message || err.message || "Failed to rename");
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
        onSelectDocument={handleSelectDocument}
        onDocsRefreshed={loadDocs}
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
                  <span className="truncate">Research Assistant</span>
                </h1>
                <p className="text-xs text-slate-500 flex items-center gap-1 truncate font-medium">
                  Analysis:{" "}
                  {headerRenameDocId === activeDocId ? (
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
                      title="Click to rename"
                    >
                      <span className="truncate">
                        {documents.find((d) => d._id === activeDocId)?.title ||
                          "Select a document"}
                      </span>
                      <Pencil className="w-3 h-3 shrink-0 opacity-50" />
                    </button>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
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
              <span className="hidden md:inline">Evaluations</span>
            </button>
            <button className="p-2 text-slate-400 hover:text-academic-navy hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 scroll-smooth">
          <div className="text-center my-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
              Academic Session •{" "}
              {new Date().toLocaleDateString("en-US", {
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
        />
      </div>

      <QuizPanel
        isOpen={isQuizzesOpen}
        onClose={() => setIsQuizzesOpen(false)}
      />

      {duplicateFile && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-md w-full animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-amber-100">
                <Copy className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-serif font-bold text-amber-900 mb-2">
                Document Already Indexed
              </h3>
              <p className="text-sm text-amber-700 mb-1">
                <strong className="text-amber-900">{duplicateFile.name}</strong>
              </p>
              <p className="text-xs text-amber-600/80 mb-6">
                This file already exists in your archive. Upload a duplicate copy anyway?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDuplicateFile(null)}
                  className="flex-1 bg-white border border-amber-200 text-amber-700 px-6 py-3 rounded-xl text-sm font-bold hover:bg-amber-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleForceUpload}
                  className="flex-1 bg-amber-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-amber-700 transition-all shadow-md shadow-amber-600/20"
                >
                  Upload Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <FloatingActionButton activeDocId={activeDocId} />
    </div>
  );
}
