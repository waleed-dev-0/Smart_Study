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
} from "lucide-react";

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

  const messages = [
    {
      id: 1,
      role: "ai",
      text: "Welcome to the Research Portal. I have indexed 'Introduction to Machine Learning.pdf'. How may I assist your inquiry today?",
      timestamp: "10:00 AM",
    },
    {
      id: 2,
      role: "user",
      text: "Can you explain the difference between supervised and unsupervised learning in simple terms?",
      timestamp: "10:02 AM",
    },
    {
      id: 3,
      role: "ai",
      text: "In an academic context, **supervised learning** is analogous to tutored instruction. The model is provided with a 'ground truth' (labeled data) and optimizes its parameters by minimizing the error relative to these labels.\n\nConversely, **unsupervised learning** involves autonomous pattern recognition. The system analyzes the inherent structure of the dataset to identify latent clusters or dimensions without external guidance.",
      timestamp: "10:03 AM",
      citations: [
        { page: 12, text: "Supervised learning relies on labeled datasets..." },
        {
          page: 15,
          text: "Unsupervised algorithms discover hidden structures...",
        },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-academic-paper">
      <Sidebar currentScreen="chat" isAdmin={isAdmin} />

      {/* Mobile History Backdrop */}
      {isHistoryOpen && (
        <div
          className="fixed inset-0 bg-academic-navy/20 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}

      {/* Secondary Sidebar for Documents */}
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
          <button className="w-full text-left p-4 rounded-2xl bg-slate-50 border border-academic-blue/20 shadow-sm flex items-start gap-3 group">
            <FileText className="w-5 h-5 text-academic-blue shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-academic-navy line-clamp-2 leading-tight mb-1 font-serif">
                Intro to ML.pdf
              </p>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                Active Analysis
              </p>
            </div>
          </button>

          <button className="w-full text-left p-4 rounded-2xl bg-transparent hover:bg-slate-50 border border-transparent transition-all flex items-start gap-3 group">
            <FileText className="w-5 h-5 text-slate-400 shrink-0 mt-0.5 group-hover:text-academic-navy" />
            <div>
              <p className="text-sm font-medium text-slate-600 line-clamp-2 leading-tight mb-1">
                Advanced Calculus.pdf
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Indexed 2d ago
              </p>
            </div>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white relative">
        {/* Top Header */}
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
                    Introduction to Machine Learning.pdf
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
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

        {/* Chat Area */}
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
              {/* Avatar */}
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

              {/* Message Content */}
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

                {/* Citations */}
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
          <div className="h-20"></div> {/* Bottom padding */}
        </main>

        {/* Input Area */}
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
                placeholder="Formulate your inquiry regarding the document..."
                className="w-full max-h-32 min-h-[48px] bg-transparent border-none outline-none resize-none py-3 text-sm text-slate-700 placeholder:text-slate-400 font-medium"
                rows={1}
              />

              <button className="p-3.5 bg-academic-navy text-white hover:bg-academic-blue rounded-xl transition-all shrink-0 shadow-lg shadow-academic-navy/20 active:scale-95">
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center mt-4">
              Automated analysis. Subject to academic verification.
            </p>
          </div>
        </div>
      </div>

      {/* Tertiary Sidebar for Evaluations */}
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
