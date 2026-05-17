import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import { useAppContext } from "../context/AppContext";
import { ArrowLeft, CheckCircle2, XCircle, RefreshCw, ChevronRight, Target, Lightbulb, GraduationCap, ShieldCheck, Loader2 } from 'lucide-react';
import api from "../services/api";

export default function QuestionBankPage({ isAdmin }: { isAdmin?: boolean }) {
  let navigate = useNavigate();
  const { isArabic } = useAppContext();
  let [quizList, setQuizList] = useState<any[]>([]);
  let [activeQ, setActiveQ] = useState(0);
  const [chosenAnswer, setChosenAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  let [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  let [isFinished, setIsFinished] = useState(false);
  let [myHistory, setMyHistory] = useState<any[]>([]);

  const t = {
    quizBank: isArabic ? "بنك الأسئلة" : "Quiz Bank",
    testYourself: isArabic ? "اختبر نفسك" : "Test Yourself",
    score: isArabic ? "النتيجة:" : "Score:",
    reset: isArabic ? "إعادة تعيين" : "Reset",
    loadingQuiz: isArabic ? "جاري تحميل الاختبار..." : "Loading Quiz...",
    return: isArabic ? "عودة" : "Return",
    noQuestions: isArabic ? "لم يتم العثور على أسئلة." : "No questions found.",
    goToChat: isArabic ? "الذهاب إلى الدردشة" : "Go to Chat",
    quizFinished: isArabic ? "انتهى الاختبار!" : "Quiz Finished!",
    youScored: isArabic ? "لقد حصلت على" : "You scored",
    outOf: isArabic ? "من أصل" : "out of",
    retakeQuiz: isArabic ? "إعادة الاختبار" : "Retake Quiz",
    backToChat: isArabic ? "العودة إلى الدردشة" : "Back to Chat",
    question: isArabic ? "سؤال" : "Question",
    of: isArabic ? "من" : "of",
    correctAnswer: isArabic ? "إجابة صحيحة!" : "Correct Answer!",
    wrongAnswer: isArabic ? "إجابة خاطئة" : "Wrong Answer",
    nextQuestion: isArabic ? "السؤال التالي" : "Next Question",
    finishQuiz: isArabic ? "إنهاء الاختبار" : "Finish Quiz",
    submitAnswer: isArabic ? "إرسال الإجابة" : "Submit Answer",
    noDocument: isArabic ? "لم يتم تحديد مستند. يرجى العودة إلى الدردشة واختيار مستند." : "No document selected. Please go back to chat and select a document.",
    failedLoad: isArabic ? "فشل في تحميل الأسئلة" : "Failed to load questions",
    errorLoading: isArabic ? "خطأ في تحميل الأسئلة. يرجى المحاولة مرة أخرى." : "Error loading questions. Please try again."
  };

  useEffect(() => {
    let fetchQuestions = async () => {
      try {
        let activeDocId = localStorage.getItem('activeDocumentId');
        if (!activeDocId) {
          setError(t.noDocument);
          setIsLoading(false);
          return;
        }

        const response = await api.get(`/questions/${activeDocId}`);

        if (response.data.success) {
          setQuizList(response.data.data);
        } else {
          setError(response.data.message || t.failedLoad);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || t.errorLoading);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const currentQuestion = quizList[activeQ];

  const OptionSelect = (index: number) => {
    if (!answered) {
      setChosenAnswer(index);
    }
  };

  const Submit = () => {
    if (chosenAnswer !== null && currentQuestion) {
      setAnswered(true);
      let isCorrect = currentQuestion.options[chosenAnswer] === currentQuestion.correct_answer;
      
      if (isCorrect) {
        setScore(prev => prev + 1);
      }
      
      setMyHistory(prev => [...prev, {
        questionId: currentQuestion._id,
        questionText: currentQuestion.question_text,
        options: currentQuestion.options,
        selectedAnswer: currentQuestion.options[chosenAnswer],
        correctAnswer: currentQuestion.correct_answer,
        isCorrect: isCorrect,
        explanation: currentQuestion.explanation
      }]);
    }
  };

  let Next = () => {
    if (activeQ < quizList.length - 1) {
      setActiveQ(prev => prev + 1);
      setChosenAnswer(null);
      setAnswered(false);
    } else {
      setIsFinished(true);
      saveResults();
    }
  };

  const saveResults = async () => {
    try {
      let activeDocId = localStorage.getItem('activeDocumentId');

      await api.post('/attempts', {
        documentId: activeDocId,
        score: score,
        totalQuestions: quizList.length,
        difficulty: 'medium',
        answers: myHistory
      });
    } catch (err) {
      console.error("Failed to save quiz attempt:", err);
    }
  };

  const Reset = () => {
    setActiveQ(0);
    setScore(0);
    setChosenAnswer(null);
    setAnswered(false);
    setIsFinished(false);
    setMyHistory([]);
  };

  return (
    <div className="flex min-h-screen bg-cafe-surface" dir={isArabic ? "rtl" : "ltr"}>
      <Sidebar currentScreen="question_bank" isAdmin={isAdmin} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 sm:h-20 bg-white border-b border-cafe-secondary dark:border-cafe-surface-dark flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigate('/chat')}
              className="p-2 bg-cafe-secondary hover:bg-cafe-primary hover:text-white rounded-lg text-cafe-text/60 transition-all"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-cafe-text">{t.quizBank}</h1>
              <p className="text-[10px] sm:text-xs text-cafe-text/60">{t.testYourself}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-cafe-secondary rounded-lg border border-cafe-secondary">
              <span className="text-xs sm:text-sm font-bold text-cafe-text/80">
                {t.score} <span className="text-cafe-primary">{score}/{quizList.length}</span>
              </span>
            </div>
            <button
              onClick={Reset}
              className="flex items-center gap-1.5 sm:gap-2 bg-white border border-cafe-secondary dark:border-cafe-surface-dark text-cafe-text px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold hover:bg-cafe-surface transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t.reset}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center">
          <div className="w-full max-w-3xl">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="w-8 h-8 text-cafe-primary animate-spin" />
                <p className="text-sm font-bold text-cafe-text/80">{t.loadingQuiz}</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 sm:p-6 rounded-xl border border-red-200 dark:border-red-900/30 text-center">
                <p className="font-bold text-sm sm:text-base">{error}</p>
                <button
                  onClick={() => navigate('/chat')}
                  className="mt-4 px-4 py-2 bg-white rounded-lg text-xs sm:text-sm font-bold shadow-sm border border-cafe-secondary dark:border-cafe-surface-dark"
                >
                  {t.return}
                </button>
              </div>
            ) : quizList.length === 0 ? (
              <div className="bg-cafe-secondary text-cafe-text/80 p-4 sm:p-6 rounded-xl border border-cafe-secondary text-center">
                <p className="font-bold text-sm sm:text-base">{t.noQuestions}</p>
                <button
                  onClick={() => navigate('/chat')}
                  className="mt-4 px-4 py-2 bg-white rounded-lg text-xs sm:text-sm font-bold shadow-sm border border-cafe-secondary dark:border-cafe-surface-dark"
                >
                  {t.goToChat}
                </button>
              </div>
            ) : isFinished ? (
              <div className="bg-white rounded-2xl border border-cafe-secondary dark:border-cafe-surface-dark shadow-md dark:shadow-black/20 p-6 sm:p-10 text-center flex flex-col items-center">
                <ShieldCheck className="w-12 h-12 sm:w-16 sm:h-16 text-cafe-primary mb-4" />
                <h2 className="text-xl sm:text-2xl font-bold text-cafe-text mb-2">{t.quizFinished}</h2>
                <p className="text-cafe-text/80 mb-6 text-base sm:text-lg">
                  {t.youScored} <span className="font-bold text-cafe-primary">{score}</span> {t.outOf} {quizList.length}
                </p>
                <div className="flex gap-3 sm:gap-4">
                  <button
                    onClick={Reset}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-cafe-primary text-white rounded-lg font-bold hover:bg-cafe-primary-dark transition-all text-xs sm:text-sm"
                  >
                    {t.retakeQuiz}
                  </button>
                  <button
                    onClick={() => navigate('/chat')}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-cafe-secondary text-cafe-text rounded-lg font-bold border border-cafe-secondary hover:bg-cafe-secondary transition-all text-xs sm:text-sm"
                  >
                    {t.backToChat}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 sm:mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs sm:text-sm font-bold text-cafe-text">{t.question} {activeQ + 1} {t.of} {quizList.length}</span>
                    <span className="text-base sm:text-lg font-bold text-cafe-primary">
                      {Math.round(((activeQ + 1) / quizList.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 sm:h-2 bg-cafe-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cafe-primary/50 transition-all"
                      style={{ width: `${((activeQ + 1) / quizList.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-cafe-secondary dark:border-cafe-surface-dark shadow-sm overflow-hidden">
                  <div className="p-4 sm:p-8">
                    <h2 dir="auto" className="text-base sm:text-xl font-bold text-cafe-text mb-6 sm:mb-8 leading-relaxed text-center">
                      {currentQuestion.question_text}
                    </h2>

                    <div className="grid gap-3 sm:gap-4">
                      {currentQuestion.options.map((option: string, index: number) => {
                        let isSelected = chosenAnswer === index;
                        let isCorrect = option === currentQuestion.correct_answer;

                        let optionClass = "border-cafe-secondary hover:bg-cafe-surface text-cafe-text";
                        let icon = null;

                        if (answered) {
                          if (isCorrect) {
                            optionClass = "border-green-400 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300";
                            icon = <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />;
                          } else if (isSelected && !isCorrect) {
                            optionClass = "border-red-400 dark:border-red-800 bg-red-50 text-red-800 dark:text-red-300";
                            icon = <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />;
                          } else {
                            optionClass = "border-cafe-secondary text-cafe-text/50";
                          }
                        } else if (isSelected) {
                          optionClass = "border-cafe-primary bg-cafe-primary/5 text-cafe-primary ring-1 ring-cafe-primary";
                        }

                        return (
                          <button
                            key={index}
                            onClick={() => OptionSelect(index)}
                            disabled={answered}
                            className={`w-full text-start p-3 sm:p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3 sm:gap-4 ${optionClass}`}
                          >
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold shrink-0 text-xs sm:text-sm ${isSelected && !answered ? 'bg-cafe-primary text-white' :
                                  answered && isCorrect ? 'bg-green-600 text-white' :
                                    answered && isSelected && !isCorrect ? 'bg-red-600 text-white' :
                                      'bg-cafe-secondary text-cafe-text/60'
                                }`}>
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span dir="auto" className="text-sm sm:text-lg font-medium">{option}</span>
                            </div>
                            {icon && <div>{icon}</div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {answered && (
                    <div className="bg-cafe-surface border-t border-cafe-secondary p-4 sm:p-8">
                      <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-6">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${currentQuestion.options[chosenAnswer!] === currentQuestion.correct_answer ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                          <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-base sm:text-xl font-bold mb-2 ${currentQuestion.options[chosenAnswer!] === currentQuestion.correct_answer ? 'text-green-700' : 'text-red-700'}`}>
                            {currentQuestion.options[chosenAnswer!] === currentQuestion.correct_answer ? t.correctAnswer : t.wrongAnswer}
                          </h3>
                          <div dir="auto" className="text-cafe-text mb-4 sm:mb-6 bg-white p-3 sm:p-4 rounded-lg border border-cafe-secondary dark:border-cafe-surface-dark text-sm">
                            {currentQuestion.explanation}
                          </div>
                          <button
                            onClick={Next}
                            className="flex items-center justify-center gap-2 bg-cafe-primary text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold hover:bg-cafe-primary-dark transition-all text-xs sm:text-sm"
                          >
                            {activeQ < quizList.length - 1 ? t.nextQuestion : t.finishQuiz}
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {!answered && (
                    <div className="bg-cafe-surface border-t border-cafe-secondary p-4 sm:p-6 flex justify-center">
                      <button
                         onClick={Submit}
                         disabled={chosenAnswer === null}
                         className={`w-full max-w-sm flex items-center justify-center py-2.5 sm:py-3 rounded-lg font-bold transition-all text-xs sm:text-sm ${chosenAnswer !== null
                             ? 'bg-cafe-primary text-white hover:bg-cafe-primary-dark'
                             : 'bg-cafe-secondary text-cafe-text/60 cursor-not-allowed'
                           }`}
                      >
                         {t.submitAnswer}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
