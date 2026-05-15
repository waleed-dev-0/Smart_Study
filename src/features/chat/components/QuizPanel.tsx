import { X, Search } from "lucide-react";
import { useAppContext } from "../../../context/AppContext";

interface QuizPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuizPanel({ isOpen, onClose }: QuizPanelProps) {
  const { isArabic } = useAppContext();

  const t = {
    evaluationsTitle: isArabic ? "التقييمات الأكاديمية" : "Academic Evaluations",
    reviewResults: isArabic ? "مراجعة النتائج" : "Review Results",
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 z-[70] w-80 bg-white border-l border-slate-200 transform transition-transform duration-300 flex flex-col h-screen shadow-2xl ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xs font-bold text-academic-navy uppercase tracking-widest">
          {t.evaluationsTitle}
        </h2>
        <button
          onClick={onClose}
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
            {t.reviewResults}
          </button>
        </div>
      </div>
    </div>
  );
}
