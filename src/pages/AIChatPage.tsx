import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  ArrowLeft,
  MessageSquare,
  Send,
  Paperclip,
  FileText,
  GraduationCap,
  ChevronDown,
  MoreHorizontal,
  User,
  Upload,
  Database,
  Menu,
  X,
  Search,
  BookOpen,
  Sparkles,
  Bot
} from "lucide-react";
import { useChat } from "../features/chat/hooks/useChat";
import { fetchDocuments } from "../features/upload/services/uploadService";

export default function AIChatPage({
  isAdmin,
}: {
  isAdmin?: boolean;
}) {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isQuizzesOpen, setIsQuizzesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, sendMessage, setMessages } = useChat();
  const [provider, setProvider] = useState<'gemini' | 'openrouter'>('gemini');
  const [documents, setDocuments] = useState<any[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(localStorage.getItem('activeDocumentId'));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadDocs = async () => {
      try {
        const res = await fetchDocuments();
        setDocuments(res.data);
        if (res.data.length > 0 && !activeDocId) {
          setActiveDocId(res.data[0]._id);
          localStorage.setItem('activeDocumentId', res.data[0]._id);
        }
      } catch (err) {
        console.error("Failed to load documents", err);
      }
    };
    loadDocs();
  }, []);

  useEffect(() => {
    if (activeDocId && messages.length === 0) {
      setMessages([{
        id: 'initial',
        role: 'ai',
        text: "Welcome to the Research Portal. I have indexed your document. How may I assist your inquiry today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
  }, [activeDocId]);

  const handleSend = () => {
    if (!input.trim() || !activeDocId) return;
    sendMessage(input, activeDocId, provider);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex min-h-screen bg-academic-paper">
      <Sidebar currentScreen="chat" isAdmin={isAdmin} />

      {isHistoryOpen && (
        <div
          className="fixed inset-0 bg-academic-navy/20 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-[70] w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:flex flex-col h-screen lg:w-64 lg:sticky lg:top-0 ${isHistoryOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-bold text-academic-navy uppercase tracking-widest">
            Chat history
          </h2>
          <button
            onClick={() => setIsHistoryOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-academic-navy hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {documents.map((doc) => (
            <button
              key={doc._id}
              onClick={() => {
                setActiveDocId(doc._id);
                localStorage.setItem('activeDocumentId', doc._id);
                setMessages([]);
              }}
              className={`w-full text-left p-4 rounded-2xl transition-all flex items-start gap-3 group ${
                activeDocId === doc._id
                  ? "bg-slate-50 border border-academic-blue/20 shadow-sm"
                  : "bg-transparent hover:bg-slate-50 border border-transparent"
              }`}
            >
              <FileText className={`w-5 h-5 shrink-0 mt-0.5 ${activeDocId === doc._id ? "text-academic-blue" : "text-slate-400 group-hover:text-academic-navy"}`} />
              <div className="min-w-0">
                <p className={`text-sm line-clamp-2 leading-tight mb-1 font-serif ${activeDocId === doc._id ? "font-bold text-academic-navy" : "font-medium text-slate-600"}`}>
                  {doc.title}
                </p>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${activeDocId === doc._id ? "text-emerald-600" : "text-slate-400"}`}>
                  {activeDocId === doc._id ? "Active Analysis" : "Indexed"}
                </p>
              </div>
            </button>
          ))}
          {documents.length === 0 && (
            <div className="text-center py-10">
              <p className="text-xs text-slate-400 font-medium">No documents indexed yet.</p>
              <button 
                onClick={() => navigate('/upload')}
                className="mt-4 text-[10px] font-bold text-academic-blue uppercase tracking-widest hover:underline"
              >
                Upload Now
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white relative">
        <header className="h-20 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10 bg-white/80 backdrop-blur-md gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors shrink-0 border border-slate-100"
            >
              <Menu className="w-5 h-5" />
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
                    {documents.find(d => d._id === activeDocId)?.title || "Select a document"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex bg-slate-50 border border-slate-200 rounded-xl p-1 gap-1">
              <button
                onClick={() => setProvider('gemini')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${provider === 'gemini' ? 'bg-academic-navy text-white shadow-sm' : 'text-slate-500 hover:text-academic-navy'}`}
              >
                <Sparkles className="w-3 h-3" />
                Gemini
              </button>
              <button
                onClick={() => setProvider('openrouter')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${provider === 'openrouter' ? 'bg-academic-navy text-white shadow-sm' : 'text-slate-500 hover:text-academic-navy'}`}
              >
                <Bot className="w-3 h-3" />
                OpenRouter
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
              Academic Session • March 2024
            </span>
          </div>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-6 max-w-4xl ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-sm ${
                  msg.role === "ai"
                    ? "bg-academic-navy text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {msg.role === "ai" ? (
                  <GraduationCap className="w-6 h-6" />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>

              <div
                className={`flex flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"} max-w-[85%]`}
              >
                <div className="flex items-center gap-3 px-1">
                  <span className="text-xs font-bold text-academic-navy uppercase tracking-wider">
                    {msg.role === "ai" ? "Research Assistant" : "Scholar"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {msg.timestamp}
                  </span>
                </div>

                <div
                  className={`p-5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-academic-blue text-white rounded-tr-none shadow-lg shadow-academic-blue/10"
                      : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.text.split("\n\n").map((paragraph, i) => (
                    <p key={i} className={i > 0 ? "mt-4" : ""}>
                      {paragraph.split("**").map((part, j) =>
                        j % 2 === 1 ? (
                          <strong
                            key={j}
                            className="font-bold underline decoration-academic-gold/30"
                          >
                            {part}
                          </strong>
                        ) : (
                          part
                        ),
                      )}
                    </p>
                  ))}
                </div>

                {msg.citations && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.citations.map((cite, i) => (
                      <button
                        key={i}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-academic-navy transition-all uppercase tracking-wide group"
                      >
                        <FileText className="w-3.5 h-3.5 text-academic-blue" />
                        Reference: Page {cite.page}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="h-20"></div>
        </main>

        <div className="p-6 bg-white border-t border-slate-100 shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-3 focus-within:border-academic-blue focus-within:ring-4 focus-within:ring-academic-blue/5 transition-all shadow-inner">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`p-3 rounded-xl transition-colors shrink-0 ${isDropdownOpen ? "bg-academic-navy text-white" : "text-slate-400 hover:text-academic-navy hover:bg-slate-200"}`}
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute bottom-full left-0 mb-4 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 p-2 animate-in fade-in slide-in-from-bottom-2">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/library');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left"
                    >
                      <Database className="w-4 h-4 text-academic-blue" />
                      Academic Archive
                    </button>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/upload');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left"
                    >
                      <Upload className="w-4 h-4 text-academic-gold" />
                      Index New Record
                    </button>
                  </div>
                )}
              </div>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={activeDocId ? "Formulate your inquiry regarding the document..." : "Please upload a document first to start chatting."}
                disabled={!activeDocId || isLoading}
                className="w-full max-h-32 min-h-[48px] bg-transparent border-none outline-none resize-none py-3 text-sm text-slate-700 placeholder:text-slate-400 font-medium"
                rows={1}
              />

              <button 
                onClick={handleSend}
                disabled={!input.trim() || !activeDocId || isLoading}
                className="p-3.5 bg-academic-navy text-white hover:bg-academic-blue rounded-xl transition-all shrink-0 shadow-lg shadow-academic-navy/20 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center mt-4">
              Automated analysis. Subject to academic verification.
            </p>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-y-0 right-0 z-[70] w-80 bg-white border-l border-slate-200 transform transition-transform duration-300 flex flex-col h-screen shadow-2xl ${isQuizzesOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-bold text-academic-navy uppercase tracking-widest">
            Academic Evaluations
          </h2>
          <button
            onClick={() => setIsQuizzesOpen(false)}
            className="p-1.5 text-slate-400 hover:text-academic-navy hover:bg-slate-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0">
                <Search className="w-5 h-5 text-academic-blue" />
              </div>
              <div>
                <p className="text-sm font-bold text-academic-navy font-serif">
                  ML Fundamentals
                </p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">
                  10 Modules • Grade: A (85%)
                </p>
              </div>
            </div>
            <button className="w-full py-2 bg-academic-navy text-white rounded-lg text-xs font-bold hover:bg-academic-blue transition-colors">
              Review Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
