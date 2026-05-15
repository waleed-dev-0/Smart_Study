import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import { ArrowLeft, CheckCircle2, XCircle, RefreshCw, ChevronRight, Target, Lightbulb, GraduationCap, ShieldCheck, Loader2 } from 'lucide-react';

export default function QuestionBankPage({ isAdmin }: { isAdmin?: boolean }) {
  let navigate = useNavigate();
  let [quizList, setQuizList] = useState<any[]>([]);
  let [activeQ, setActiveQ] = useState(0);
  const [chosenAnswer, setChosenAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  let [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  let [isFinished, setIsFinished] = useState(false);
  let [myHistory, setMyHistory] = useState<any[]>([]);

  useEffect(() => {
    let fetchQuestions = async () => {
      try {
        let activeDocId = localStorage.getItem('activeDocumentId');
        if (!activeDocId) {
          setError("No document selected. Please go back to chat and select a document.");
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        let response = await fetch(`http://127.0.0.1:5000/api/questions/${activeDocId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();

        if (result.success) {
          setQuizList(result.data);
        } else {
          setError(result.message || "Failed to load questions");
        }
      } catch (err) {
        setError("Error loading questions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const currentQuestion = quizList[activeQ];

  const handleOptionSelect = (index: number) => {
    if (!answered) {
      setChosenAnswer(index);
    }
  };

  const handleSubmit = () => {
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

  let handleNext = () => {
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
      let token = localStorage.getItem('token');
      let activeDocId = localStorage.getItem('activeDocumentId');

      await fetch('http://localhost:5000/api/attempts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          documentId: activeDocId,
          score: score,
          totalQuestions: quizList.length,
          difficulty: 'medium',
          answers: myHistory
        })
      });
    } catch (err) {
    }
  };

  const handleReset = () => {
    setActiveQ(0);
    setScore(0);
    setChosenAnswer(null);
    setAnswered(false);
    setIsFinished(false);
    setMyHistory([]);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentScreen="question_bank" isAdmin={isAdmin} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/chat')}
              className="p-2 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg text-slate-500 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Quiz Bank</h1>
              <p className="text-xs text-slate-500">Test Yourself</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg border border-slate-200">
              <span className="text-sm font-bold text-slate-600">
                Score: <span className="text-blue-600">{score}/{quizList.length}</span>
              </span>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          <div className="w-full max-w-3xl">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-sm font-bold text-slate-600">Loading Quiz...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 text-center">
                <p className="font-bold">{error}</p>
                <button
                  onClick={() => navigate('/chat')}
                  className="mt-4 px-4 py-2 bg-white rounded-lg text-sm font-bold shadow-sm border border-slate-300"
                >
                  Return
                </button>
              </div>
            ) : quizList.length === 0 ? (
              <div className="bg-slate-100 text-slate-600 p-6 rounded-xl border border-slate-200 text-center">
                <p className="font-bold">No questions found.</p>
                <button
                  onClick={() => navigate('/chat')}
                  className="mt-4 px-4 py-2 bg-white rounded-lg text-sm font-bold shadow-sm border border-slate-300"
                >
                  Go to Chat
                </button>
              </div>
            ) : isFinished ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-10 text-center flex flex-col items-center">
                <ShieldCheck className="w-16 h-16 text-blue-500 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Quiz Finished!</h2>
                <p className="text-slate-600 mb-6 text-lg">
                  You scored <span className="font-bold text-blue-600">{score}</span> out of {quizList.length}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
                  >
                    Retake Quiz
                  </button>
                  <button
                    onClick={() => navigate('/chat')}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-bold border border-slate-300 hover:bg-slate-200 transition-all"
                  >
                    Back to Chat
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-slate-700">Question {activeQ + 1} of {quizList.length}</span>
                    <span className="text-lg font-bold text-blue-500">
                      {Math.round(((activeQ + 1) / quizList.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${((activeQ + 1) / quizList.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8">
                    <h2 dir="auto" className="text-xl font-bold text-slate-800 mb-8 leading-relaxed text-center">
                      {currentQuestion.question_text}
                    </h2>

                    <div className="grid gap-4">
                      {currentQuestion.options.map((option: string, index: number) => {
                        let isSelected = chosenAnswer === index;
                        let isCorrect = option === currentQuestion.correct_answer;

                        let optionClass = "border-slate-200 hover:bg-slate-50 text-slate-700";
                        let icon = null;

                        if (answered) {
                          if (isCorrect) {
                            optionClass = "border-green-400 bg-green-50 text-green-800";
                            icon = <CheckCircle2 className="w-5 h-5 text-green-600" />;
                          } else if (isSelected && !isCorrect) {
                            optionClass = "border-red-400 bg-red-50 text-red-800";
                            icon = <XCircle className="w-5 h-5 text-red-600" />;
                          } else {
                            optionClass = "border-slate-100 text-slate-400";
                          }
                        } else if (isSelected) {
                          optionClass = "border-blue-500 bg-blue-50 text-blue-800 ring-1 ring-blue-500";
                        }

                        return (
                          <button
                            key={index}
                            onClick={() => handleOptionSelect(index)}
                            disabled={answered}
                            className={`w-full text-start p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-4 ${optionClass}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 ${isSelected && !answered ? 'bg-blue-600 text-white' :
                                  answered && isCorrect ? 'bg-green-600 text-white' :
                                    answered && isSelected && !isCorrect ? 'bg-red-600 text-white' :
                                      'bg-slate-100 text-slate-500'
                                }`}>
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span dir="auto" className="text-lg font-medium">{option}</span>
                            </div>
                            {icon && <div>{icon}</div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {answered && (
                    <div className="bg-slate-50 border-t border-slate-200 p-8">
                      <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${currentQuestion.options[chosenAnswer!] === currentQuestion.correct_answer ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                          <Lightbulb className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-xl font-bold mb-2 ${currentQuestion.options[chosenAnswer!] === currentQuestion.correct_answer ? 'text-green-700' : 'text-red-700'}`}>
                            {currentQuestion.options[chosenAnswer!] === currentQuestion.correct_answer ? 'Correct Answer!' : 'Wrong Answer'}
                          </h3>
                          <div dir="auto" className="text-slate-700 mb-6 bg-white p-4 rounded-lg border border-slate-200">
                            {currentQuestion.explanation}
                          </div>
                          <button
                            onClick={handleNext}
                            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all"
                          >
                            {activeQ < quizList.length - 1 ? 'Next Question' : 'Finish Quiz'}
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {!answered && (
                    <div className="bg-slate-50 border-t border-slate-200 p-6 flex justify-center">
                      <button
                         onClick={handleSubmit}
                         disabled={chosenAnswer === null}
                         className={`w-full max-w-sm flex items-center justify-center py-3 rounded-lg font-bold transition-all ${chosenAnswer !== null
                             ? 'bg-blue-600 text-white hover:bg-blue-700'
                             : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                           }`}
                      >
                         Submit Answer
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
