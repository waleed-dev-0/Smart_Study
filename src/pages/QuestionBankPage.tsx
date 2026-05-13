import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import { ArrowLeft, CheckCircle2, XCircle, RefreshCw, ChevronRight, BrainCircuit, Target, Lightbulb, GraduationCap, ShieldCheck, Loader2 } from 'lucide-react';

export default function QuestionBankPage({ isAdmin }: { isAdmin?: boolean }) {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const activeDocId = localStorage.getItem('activeDocumentId');
        if (!activeDocId) {
          setError("No document selected. Please go back to chat and select a document.");
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/questions/${activeDocId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        
        if (result.success) {
          setQuestions(result.data);
        } else {
          setError(result.message || "Failed to load questions");
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Error loading questions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const currentQuestion = questions[currentIdx];

  const handleOptionSelect = (index: number) => {
    if (!isSubmitted) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (selectedOption !== null && currentQuestion) {
      setIsSubmitted(true);
      // Check if selected option string matches correct_answer string
      if (currentQuestion.options[selectedOption] === currentQuestion.correct_answer) {
        setScore(prev => prev + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsFinished(false);
  };

  return (
    <div className="flex min-h-screen bg-academic-paper">
      <Sidebar currentScreen="question_bank" isAdmin={isAdmin} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-academic-navy/5 flex items-center justify-between px-6 md:px-10 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/')}
              className="p-3 bg-slate-50 hover:bg-academic-navy hover:text-white rounded-xl text-slate-500 transition-all shrink-0 hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="hidden md:block h-10 w-px bg-slate-100"></div>
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 bg-academic-gold/5 text-academic-gold rounded-2xl flex items-center justify-center shrink-0 border border-academic-gold/10">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-serif font-bold text-academic-navy leading-tight truncate">Scholarly Evaluation</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Academic Assessment</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                Academic Score: <span className="text-academic-navy">{score}/{questions.length}</span>
              </div>
            </div>
            <button 
              onClick={handleReset}
              className="flex items-center gap-3 bg-white border border-slate-200 text-academic-navy px-6 py-3 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm uppercase tracking-widest"
            >
              <RefreshCw className="w-4 h-4 text-slate-400" />
              Reset
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-24 md:pb-10 flex flex-col items-center">
          <div className="w-full max-w-4xl">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="w-10 h-10 text-academic-blue animate-spin" />
                <p className="text-sm font-bold text-academic-navy uppercase tracking-widest">Loading Assessment...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-100 text-center">
                <p className="font-bold">{error}</p>
                <button 
                  onClick={() => navigate('/')} 
                  className="mt-4 px-6 py-2 bg-white rounded-xl text-xs font-bold text-academic-navy shadow-sm border border-slate-200"
                >
                  Return Home
                </button>
              </div>
            ) : questions.length === 0 ? (
              <div className="bg-slate-50 text-slate-600 p-8 rounded-3xl border border-slate-100 text-center">
                <p className="font-bold">No questions found for this document. Please generate a quiz from the Chat page.</p>
                <button 
                  onClick={() => navigate('/')} 
                  className="mt-4 px-6 py-2 bg-white rounded-xl text-xs font-bold text-academic-navy shadow-sm border border-slate-200"
                >
                  Go to Chat
                </button>
              </div>
            ) : isFinished ? (
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 md:p-16 text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-academic-navy/5 text-academic-navy rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-academic-navy mb-4">Evaluation Complete</h2>
                <p className="text-slate-600 mb-8 text-lg">
                  You scored <span className="font-bold text-academic-blue">{score}</span> out of {questions.length}
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={handleReset}
                    className="px-8 py-4 bg-academic-navy text-white rounded-xl font-bold uppercase tracking-widest hover:bg-academic-blue transition-all"
                  >
                    Retake Quiz
                  </button>
                  <button 
                    onClick={() => navigate('/')}
                    className="px-8 py-4 bg-slate-50 text-academic-navy rounded-xl font-bold uppercase tracking-widest border border-slate-200 hover:bg-slate-100 transition-all"
                  >
                    Back to Chat
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-12">
                  <div className="flex justify-between items-end mb-4 px-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assessment Progress</span>
                      <span className="text-sm font-bold text-academic-navy">Proposition {currentIdx + 1} of {questions.length}</span>
                    </div>
                    <span className="text-2xl font-serif font-bold text-academic-blue">
                      {Math.round(((currentIdx + 1) / questions.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-white rounded-full overflow-hidden p-0.5 shadow-sm border border-slate-100">
                    <div 
                      className="h-full bg-academic-navy rounded-full transition-all duration-700 relative"
                      style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                    >
                      <div className="absolute top-0 right-0 w-8 h-full bg-white/20 skew-x-12 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-academic-navy/5 overflow-hidden">
                  <div className="p-10 md:p-16">
                    <h2 dir="auto" className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-12 leading-tight text-center max-w-3xl mx-auto">
                      {currentQuestion.question_text}
                    </h2>
                    
                    <div className="grid gap-6">
                      {currentQuestion.options.map((option: string, index: number) => {
                        const isSelected = selectedOption === index;
                        const isCorrect = option === currentQuestion.correct_answer;
                        
                        let optionClass = "border-slate-100 hover:border-academic-blue/30 hover:bg-slate-50/50 text-slate-700";
                        let icon = null;

                        if (isSubmitted) {
                          if (isCorrect) {
                            optionClass = "border-emerald-200 bg-emerald-50/50 text-emerald-900 shadow-lg shadow-emerald-500/5";
                            icon = <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
                          } else if (isSelected && !isCorrect) {
                            optionClass = "border-red-200 bg-red-50/50 text-red-900 opacity-80";
                            icon = <XCircle className="w-6 h-6 text-red-600" />;
                          } else {
                            optionClass = "border-slate-50 text-slate-300 opacity-40 grayscale";
                          }
                        } else if (isSelected) {
                          optionClass = "border-academic-blue bg-academic-blue/5 text-academic-navy shadow-xl shadow-academic-blue/5 ring-1 ring-academic-blue/10";
                        }

                        return (
                          <button
                            key={index}
                            onClick={() => handleOptionSelect(index)}
                            disabled={isSubmitted}
                            className={`w-full text-left p-6 md:p-8 rounded-[2rem] border-2 transition-all flex items-center justify-between gap-6 group ${optionClass}`}
                          >
                            <div className="flex items-center gap-6">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 transition-all ${
                                isSelected && !isSubmitted ? 'bg-academic-blue text-white scale-110 rotate-3' : 
                                isSubmitted && isCorrect ? 'bg-emerald-600 text-white' :
                                isSubmitted && isSelected && !isCorrect ? 'bg-red-600 text-white' :
                                'bg-slate-50 text-slate-400 group-hover:bg-academic-navy group-hover:text-white'
                              }`}>
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span dir="auto" className="text-lg md:text-xl font-serif font-medium leading-relaxed">{option}</span>
                            </div>
                            {icon && <div className="shrink-0 animate-in zoom-in duration-300">{icon}</div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {isSubmitted && (
                    <div className="bg-slate-50/80 backdrop-blur-sm border-t border-slate-100 p-10 md:p-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <div className="flex flex-col md:flex-row items-start gap-8 max-w-4xl mx-auto">
                        <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-lg ${
                          currentQuestion.options[selectedOption!] === currentQuestion.correct_answer ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          <Lightbulb className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <h3 className={`text-2xl font-serif font-bold ${
                              currentQuestion.options[selectedOption!] === currentQuestion.correct_answer ? 'text-emerald-900' : 'text-red-900'
                            }`}>
                              {currentQuestion.options[selectedOption!] === currentQuestion.correct_answer ? 'Exceptional Reasoning' : 'Conceptual Misalignment'}
                            </h3>
                            {currentQuestion.options[selectedOption!] === currentQuestion.correct_answer && (
                              <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                Verified
                              </div>
                            )}
                          </div>
                          <div 
                            dir="auto"
                            className="text-slate-700 leading-relaxed mb-10 text-lg font-medium text-start bg-white p-6 rounded-2xl shadow-sm border border-slate-100/50"
                          >
                            {currentQuestion.explanation}
                          </div>
                          <button 
                            onClick={handleNext}
                            className="w-full sm:w-auto flex items-center justify-center gap-4 bg-academic-navy text-white px-10 py-5 rounded-[1.5rem] text-lg font-bold hover:bg-academic-blue transition-all shadow-2xl shadow-academic-navy/20 hover:-translate-y-1 active:translate-y-0"
                          >
                            {currentIdx < questions.length - 1 ? 'Proceed to Next Inquiry' : 'Complete Evaluation'}
                            <ChevronRight className="w-6 h-6 ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {!isSubmitted && (
                    <div className="bg-slate-50/50 border-t border-slate-100 p-8 md:p-12 flex justify-center">
                      <button
                        onClick={handleSubmit}
                        disabled={selectedOption === null}
                        className={`w-full max-w-md flex items-center justify-center gap-4 py-5 rounded-[1.5rem] text-lg font-bold transition-all shadow-xl ${
                          selectedOption !== null 
                            ? 'bg-academic-navy text-white hover:bg-academic-blue shadow-academic-navy/20 active:scale-95' 
                            : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200 shadow-none'
                        }`}
                      >
                        <ShieldCheck className="w-6 h-6" />
                        Submit Final Rationalization
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            
            <p className="mt-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose max-w-2xl mx-auto">
              This evaluation is generated through heuristic analysis of the provided manuscript. The score reflects current mastery levels of the synthesized material.
            </p>

          </div>
        </main>
      </div>
    </div>
  );
}
