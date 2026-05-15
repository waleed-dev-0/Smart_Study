import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ArrowLeft, History, Target, TrendingUp, Calendar, ChevronRight, CheckCircle2, XCircle, X } from 'lucide-react';
import api from '../services/api';

export default function QuizHistoryPage({ isAdmin }: { isAdmin?: boolean }) {
  let navigate = useNavigate();
  const [allPastScores, setAllPastScores] = useState<any[]>([]);
  let [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  let [clickedScore, setClickedScore] = useState<any | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      let response = await api.get('/attempts');
      if (response.data.success) {
        setAllPastScores(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load history');
      }
    } catch (err: any) {
      setError('Error loading history.');
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
        alert("Error: " + response.data.message);
      }
    } catch (err: any) {
      alert("Failed to load details");
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

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentScreen="quiz_history" isAdmin={isAdmin} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center px-6 shrink-0 sticky top-0 z-10">
          <button
            onClick={() => navigate('/chat')}
            className="p-2 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg text-slate-500 transition-all mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Quiz History</h1>
            <p className="text-xs text-slate-500">Your Progress</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          <div className="w-full max-w-4xl">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold">Total Quizzes</p>
                  <p className="text-2xl font-bold text-slate-800">{allPastScores.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold">Average Score</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.avg}%</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${stats.progress >= 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-500'}`}>
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold">Progress</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.progress > 0 ? '+' : ''}{stats.progress}%</p>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center text-slate-500 py-10">Loading history...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-10">{error}</div>
            ) : allPastScores.length === 0 ? (
              <div className="text-center text-slate-500 py-10 bg-white rounded-xl border border-slate-200">
                No quiz history found.
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="p-4 text-sm font-bold text-slate-600">Date</th>
                      <th className="p-4 text-sm font-bold text-slate-600">Document</th>
                      <th className="p-4 text-sm font-bold text-slate-600">Score</th>
                      <th className="p-4 text-sm font-bold text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPastScores.map((attempt) => {
                      const percentage = Math.round((attempt.score / attempt.total_questions) * 100);
                      return (
                        <tr key={attempt._id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-4">
                            <span className="text-sm text-slate-700">
                              {new Date(attempt.completedAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="p-4 text-slate-800 font-medium text-sm">
                            {attempt.document_id?.title || 'Unknown'}
                          </td>
                          <td className="p-4">
                            <span className={`text-sm font-bold ${percentage >= 80 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                              {attempt.score} / {attempt.total_questions}
                            </span>
                          </td>
                          <td className="p-4">
                            <button 
                              onClick={() => fetchAttemptDetails(attempt._id)}
                              className="text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {clickedScore && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-lg">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h2 className="text-lg font-bold text-slate-800">Quiz Details</h2>
                <button 
                  onClick={() => setClickedScore(null)}
                  className="text-slate-500 hover:text-red-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                {clickedScore.answers && clickedScore.answers.length > 0 ? (
                  clickedScore.answers.map((answer: any, index: number) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-slate-200">
                      <p className="font-bold text-slate-800 mb-4">{index + 1}. {answer.questionText}</p>
                      
                      <div className="space-y-2">
                        {answer.options?.map((opt: string, i: number) => {
                          let isSelected = answer.selectedAnswer === opt;
                          let isCorrect = answer.correctAnswer === opt;
                          
                          let bgClass = "bg-slate-50 border-slate-200 text-slate-600";
                          if (isCorrect) bgClass = "bg-green-100 border-green-300 text-green-800 font-bold";
                          else if (isSelected && !isCorrect) bgClass = "bg-red-100 border-red-300 text-red-800";

                          return (
                            <div key={i} className={`p-3 rounded border ${bgClass}`}>
                              {opt}
                            </div>
                          );
                        })}
                      </div>

                      {!answer.isCorrect && answer.explanation && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-xs font-bold text-blue-800 mb-1">Explanation:</p>
                          <p className="text-sm text-slate-700">{answer.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-500">No details available.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
