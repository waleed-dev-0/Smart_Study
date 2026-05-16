import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ArrowLeft, History, Target, TrendingUp, Calendar, ChevronRight, CheckCircle2, XCircle, X, Eye, FileText, Award, Brain } from 'lucide-react';
import api from '../services/api';
import { useAppContext } from "../context/AppContext";

export default function QuizHistoryPage({ isAdmin }: { isAdmin?: boolean }) {
  let navigate = useNavigate();
  const { isArabic } = useAppContext();
  const [allPastScores, setAllPastScores] = useState<any[]>([]);
  let [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  let [clickedScore, setClickedScore] = useState<any | null>(null);

  const t = {
    quizHistory: isArabic ? "سجل الاختبارات" : "Quiz History",
    yourProgress: isArabic ? "تقدمك" : "Your Progress",
    totalQuizzes: isArabic ? "إجمالي الاختبارات" : "Total Quizzes",
    averageScore: isArabic ? "متوسط الدرجات" : "Average Score",
    progress: isArabic ? "التقدم" : "Progress",
    loading: isArabic ? "جاري تحميل السجل..." : "Loading history...",
    noHistory: isArabic ? "لم يتم العثور على سجل للاختبارات." : "No quiz history found.",
    date: isArabic ? "التاريخ" : "Date",
    document: isArabic ? "المستند" : "Document",
    score: isArabic ? "الدرجة" : "Score",
    actions: isArabic ? "إجراءات" : "Actions",
    unknown: isArabic ? "غير معروف" : "Unknown",
    details: isArabic ? "التفاصيل" : "Details",
    quizDetails: isArabic ? "تفاصيل الاختبار" : "Quiz Details",
    explanation: isArabic ? "التفسير:" : "Explanation:",
    noDetails: isArabic ? "لا توجد تفاصيل متاحة." : "No details available.",
    failedLoadHistory: isArabic ? "فشل في تحميل السجل" : "Failed to load history",
    errorLoading: isArabic ? "خطأ في تحميل السجل." : "Error loading history.",
    errorPrefix: isArabic ? "خطأ: " : "Error: ",
    failedLoadDetails: isArabic ? "فشل في تحميل التفاصيل" : "Failed to load details",
    correctAnswer: isArabic ? "الإجابة الصحيحة" : "Correct Answer",
    yourAnswer: isArabic ? "إجابتك" : "Your Answer",
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      let response = await api.get('/attempts');
      if (response.data.success) {
        setAllPastScores(response.data.data);
      } else {
        setError(response.data.message || t.failedLoadHistory);
      }
    } catch (err: any) {
      setError(t.errorLoading);
    } finally {
      setIsLoading(false);
    }
  };

  let fetchAttemptDetails = async (id: string) => {
    try {
      const response = await api.get(`/attempts/${id}`);
      if (response.data.success) {
        setClickedScore(response.data.data);
      } else {
        alert(t.errorPrefix + response.data.message);
      }
    } catch (err: any) {
      alert(t.failedLoadDetails);
    }
  };

  const calculateStats = () => {
    if (allPastScores.length === 0) return { avg: 0, progress: 0 };
    
    let avg = allPastScores.reduce((acc, curr) => acc + (curr.score / curr.total_questions) * 100, 0) / allPastScores.length;
    
    let progress = 0;
    if (allPastScores.length >= 2) {
      const recent = allPastScores.slice(0, Math.ceil(allPastScores.length / 2));
      const older = allPastScores.slice(Math.ceil(allPastScores.length / 2));
      
      let recentAvg = recent.reduce((acc, curr) => acc + (curr.score / curr.total_questions) * 100, 0) / recent.length;
      let olderAvg = older.reduce((acc, curr) => acc + (curr.score / curr.total_questions) * 100, 0) / older.length;
      
      progress = recentAvg - olderAvg;
    }
    
    return { avg: Math.round(avg), progress: Math.round(progress) };
  };

  const stats = calculateStats();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  return (
    <div className={`flex min-h-screen bg-cafe-surface dark:bg-cafe-surface-dark`} dir={isArabic ? "rtl" : "ltr"}>
      <Sidebar currentScreen="quiz_history" isAdmin={isAdmin} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 sm:h-20 bg-white/80 dark:bg-cafe-surface-dark-alt/80 backdrop-blur-md border-b border-cafe-primary/5 dark:border-cafe-border-dark flex items-center px-4 sm:px-6 md:px-10 shrink-0 sticky top-0 z-10">
          <button
            onClick={() => navigate('/chat')}
            className="p-2 bg-cafe-secondary hover:bg-cafe-primary hover:text-white rounded-xl text-cafe-primary-light transition-all me-3 sm:me-4 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-xl font-display font-bold text-cafe-primary dark:text-white">{t.quizHistory}</h1>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-cafe-text-dark-muted font-medium">{t.yourProgress}</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 pb-24 md:pb-10">
          <div className="max-w-7xl mx-auto">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
              <div className="bg-white dark:bg-cafe-surface-dark-alt p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-slate-100 dark:border-cafe-border-dark shadow-xl shadow-cafe-primary/5 dark:shadow-black/20 flex items-center gap-4 sm:gap-6 group hover:border-cafe-primary-light/20 transition-all">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-cafe-primary-light/5 text-cafe-primary-light rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-cafe-primary-light/10">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">{t.totalQuizzes}</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-cafe-primary dark:text-white leading-none">{allPastScores.length}</p>
                </div>
              </div>
              <div className="bg-white dark:bg-cafe-surface-dark-alt p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-slate-100 dark:border-cafe-border-dark shadow-xl shadow-cafe-primary/5 dark:shadow-black/20 flex items-center gap-4 sm:gap-6 group hover:border-cafe-primary-light/20 transition-all">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-cafe-success/5 text-cafe-success rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-cafe-success/10">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">{t.averageScore}</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-cafe-primary dark:text-white leading-none">{stats.avg}%</p>
                </div>
              </div>
              <div className="bg-white dark:bg-cafe-surface-dark-alt p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-slate-100 dark:border-cafe-border-dark shadow-xl shadow-cafe-primary/5 dark:shadow-black/20 flex items-center gap-4 sm:gap-6 group hover:border-cafe-primary-light/20 transition-all sm:col-span-2 md:col-span-1">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border ${stats.progress >= 0 ? 'bg-cafe-warning/5 text-cafe-warning border-cafe-warning/10' : 'bg-cafe-danger/5 text-cafe-danger border-cafe-danger/10'}`}>
                  <History className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">{t.progress}</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-cafe-primary dark:text-white leading-none">{stats.progress > 0 ? '+' : ''}{stats.progress}%</p>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 bg-white dark:bg-cafe-surface-dark-alt rounded-2xl sm:rounded-[2rem] border border-slate-100 dark:border-cafe-border-dark shadow-xl shadow-cafe-primary/5 dark:shadow-black/20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-cafe-secondary dark:border-cafe-surface-dark border-t-cafe-primary rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 dark:text-cafe-text-dark-muted font-medium text-xs sm:text-sm">{t.loading}</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 bg-white dark:bg-cafe-surface-dark-alt rounded-2xl sm:rounded-[2rem] border border-slate-100 dark:border-cafe-border-dark shadow-xl shadow-cafe-primary/5 dark:shadow-black/20">
                <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-cafe-danger mb-4" />
                <p className="text-cafe-danger font-medium text-xs sm:text-sm">{error}</p>
              </div>
            ) : allPastScores.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 bg-white dark:bg-cafe-surface-dark-alt rounded-2xl sm:rounded-[2rem] border border-slate-100 dark:border-cafe-border-dark shadow-xl shadow-cafe-primary/5 dark:shadow-black/20">
                <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-cafe-primary-light/30 mb-4" />
                <p className="text-slate-500 dark:text-cafe-text-dark-muted font-medium text-xs sm:text-sm">{t.noHistory}</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-cafe-surface-dark-alt rounded-2xl sm:rounded-[2rem] border border-slate-100 dark:border-cafe-border-dark shadow-xl shadow-cafe-primary/5 dark:shadow-black/20 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-start min-w-[600px]">
                    <thead>
                      <tr className="border-b border-cafe-primary/5 dark:border-cafe-border-dark">
                        <th className={`p-4 sm:p-5 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest ${isArabic ? "text-right" : "text-start"}`}>{t.date}</th>
                        <th className={`p-4 sm:p-5 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest ${isArabic ? "text-right" : "text-start"}`}>{t.document}</th>
                        <th className={`p-4 sm:p-5 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest ${isArabic ? "text-right" : "text-start"}`}>{t.score}</th>
                        <th className={`p-4 sm:p-5 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest ${isArabic ? "text-right" : "text-start"}`}>{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allPastScores.map((attempt) => {
                        const percentage = Math.round((attempt.score / attempt.total_questions) * 100);
                        return (
                          <tr key={attempt._id} className="border-b border-cafe-primary/5 dark:border-cafe-border-dark hover:bg-cafe-secondary/30 dark:hover:bg-cafe-surface-dark transition-colors">
                            <td className="p-4 sm:p-5">
                              <span className="text-xs sm:text-sm text-slate-600 dark:text-cafe-text-dark font-medium">
                                {formatDate(attempt.completedAt)}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cafe-primary-light/5 text-cafe-primary-light flex items-center justify-center shrink-0 border border-cafe-primary-light/10">
                                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <span className="text-xs sm:text-sm font-semibold text-cafe-primary dark:text-white truncate max-w-[150px] sm:max-w-[200px]">
                                  {attempt.document_id?.title || t.unknown}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 sm:p-5">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                                  <svg className="w-10 h-10 sm:w-12 sm:h-12 -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3" className="text-cafe-secondary" />
                                    <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${percentage * 2.83} 283`}
                                      className={`${percentage >= 80 ? 'text-cafe-success' : percentage >= 50 ? 'text-cafe-warning' : 'text-cafe-danger'}`}
                                      strokeLinecap="round" />
                                  </svg>
                                  <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${percentage >= 80 ? 'text-cafe-success' : percentage >= 50 ? 'text-cafe-warning' : 'text-cafe-danger'}`}>
                                    {percentage}%
                                  </span>
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-slate-600 dark:text-cafe-text-dark">
                                  {attempt.score}/{attempt.total_questions}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 sm:p-5">
                              <button 
                                onClick={() => fetchAttemptDetails(attempt._id)}
                                className="flex items-center justify-center gap-1.5 sm:gap-2 bg-cafe-primary text-white px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold hover:bg-cafe-primary-light transition-all shadow-xl shadow-cafe-primary/20"
                              >
                                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                {t.details}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>

        {clickedScore && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-cafe-surface-dark-alt rounded-2xl sm:rounded-[2rem] w-full max-w-sm sm:max-w-3xl max-h-[80vh] flex flex-col shadow-2xl shadow-cafe-primary/20 dark:shadow-black/30 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-cafe-primary/5 dark:border-cafe-border-dark flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cafe-primary-light/5 text-cafe-primary-light flex items-center justify-center border border-cafe-primary-light/10">
                    <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h2 className="text-base sm:text-lg font-display font-bold text-cafe-primary dark:text-white">{t.quizDetails}</h2>
                </div>
                <button 
                  onClick={() => setClickedScore(null)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cafe-secondary dark:bg-cafe-surface-dark hover:bg-cafe-danger hover:text-white text-cafe-primary-light dark:text-white flex items-center justify-center transition-all active:scale-95"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                {clickedScore.answers && clickedScore.answers.length > 0 ? (
                  clickedScore.answers.map((answer: any, index: number) => (
                    <div key={index} className="bg-cafe-surface dark:bg-cafe-surface-dark p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-cafe-primary/5 dark:border-cafe-border-dark">
                      <p className="font-display font-bold text-cafe-primary dark:text-white mb-3 sm:mb-5 text-sm sm:text-lg">{index + 1}. {answer.questionText}</p>
                      
                      <div className="space-y-2 sm:space-y-3">
                        {answer.options?.map((opt: string, i: number) => {
                          let isSelected = answer.selectedAnswer === opt;
                          let isCorrect = answer.correctAnswer === opt;
                          
                          let                             bgClass = "bg-white dark:bg-cafe-surface-dark-alt border-slate-100 dark:border-cafe-border-dark text-slate-600 dark:text-cafe-text-dark";
                          let label = "";
                          if (isCorrect) {
                            bgClass = "bg-cafe-success/5 border-cafe-success/30 text-cafe-success font-bold";
                            label = t.correctAnswer;
                          } else if (isSelected && !isCorrect) {
                            bgClass = "bg-cafe-danger/5 border-cafe-danger/30 text-cafe-danger";
                            label = t.yourAnswer;
                          }

                          return (
                            <div key={i} className={`p-3 sm:p-4 rounded-xl border ${bgClass}`}>
                              <div className={`flex items-center gap-2 sm:gap-3 ${isArabic ? "flex-row" : ""}`}>
                                {isCorrect && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-cafe-success shrink-0" />}
                                {isSelected && !isCorrect && <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cafe-danger shrink-0" />}
                                {label && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider shrink-0">
                                    {label}
                                  </span>
                                )}
                                <span className="text-xs sm:text-sm">{opt}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {!answer.isCorrect && answer.explanation && (
                        <div className="mt-3 sm:mt-5 p-4 sm:p-5 bg-cafe-primary-light/5 dark:bg-cafe-primary-dark/20 border border-cafe-primary-light/10 dark:border-cafe-primary-dark/30 rounded-xl sm:rounded-2xl">
                          <p className="text-[10px] sm:text-xs font-bold text-cafe-primary dark:text-cafe-primary-light mb-2 uppercase tracking-widest">{t.explanation}</p>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-cafe-text-dark">{answer.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 sm:py-16">
                    <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-cafe-primary-light/30 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-cafe-text-dark-muted font-medium text-xs sm:text-sm">{t.noDetails}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
