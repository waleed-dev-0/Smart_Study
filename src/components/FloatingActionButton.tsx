import React, { useState } from 'react';
import { BookOpen, X, Settings2, Loader2, Target, Globe2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import api from '../services/api';

export default function FloatingActionButton({ activeDocId }: { activeDocId: string | null }) {
  const { isArabic } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [language, setLanguage] = useState(isArabic ? 'Arabic' : 'English');
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const t = {
    generateQuiz: isArabic ? "إنشاء اختبار" : "Generate Quiz",
    quizConfig: isArabic ? "إعدادات الاختبار" : "Quiz Configuration",
    academicAssessment: isArabic ? "تقييم أكاديمي" : "Academic Assessment",
    difficultyLevel: isArabic ? "مستوى الصعوبة" : "Difficulty Level",
    numQuestions: isArabic ? "عدد الأسئلة" : "Number of Questions",
    min: isArabic ? "الحد الأدنى" : "5 Min",
    max: isArabic ? "الحد الأقصى" : "25 Max",
    explanationLang: isArabic ? "لغة الشرح" : "Explanation Language",
    synthesizing: isArabic ? "جاري إنشاء الاختبار..." : "Synthesizing Quiz...",
    generateAcademicQuiz: isArabic ? "إنشاء اختبار أكاديمي" : "Generate Academic Quiz",
    aiTools: isArabic ? "أدوات الذكاء الاصطناعي" : "AI Tools",
    selectDocFirst: isArabic ? "يرجى تحديد أو رفع مستند أولاً." : "Please select or upload a document first.",
    errorGenerating: isArabic ? "خطأ في إنشاء الاختبار: " : "Error generating quiz: ",
    failedGenerate: isArabic ? "فشل في إنشاء الاختبار." : "Failed to generate quiz.",
    easy: isArabic ? "سهل" : "easy",
    medium: isArabic ? "متوسط" : "medium",
    hard: isArabic ? "صعب" : "hard",
  };

  const handleCreateQuiz = () => {
    if (!activeDocId) {
      alert(t.selectDocFirst);
      return;
    }
    setIsOpen(false);
    setIsModalOpen(true);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await api.post('/questions/generate', {
        document_id: activeDocId,
        difficulty,
        count: numQuestions,
        language
      });

      if (response.data.success) {
        setIsModalOpen(false);
        navigate('/question-bank');
      } else {
        alert(t.errorGenerating + response.data.message);
      }
    } catch (error: any) {
      console.error("Failed to generate quiz", error);
      alert(error.response?.data?.message || t.failedGenerate);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-40 end-8 md:end-12 z-40 flex flex-col items-end gap-3 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {isOpen && (
          <div className="flex flex-col items-end gap-3 mb-2 animate-in slide-in-from-bottom-4 fade-in duration-200">
            <button
              onClick={handleCreateQuiz}
              className="group flex items-center gap-3 px-5 py-2.5 rounded-full shadow-lg bg-white/95/95 backdrop-blur-sm border border-slate-200 dark:border-cafe-surface-dark text-cafe-primary hover:bg-slate-50 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="font-bold text-sm tracking-wide">{t.generateQuiz}</span>
              <div className="w-8 h-8 rounded-full bg-amber-800/10 flex items-center justify-center text-amber-800 group-hover:bg-amber-800 group-hover:text-white transition-colors">
                <BookOpen className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          title={t.aiTools}
          className={`group flex items-center justify-center transition-all duration-300 p-2 ${
            isOpen 
              ? 'text-amber-800 hover:scale-95 rotate-45' 
              : 'text-amber-800 hover:-translate-y-1 hover:text-amber-900 drop-shadow-xl'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Plus className="w-10 h-10" strokeWidth={2.5} />
            {!isOpen && (
              <span className="absolute top-0 end-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            )}
          </div>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl dark:shadow-black/30 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-cafe-surface-dark flex justify-between items-center bg-slate-50/50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cafe-primary text-white flex items-center justify-center shadow-sm">
                  <Settings2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-cafe-primary text-lg leading-tight">{t.quizConfig}</h3>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t.academicAssessment}</p>
                </div>
              </div>
                <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:text-cafe-text-dark transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-cafe-primary uppercase tracking-wider">
                  <Target className="w-4 h-4 text-cafe-primary-light" />
                  {t.difficultyLevel}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`py-3 rounded-xl text-sm font-bold capitalize transition-all border ${
                        difficulty === level 
                          ? 'bg-cafe-primary text-white border-cafe-primary shadow-md shadow-cafe-primary/20' 
                          : 'bg-white text-slate-500 border-slate-200 dark:border-cafe-surface-dark hover:border-cafe-primary-light hover:bg-slate-50'
                      }`}
                    >
                      {level === 'easy' ? t.easy : level === 'medium' ? t.medium : t.hard}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold text-cafe-primary uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-cafe-primary-light" />
                    {t.numQuestions}
                  </label>
                  <span className="text-lg font-display font-bold text-cafe-primary">{numQuestions}</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="25" 
                  value={numQuestions} 
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-cafe-primary-light"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>{t.min}</span>
                  <span>{t.max}</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-cafe-primary uppercase tracking-wider">
                  <Globe2 className="w-4 h-4 text-cafe-primary-light" />
                  {t.explanationLang}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['English', 'Arabic'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`py-3 rounded-xl text-sm font-bold capitalize transition-all border ${
                        language === lang 
                          ? 'bg-cafe-primary-light text-white border-cafe-primary-light shadow-md shadow-cafe-primary-light/20' 
                          : 'bg-white text-slate-500 border-slate-200 dark:border-cafe-surface-dark hover:border-cafe-primary-light hover:bg-slate-50'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

              <div className="p-6 border-t border-slate-100 dark:border-cafe-surface-dark bg-slate-50/50/50">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 rounded-xl bg-cafe-primary text-white font-bold text-sm uppercase tracking-wider hover:bg-cafe-primary-light transition-all shadow-lg shadow-cafe-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t.synthesizing}
                  </>
                ) : (
                  t.generateAcademicQuiz
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
