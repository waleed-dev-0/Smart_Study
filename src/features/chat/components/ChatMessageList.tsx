import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GraduationCap, User, FileText } from "lucide-react";
import { useAppContext } from "../../../context/AppContext";
import type { Message } from "../hooks/useChat";

interface ChatMessageListProps {
  messages: Message[];
  streamingText: string;
  isLoading: boolean;
  isUploading: boolean;
  loadingStatus: string;
  isFetchingHistory: boolean;
}

const markdownComponents = (isArabic: boolean) => ({
  h1: ({ children }: any) => (
    <h1 className="text-xl font-display font-bold text-cafe-primary dark:text-white mt-4 mb-2 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-lg font-display font-bold text-cafe-primary dark:text-white mt-4 mb-2 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-base font-bold text-cafe-primary dark:text-white mt-3 mb-1 first:mt-0">
      {children}
    </h3>
  ),
  p: ({ children }: any) => (
    <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
  ),
  strong: ({ children }: any) => (
    <strong className="font-bold text-cafe-primary dark:text-white">{children}</strong>
  ),
  em: ({ children }: any) => <em className="italic">{children}</em>,
  ul: ({ children }: any) => (
    <ul className={`list-disc list-inside space-y-1 mb-3 ${isArabic ? "mr-2" : "ml-2"}`}>{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className={`list-decimal list-inside space-y-1 mb-3 ${isArabic ? "mr-2" : "ml-2"}`}>{children}</ol>
  ),
  li: ({ children }: any) => (
    <li className="leading-relaxed">{children}</li>
  ),
  code: ({ inline, children }: any) =>
    inline ? (
      <code className="bg-slate-100 dark:bg-cafe-border-dark text-cafe-primary dark:text-white px-1.5 py-0.5 rounded text-[12px] font-mono">
        {children}
      </code>
    ) : (
      <pre className="bg-slate-900 dark:bg-[#000] text-slate-100 p-4 rounded-xl overflow-x-auto text-[12px] font-mono my-3">
        <code>{children}</code>
      </pre>
    ),
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-3">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: any) => (
    <thead className="bg-slate-100 dark:bg-cafe-border-dark">{children}</thead>
  ),
  th: ({ children }: any) => (
    <th className={`border border-slate-200 dark:border-cafe-border-dark px-3 py-2 font-bold text-cafe-primary dark:text-white text-xs uppercase tracking-wide ${isArabic ? "text-right" : "text-left"}`}>
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="border border-slate-200 dark:border-cafe-border-dark px-3 py-2 text-slate-700 dark:text-cafe-text-dark">
      {children}
    </td>
  ),
  tr: ({ children }: any) => (
    <tr className="hover:bg-slate-50 dark:hover:bg-cafe-surface-dark-alt transition-colors">{children}</tr>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className={`${isArabic ? "border-r-4 pr-4" : "border-l-4 pl-4"} border-cafe-primary-light italic text-slate-600 my-3`}>
      {children}
    </blockquote>
  ),
  a: ({ href, children }: any) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-cafe-primary-light underline hover:text-cafe-primary transition-colors"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="border-slate-200 my-4" />,
});

