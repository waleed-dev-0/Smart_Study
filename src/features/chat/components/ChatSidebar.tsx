import { useNavigate } from "react-router-dom";
import { FileText, X } from "lucide-react";

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
}

export default function ChatSidebar({
  isOpen,
  onClose,
  documents,
  activeDocId,
  onSelectDocument,
}: ChatSidebarProps) {
  const navigate = useNavigate();

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
          {documents.map((doc) => (
            <button
              key={doc._id}
              onClick={() => onSelectDocument(doc._id)}
              className={`w-full text-left p-4 rounded-2xl transition-all flex items-start gap-3 group ${
                activeDocId === doc._id
                  ? "bg-slate-50 border border-academic-blue/20 shadow-sm"
                  : "bg-transparent hover:bg-slate-50 border border-transparent"
              }`}
            >
              <FileText
                className={`w-5 h-5 shrink-0 mt-0.5 ${activeDocId === doc._id ? "text-academic-blue" : "text-slate-400 group-hover:text-academic-navy"}`}
              />
              <div className="min-w-0">
                <p
                  className={`text-sm line-clamp-2 leading-tight mb-1 font-serif ${activeDocId === doc._id ? "font-bold text-academic-navy" : "font-medium text-slate-600"}`}
                >
                  {doc.title}
                </p>
                <p
                  className={`text-[10px] font-bold uppercase tracking-wider ${activeDocId === doc._id ? "text-emerald-600" : "text-slate-400"}`}
                >
                  {activeDocId === doc._id ? "Active Analysis" : "Indexed"}
                </p>
              </div>
            </button>
          ))}
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
