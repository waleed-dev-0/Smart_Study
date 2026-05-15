import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  ArrowLeft,
  MessageSquare,
  Sparkles,
  Bot,
  MoreHorizontal,
  BookOpen,
  Search,
} from "lucide-react";
import { useChat } from "../features/chat/hooks/useChat";
import {
  fetchDocuments,
  uploadFile,
} from "../features/upload/services/uploadService";
import ChatSidebar from "../features/chat/components/ChatSidebar";
import ChatMessageList from "../features/chat/components/ChatMessageList";
import ChatInput from "../features/chat/components/ChatInput";
import QuizPanel from "../features/chat/components/QuizPanel";
import FloatingActionButton from "../components/FloatingActionButton";

export default function AIChatPage({ isAdmin }: { isAdmin?: boolean }) {
  const navigate = useNavigate();
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
    } catch (err) {
      console.error("File upload failed", err);
      alert("Failed to upload document. Please ensure it is a valid PDF.");
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

  return (
    <div className="flex min-h-screen bg-academic-paper">
      <Sidebar currentScreen="chat" isAdmin={isAdmin} />

      <ChatSidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        documents={documents}
        activeDocId={activeDocId}
        onSelectDocument={handleSelectDocument}
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
                  <span className="text-academic-blue truncate">
                    {documents.find((d) => d._id === activeDocId)?.title ||
                      "Select a document"}
                  </span>
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

      <FloatingActionButton activeDocId={activeDocId} />
    </div>
  );
}
