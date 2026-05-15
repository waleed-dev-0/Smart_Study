import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paperclip,
  Send,
  Database,
  Upload,
  Menu,
} from "lucide-react";
import { uploadFile } from "../../../features/upload/services/uploadService";
import { fetchDocuments } from "../../../features/upload/services/uploadService";

interface ChatInputProps {
  activeDocId: string | null;
  isLoading: boolean;
  onSend: (input: string) => void;
  onDocumentUpload: (file: File) => Promise<void>;
  onLoadDocs: () => Promise<void>;
  onToggleHistory: () => void;
  isFreeChat?: boolean;
}

export default function ChatInput({
  activeDocId,
  isLoading,
  onSend,
  onDocumentUpload,
  onLoadDocs,
  onToggleHistory,
  isFreeChat,
}: ChatInputProps) {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim() || (!activeDocId && !isFreeChat)) return;
    onSend(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsDropdownOpen(false);
    await onDocumentUpload(file);
    await onLoadDocs();

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
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
                    navigate("/library");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left"
                >
                  <Database className="w-4 h-4 text-academic-blue" />
                  Academic Archive
                </button>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    fileInputRef.current?.click();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left"
                >
                  <Upload className="w-4 h-4 text-academic-gold" />
                  Index New Record
                </button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf"
              onChange={handleFileUpload}
            />
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={
              activeDocId
                ? "Formulate your inquiry regarding the document..."
                : isFreeChat
                  ? "Ask me anything..."
                  : "Please upload a document first to start chatting."
            }
            disabled={(!activeDocId && !isFreeChat) || isLoading}
            className="w-full max-h-32 min-h-[48px] bg-transparent border-none outline-none resize-none py-3 text-sm text-slate-700 placeholder:text-slate-400 font-medium"
            rows={1}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || (!activeDocId && !isFreeChat) || isLoading}
            className="p-3.5 bg-academic-navy text-white hover:bg-academic-blue rounded-xl transition-all shrink-0 shadow-lg shadow-academic-navy/20 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center mt-4">
          Automated analysis. Subject to academic verification.
        </p>
      </div>
    </div>
  );
}