export default function ChatMessageList({
  messages,
  streamingText,
  isLoading,
  isUploading,
  loadingStatus,
  isFetchingHistory,
}: ChatMessageListProps) {
  const { isArabic } = useAppContext();

  const t = {
    researchAssistant: isArabic ? "مساعد البحث" : "Research Assistant",
    referencePage: isArabic ? "المرجع: صفحة" : "Reference: Page",
    uploadingIndexing: isArabic ? "جاري رفع وفهرسة السجل الجديد..." : "Uploading and indexing new record...",
  };

  return (
    <>
      {isFetchingHistory ? (
        <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto py-10 opacity-70 animate-pulse">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-cafe-border-dark shrink-0"></div>
            <div className="h-24 bg-slate-100 dark:bg-cafe-surface-dark-alt rounded-2xl w-3/4"></div>
          </div>
          <div className="flex gap-4 flex-row-reverse">
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-cafe-border-dark shrink-0"></div>
            <div className="h-16 bg-cafe-primary-light/20 dark:bg-cafe-primary-dark/50 rounded-2xl w-2/3"></div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-cafe-border-dark shrink-0"></div>
            <div className="h-32 bg-slate-100 dark:bg-cafe-surface-dark-alt rounded-2xl w-full"></div>
          </div>
        </div>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-6 max-w-4xl ${msg.role === "user" ? `${isArabic ? "mr-auto" : "ml-auto"} flex-row-reverse` : ""}`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-sm ${
                msg.role === "ai"
                  ? msg.isError
                    ? "bg-red-500 text-white"
                    : "bg-cafe-primary text-white"
                  : "bg-slate-100 dark:bg-cafe-border-dark text-slate-600 dark:text-cafe-text-dark-muted"
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
                <span className="text-xs font-bold text-cafe-primary dark:text-white uppercase tracking-wider">
                  {msg.role === "ai" ? t.researchAssistant : "You"}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-cafe-text-dark-muted font-medium">
                  {msg.timestamp}
                </span>
              </div>

              <div
                className={`p-5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? `bg-cafe-primary-light text-white shadow-lg shadow-cafe-primary-light/10 ${isArabic ? "rounded-tl-none" : "rounded-tr-none"}`
                    : msg.isError
                      ? `bg-red-50 border border-red-200 text-red-800 shadow-sm ${isArabic ? "rounded-tr-none" : "rounded-tl-none"}`
                      : `bg-white dark:bg-cafe-surface-dark-alt border border-slate-200 dark:border-cafe-border-dark text-slate-800 dark:text-cafe-text-dark shadow-sm ${isArabic ? "rounded-tr-none" : "rounded-tl-none"}`
                }`}
              >
                {msg.role === "user" ? (
                  <p>{msg.text}</p>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents(isArabic)}
                  >
                    {msg.text}
                  </ReactMarkdown>
                )}
              </div>

              {msg.citations && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.citations.map((cite, i) => (
                    <button
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-cafe-surface-dark hover:bg-slate-100 dark:hover:bg-cafe-border-dark border border-slate-200 dark:border-cafe-border-dark rounded-lg text-[10px] font-bold text-cafe-primary dark:text-white transition-all uppercase tracking-wide group"
                    >
                      <FileText className="w-3.5 h-3.5 text-cafe-primary-light" />
                      {t.referencePage} {cite.page}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {streamingText && (
        <div className="flex gap-6 max-w-4xl">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-sm bg-cafe-primary text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-2 items-start max-w-[85%]">
            <div className="flex items-center gap-3 px-1">
              <span className="text-xs font-bold text-cafe-primary dark:text-white uppercase tracking-wider">
                {t.researchAssistant}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-cafe-text-dark-muted font-medium">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className={`p-5 rounded-2xl bg-white dark:bg-cafe-surface-dark-alt border border-slate-200 dark:border-cafe-border-dark text-slate-800 dark:text-cafe-text-dark shadow-sm ${isArabic ? "rounded-tr-none" : "rounded-tl-none"}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {streamingText}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {(isLoading && !streamingText || isUploading) && (
        <div className="flex gap-6 max-w-4xl">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-sm bg-cafe-primary text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-2 items-start max-w-[85%]">
            <div className="flex items-center gap-3 px-1">
              <span className="text-xs font-bold text-cafe-primary dark:text-white uppercase tracking-wider">
                {t.researchAssistant}
              </span>
            </div>
            <div className={`p-5 rounded-2xl bg-white dark:bg-cafe-surface-dark-alt border border-slate-200 dark:border-cafe-border-dark shadow-sm flex flex-col gap-2 ${isArabic ? "rounded-tr-none" : "rounded-tl-none"}`}>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 bg-cafe-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 bg-cafe-primary rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 bg-cafe-primary rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              {(loadingStatus || isUploading) && (
                <p className="text-[11px] text-slate-400 font-medium italic">
                  {isUploading
                    ? t.uploadingIndexing
                    : loadingStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
