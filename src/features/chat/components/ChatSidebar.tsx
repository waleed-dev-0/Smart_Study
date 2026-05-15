import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, X, Pencil, Check, MoreHorizontal, MessageSquare, Trash2 } from "lucide-react";
import { useAppContext } from "../../../context/AppContext";
import api from "../../../services/api";

interface Document {
  _id: string;
  title: string;
}

interface FreeChatSession {
  id: string;
  title: string;
  messages: any[];
  createdAt: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Document[];
  activeDocId: string | null;
  activeFreeChatId?: string | null;
  onSelectDocument: (id: string) => void;
  onSelectFreeChat?: (id: string) => void;
  onDeleteDocument?: (id: string) => void;
  onDeleteFreeChat?: (id: string) => void;
  onRenameFreeChat?: (id: string, title: string) => void;
  onDocsRefreshed: () => void;
  freeChatSessions?: FreeChatSession[];
}

function getDuplicateBadge(title: string) {
  const match = title.match(/^(.+?)\s\((\d+)\)\.[^.]+$/);
  return match ? parseInt(match[2]) : null;
}

export default function ChatSidebar({
  isOpen,
  onClose,
  documents,
  activeDocId,
  activeFreeChatId,
  onSelectDocument,
  onSelectFreeChat,
  onDeleteDocument,
  onDeleteFreeChat,
  onRenameFreeChat,
  onDocsRefreshed,
  freeChatSessions = [],
}: ChatSidebarProps) {
  const navigate = useNavigate();
  const { isArabic } = useAppContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [menuId, setMenuId] = useState<string | null>(null);

  const t = {
    chatHistory: isArabic ? "سجل المحادثة" : "Chat history",
    freeChats: isArabic ? "محادثات حرة" : "Free Chats",
    documents: isArabic ? "المستندات" : "Documents",
    pressEnterToSave: isArabic ? "اضغط Enter للحفظ" : "Press Enter to save",
    activeAnalysis: isArabic ? "تحليل نشط" : "Active Analysis",
    indexed: isArabic ? "مفهرس" : "Indexed",
    rename: isArabic ? "إعادة تسمية" : "Rename",
    delete: isArabic ? "حذف" : "Delete",
    noDocs: isArabic ? "لم تتم فهرسة مستندات بعد." : "No documents indexed yet.",
    uploadNow: isArabic ? "ارفع الآن" : "Upload Now",
    failedRename: isArabic ? "فشل إعادة التسمية" : "Failed to rename",
  };

  const startRename = (doc: Document) => {
    setEditingId(doc._id);
    setEditTitle(doc.title);
    setMenuId(null);
  };

  const saveRename = async (id: string) => {
    if (!editTitle.trim()) return;
    try {
      const res = await api.put(`/chat/session/${id}`, { title: editTitle.trim() });
      if (res.data?.success) {
        onDocsRefreshed();
      }
    } catch (err: any) {
      console.error("Rename failed", err);
      alert(err.response?.data?.message || err.message || t.failedRename);
    }
    setEditingId(null);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-academic-navy/20 backdrop-blur-sm z-[60] lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-[70] w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:flex flex-col h-screen lg:w-64 lg:sticky lg:top-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-bold text-academic-navy uppercase tracking-widest">
            {t.chatHistory}
          </h2>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-academic-navy hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {freeChatSessions.length > 0 && (
            <div className="mb-4">
              <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {t.freeChats}
              </p>
              <div className="space-y-1 mt-1">
                {freeChatSessions.map((session) => {
                  const isActive = activeFreeChatId === session.id;
                  const isEditing = editingId === session.id;

                  return (
                    <div
                      key={session.id}
                      className="group relative"
                    >
                      {isEditing ? (
                        <div className="p-3 flex items-start gap-3">
                          <MessageSquare className="w-5 h-5 shrink-0 mt-0.5 text-academic-blue" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <input
                                autoFocus
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    onRenameFreeChat?.(session.id, editTitle);
                                    setEditingId(null);
                                  }
                                  if (e.key === "Escape") setEditingId(null);
                                }}
                                className="text-sm font-serif font-bold text-academic-navy bg-white border border-academic-blue rounded-lg px-2 py-1 w-full outline-none"
                              />
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mt-1">
                              {t.pressEnterToSave}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              onRenameFreeChat?.(session.id, editTitle);
                              setEditingId(null);
                            }}
                            className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all shrink-0"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3 p-3">
                          <button
                            onClick={() => onSelectFreeChat?.(session.id)}
                            className="flex items-start gap-3 min-w-0 flex-1"
                          >
                            <MessageSquare className={`w-5 h-5 shrink-0 mt-0.5 ${isActive ? "text-academic-blue" : "text-slate-400"}`} />
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm line-clamp-2 leading-tight font-serif ${isActive ? "font-bold text-academic-navy" : "font-medium text-slate-600"}`}>
                                {session.title}
                              </p>
                              <p className="text-[10px] font-bold uppercase tracking-wider mt-1 text-slate-400">
                                {new Date(session.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </button>
                          <div className="relative shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuId(menuId === session.id ? null : session.id);
                              }}
                              className="p-1 text-slate-300 hover:text-academic-navy rounded-lg transition-colors"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            {menuId === session.id && (
                              <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 py-1">
                                <button
                                  onClick={() => {
                                    setEditingId(session.id);
                                    setEditTitle(session.title);
                                    setMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                  {t.rename}
                                </button>
                                <button
                                  onClick={() => {
                                    setMenuId(null);
                                    onDeleteFreeChat?.(session.id);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  {t.delete}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {documents.length > 0 && (
            <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {t.documents}
            </p>
          )}

          {documents.map((doc) => {
            const dupNum = getDuplicateBadge(doc.title);
            const isEditing = editingId === doc._id;
            const isActive = activeDocId === doc._id;

            return (
              <div
                key={doc._id}
                className={`relative w-full rounded-2xl transition-all flex flex-col ${
                  isActive
                    ? "bg-slate-50 border border-academic-blue/20 shadow-sm"
                    : "bg-transparent hover:bg-slate-50 border border-transparent"
                }`}
              >
                {isEditing ? (
                  <div className="p-4 flex items-start gap-3">
                    <FileText className="w-5 h-5 shrink-0 mt-0.5 text-academic-blue" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveRename(doc._id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="text-sm font-serif font-bold text-academic-navy bg-white border border-academic-blue rounded-lg px-2 py-1 w-full outline-none"
                        />
                        {dupNum !== null && (
                          <span className="shrink-0 w-5 h-5 flex items-center justify-center bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200">
                            {dupNum}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mt-1">
                        {t.pressEnterToSave}
                      </p>
                    </div>
                    <button
                      onClick={() => saveRename(doc._id)}
                      className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all shrink-0"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 p-4">
                    <button
                      onClick={() => onSelectDocument(doc._id)}
                      className="flex items-start gap-3 min-w-0 flex-1"
                    >
                      <FileText
                        className={`w-5 h-5 shrink-0 mt-0.5 ${isActive ? "text-academic-blue" : "text-slate-400 group-hover:text-academic-navy"}`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm line-clamp-2 leading-tight font-serif ${isActive ? "font-bold text-academic-navy" : "font-medium text-slate-600"}`}
                          >
                            {doc.title}
                          </p>
                          {dupNum !== null && (
                            <span className="shrink-0 w-5 h-5 flex items-center justify-center bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200">
                              {dupNum}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${isActive ? "text-emerald-600" : "text-slate-400"}`}
                        >
                          {isActive ? t.activeAnalysis : t.indexed}
                        </p>
                      </div>
                    </button>
                    <div className="relative shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuId(menuId === doc._id ? null : doc._id);
                        }}
                        className="p-1 text-slate-300 hover:text-academic-navy rounded-lg transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {menuId === doc._id && (
                        <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 py-1">
                          <button
                            onClick={() => startRename(doc)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            {t.rename}
                          </button>
                          <button
                            onClick={() => {
                              setMenuId(null);
                              onDeleteDocument?.(doc._id);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {t.delete}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {documents.length === 0 && freeChatSessions.length === 0 && (
            <div className="text-center py-10">
              <p className="text-xs text-slate-400 font-medium">
                {t.noDocs}
              </p>
              <button
                onClick={() => navigate("/upload")}
                className="mt-4 text-[10px] font-bold text-academic-blue uppercase tracking-widest hover:underline"
              >
                {t.uploadNow}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
