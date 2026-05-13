import React, { useState } from 'react';
import { BookOpen, X, Settings2, Loader2, Target, Globe2, Plus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FloatingActionButton({ activeDocId }: { activeDocId: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [language, setLanguage] = useState('English');
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleCreateQuiz = () => {
    if (!activeDocId) {
      alert("Please select or upload a document first.");
      return;
    }
    setIsOpen(false);
    setIsModalOpen(true);
  };

  const handleCreateSummary = () => {
    if (!activeDocId) {
      alert("Please select or upload a document first.");
      return;
    }
    setIsOpen(false);
    navigate('/summary'); // Assuming this is the route for summary generation
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/questions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          documentId: activeDocId,
          difficulty,
          numberOfQuestions: numQuestions,
          language
        })
      });

      const result = await response.json();
      if (result.success) {
        setIsModalOpen(false);
        navigate('/question-bank');
      } else {
        alert("Error generating quiz: " + result.message);
      }
    } catch (error) {
      console.error("Failed to generate quiz", error);
      alert("Failed to generate quiz.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-40 right-8 md:right-12 z-40 flex flex-col items-end gap-3 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Expanded Options */}
        {isOpen && (
          <div className="flex flex-col items-end gap-3 mb-2 animate-in slide-in-from-bottom-4 fade-in duration-200">
            <button
              onClick={handleCreateSummary}
              className="group flex items-center gap-3 px-5 py-2.5 rounded-full shadow-lg bg-white/95 backdrop-blur-sm border border-slate-200 text-academic-navy hover:bg-slate-50 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="font-bold text-sm tracking-wide">Generate Summary</span>
              <div className="w-8 h-8 rounded-full bg-amber-800/10 flex items-center justify-center text-amber-800 group-hover:bg-amber-800 group-hover:text-white transition-colors">
                <FileText className="w-4 h-4" />
              </div>
            </button>
            
            <button
              onClick={handleCreateQuiz}
              className="group flex items-center gap-3 px-5 py-2.5 rounded-full shadow-lg bg-white/95 backdrop-blur-sm border border-slate-200 text-academic-navy hover:bg-slate-50 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="font-bold text-sm tracking-wide">Generate Quiz</span>
              <div className="w-8 h-8 rounded-full bg-amber-800/10 flex items-center justify-center text-amber-800 group-hover:bg-amber-800 group-hover:text-white transition-colors">
                <BookOpen className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}

        {/* Main Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          title="AI Tools"
          className={`group flex items-center justify-center transition-all duration-300 p-2 ${
            isOpen 
              ? 'text-amber-800 hover:scale-95 rotate-45' 
              : 'text-amber-800 hover:-translate-y-1 hover:text-amber-900 drop-shadow-xl'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Plus className="w-10 h-10" strokeWidth={2.5} />
            {!isOpen && (
              <span className="absolute top-0 right-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            )}
          </div>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-academic-navy text-white flex items-center justify-center shadow-sm">
                  <Settings2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-academic-navy text-lg leading-tight">Quiz Configuration</h3>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Academic Assessment</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-academic-navy uppercase tracking-wider">
                  <Target className="w-4 h-4 text-academic-blue" />
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`py-3 rounded-xl text-sm font-bold capitalize transition-all border ${
                        difficulty === level 
                          ? 'bg-academic-navy text-white border-academic-navy shadow-md shadow-academic-navy/20' 
                          : 'bg-white text-slate-500 border-slate-200 hover:border-academic-blue hover:bg-slate-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold text-academic-navy uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-academic-blue" />
                    Number of Questions
                  </label>
                  <span className="text-lg font-serif font-bold text-academic-navy">{numQuestions}</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="25" 
                  value={numQuestions} 
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-academic-blue"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>5 Min</span>
                  <span>25 Max</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-academic-navy uppercase tracking-wider">
                  <Globe2 className="w-4 h-4 text-academic-blue" />
                  Explanation Language
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['English', 'Arabic'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`py-3 rounded-xl text-sm font-bold capitalize transition-all border ${
                        language === lang 
                          ? 'bg-academic-blue text-white border-academic-blue shadow-md shadow-academic-blue/20' 
                          : 'bg-white text-slate-500 border-slate-200 hover:border-academic-blue hover:bg-slate-50'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 rounded-xl bg-academic-navy text-white font-bold text-sm uppercase tracking-wider hover:bg-academic-blue transition-all shadow-lg shadow-academic-navy/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Synthesizing Quiz...
                  </>
                ) : (
                  'Generate Academic Quiz'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
