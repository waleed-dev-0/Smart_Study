import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import Sidebar from "../components/Sidebar";
import { ArrowLeft, GraduationCap, ShieldCheck, Calendar, BookOpen, Target, ChevronRight, Award, Trophy, Loader2 } from 'lucide-react';
import api from "../services/api";

export default function AcademicRecordsPage({ isAdmin }: { isAdmin?: boolean }) {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await api.get('/attempts');
        if (response.data.success) {
          setAttempts(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching attempts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  return (
    <div className="flex min-h-screen bg-academic-paper">
      <Sidebar currentScreen="reports" isAdmin={isAdmin} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-academic-navy/5 flex items-center justify-between px-6 md:px-10 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-3 bg-slate-50 hover:bg-academic-navy hover:text-white rounded-xl text-slate-500 transition-all shrink-0 hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="hidden md:block h-10 w-px bg-slate-100"></div>
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 bg-academic-navy text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-academic-navy/10">
                <Award className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-serif font-bold text-academic-navy leading-tight truncate">Academic Achievement Dossier</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Performance Analytics</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-24 md:pb-10 flex flex-col items-center">
          <div className="w-full max-w-5xl">
            
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="w-10 h-10 text-academic-blue animate-spin" />
                <p className="text-sm font-bold text-academic-navy uppercase tracking-widest">Retrieving Records...</p>
              </div>
            ) : attempts.length === 0 ? (
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-16 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6">
                  <Trophy className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-academic-navy mb-4">No Evaluations Found</h2>
                <p className="text-slate-500 mb-8 max-w-sm">Complete your first scholarly evaluation to begin tracking your academic progress.</p>
                <button 
                  onClick={() => navigate('/library')}
                  className="px-8 py-4 bg-academic-navy text-white rounded-xl font-bold uppercase tracking-widest hover:bg-academic-blue transition-all shadow-xl shadow-academic-navy/20"
                >
                  Explore Archives
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {attempts.map((attempt) => (
                  <div key={attempt._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-academic-navy/5 overflow-hidden group hover:border-academic-blue/10 transition-all flex flex-col md:flex-row items-stretch">
                    <div className="p-8 md:w-2/3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="px-3 py-1 bg-academic-navy/5 text-academic-navy rounded-full text-[10px] font-bold uppercase tracking-widest border border-academic-navy/5">
                            Quiz Attempt
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                            attempt.score / attempt.total_questions >= 0.8 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            attempt.score / attempt.total_questions >= 0.5 ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-red-50 text-red-600 border-red-100'
                          }`}>
                            {attempt.difficulty || 'standard'}
                          </div>
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-academic-navy mb-2 group-hover:text-academic-blue transition-colors">
                          {attempt.document_id?.title || "Untitled Document"}
                        </h3>
                        <div className="flex items-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-300" />
                            {new Date(attempt.completedAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-slate-300" />
                            {attempt.total_questions} Propositions
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50/50 md:w-1/3 p-8 border-t md:border-t-0 md:border-l border-slate-100 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-serif font-bold text-academic-navy mb-1">
                          {attempt.score}<span className="text-slate-300 mx-1">/</span>{attempt.total_questions}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mastery Level</div>
                        
                        <div className="mt-4 w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              attempt.score / attempt.total_questions >= 0.8 ? 'bg-emerald-500' :
                              attempt.score / attempt.total_questions >= 0.5 ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${(attempt.score / attempt.total_questions) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}
