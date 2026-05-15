import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, X, Pencil, Check, MoreHorizontal } from "lucide-react";
import api from "../../../services/api";

interface Document {
  _id: string;
  title: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Document[];
  activeDocId: string | null;
  onSelectDocument: (id: string) => void;
  onDocsRefreshed: () => void;
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
  onSelectDocument,
  onDocsRefreshed,
}: ChatSidebarProps) {
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [menuId, setMenuId] = useState<string | null>(null);

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
      alert(err.response?.data?.message || err.message || "Failed to rename");
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
            Chat history
          </h2>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-academic-navy hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                        Press Enter to save
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
                          {isActive ? "Active Analysis" : "Indexed"}
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
                            Rename
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {documents.length === 0 && (
            <div className="text-center py-10">
              <p className="text-xs text-slate-400 font-medium">
                No documents indexed yet.
              </p>
              <button
                onClick={() => navigate("/upload")}
                className="mt-4 text-[10px] font-bold text-academic-blue uppercase tracking-widest hover:underline"
              >
                Upload Now
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
