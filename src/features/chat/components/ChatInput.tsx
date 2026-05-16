import React, { useRef, useState } from "react";
import {
  Paperclip,
  Send,
} from "lucide-react";
import { useAppContext } from "../../../context/AppContext";

interface ChatInputProps {
  activeDocId: string | null;
  isLoading: boolean;
  onSend: (input: string) => void;
  onDocumentUpload: (file: File) => Promise<void>;
  onToggleHistory: () => void;
  isFreeChat?: boolean;
}

export default function ChatInput({
  activeDocId,
  isLoading,
  onSend,
  onDocumentUpload,
  onToggleHistory,
  isFreeChat,
}: ChatInputProps) {
  const { isArabic } = useAppContext();
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    inputPlaceholderDoc: isArabic ? "صُغ استفسارك بخصوص المستند..." : "Formulate your inquiry regarding the document...",
    inputPlaceholderNoDoc: isArabic ? "يرجى رفع مستند أولاً لبدء المحادثة." : "Please upload a document first to start chatting.",
    autoAnalysisMsg: isArabic ? "تحليل آلي. يخضع للتدقيق الأكاديمي." : "Automated analysis. Subject to academic verification.",
    freeChatPlaceholder: isArabic ? "اسألني أي شيء..." : "Ask me anything...",
  };

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

    await onDocumentUpload(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-6 bg-white dark:bg-cafe-surface-dark-alt border-t border-slate-100 dark:border-cafe-border-dark shrink-0">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3 bg-slate-50 dark:bg-cafe-surface-dark border border-slate-200 dark:border-cafe-border-dark rounded-2xl p-3 focus-within:border-cafe-primary-light focus-within:ring-4 focus-within:ring-cafe-primary-light/5 transition-all shadow-inner dark:shadow-black/20">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-xl transition-colors shrink-0 text-slate-400 dark:text-cafe-text-dark-muted hover:text-cafe-primary dark:hover:text-white hover:bg-slate-200 dark:hover:bg-cafe-border-dark"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf"
            onChange={handleFileUpload}
          />

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={
              activeDocId
                ? t.inputPlaceholderDoc
                : isFreeChat
                  ? t.freeChatPlaceholder
                  : t.inputPlaceholderNoDoc
            }
            disabled={(!activeDocId && !isFreeChat) || isLoading}
            className="w-full max-h-32 min-h-[48px] bg-transparent border-none outline-none resize-none py-3 text-sm text-slate-700 dark:text-cafe-text-dark placeholder:text-slate-400 dark:placeholder:text-cafe-text-dark-muted font-medium"
            rows={1}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || (!activeDocId && !isFreeChat) || isLoading}
            className="p-3.5 bg-cafe-primary text-white hover:bg-cafe-primary-light rounded-xl transition-all shrink-0 shadow-lg shadow-cafe-primary/20 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-cafe-text-dark-muted font-bold uppercase tracking-[0.2em] text-center mt-4">
          {t.autoAnalysisMsg}
        </p>
      </div>
    </div>
  );
}
