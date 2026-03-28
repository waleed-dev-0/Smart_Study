import React from 'react';
import Sidebar from './Sidebar';
import { ArrowLeft, Brain, FileText, MessageSquare, Download, Share2, ChevronRight, Zap, Target, BookOpen, ShieldCheck, GraduationCap } from 'lucide-react';

export default function SummaryResultsPage({ onNavigate, isAdmin }: { onNavigate: (screen: string) => void, isAdmin?: boolean }) {
  return (
    <div className="flex min-h-screen bg-academic-paper">
      <Sidebar currentScreen="summary" onNavigate={onNavigate} isAdmin={isAdmin} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-academic-navy/5 flex items-center justify-between px-6 md:px-10 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="p-3 bg-slate-50 hover:bg-academic-navy hover:text-white rounded-xl text-slate-500 transition-all shrink-0 hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="hidden md:block h-10 w-px bg-slate-100"></div>
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="w-12 h-12 bg-academic-blue/5 text-academic-blue rounded-2xl flex items-center justify-center shrink-0 border border-academic-blue/10">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-serif font-bold text-academic-navy leading-tight truncate">Introduction to Machine Learning.pdf</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">24 pages • Synthesized Archive</span>
                  <div className="px-2 py-0.5 rounded-full bg-academic-gold/10 text-academic-gold text-[9px] font-bold border border-academic-gold/20 uppercase tracking-tight">
                    Medium Complexity
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2">
              <button className="p-3 text-slate-400 hover:text-academic-navy hover:bg-slate-50 rounded-xl transition-all">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-3 text-slate-400 hover:text-academic-navy hover:bg-slate-50 rounded-xl transition-all">
                <Download className="w-5 h-5" />
              </button>
            </div>
            <div className="h-10 w-px bg-slate-100 mx-2 hidden lg:block"></div>
            <button 
              onClick={() => onNavigate('chat')}
              className="flex items-center justify-center gap-3 bg-white border border-slate-200 text-academic-navy px-6 py-3.5 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm group"
            >
              <MessageSquare className="w-5 h-5 text-academic-blue" />
              <span className="hidden sm:inline">Semantic Inquiry</span>
            </button>
            <button 
              onClick={() => onNavigate('question_bank')}
              className="flex items-center justify-center gap-3 bg-academic-navy text-white px-6 py-3.5 rounded-2xl text-sm font-bold hover:bg-academic-blue transition-all shadow-xl shadow-academic-navy/20"
            >
              <Brain className="w-5 h-5" />
              <span className="hidden sm:inline">Evaluate Mastery</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-24 md:pb-10">
          <div className="max-w-5xl mx-auto space-y-10">
            
            {/* General Summary */}
            <section className="bg-white rounded-[2.5rem] border border-slate-100 p-10 md:p-14 shadow-2xl shadow-academic-navy/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-academic-navy to-academic-blue"></div>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-academic-navy/5 text-academic-navy rounded-2xl flex items-center justify-center border border-academic-navy/10 transform transition-transform group-hover:scale-110">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-academic-navy">Scholarly Abstract</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Automated Synthesis Overview</p>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed text-xl font-serif italic text-justify">
                "This treatise provides a comprehensive introduction to Machine Learning, delineating fundamental conceptual frameworks, algorithmic structures, and empirical applications. It bifurcates the field into supervised, unsupervised, and reinforcement learning paradigms. The analysis underscores the critical necessity of data preprocessing, feature engineering, and rigorous model evaluation metrics. It concludes with a sophisticated overview of neural architectures and deep learning methodologies."
              </p>
            </section>

            {/* Key Bullet Points */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              <div className="lg:col-span-3 space-y-8">
                <section className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-xl shadow-slate-200/40">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-academic-gold/5 text-academic-gold rounded-2xl flex items-center justify-center border border-academic-gold/10">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-academic-navy">Core Propositions</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Key Research Findings</p>
                    </div>
                  </div>
                  <ul className="space-y-6">
                    {[
                      "Machine Learning constitutes a computational subset of Artificial Intelligence focused on autonomous pattern recognition.",
                      "Supervised learning necessitates labeled datasets, whereas unsupervised learning identifies latent structures in unlabeled data.",
                      "Overfitting represents a failure of generalization, where model parameters align too closely with stochastic noise in training data.",
                      "Cross-validation serves as a foundational rigor for assessing the predictive validity of statistical models.",
                      "Gradient Descent remains the primary optimization methodology for cost function minimization in parametric models."
                    ].map((point, i) => (
                      <li key={i} className="flex items-start gap-6 p-6 rounded-[1.5rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-lg transition-all group">
                        <div className="w-8 h-8 rounded-xl bg-academic-navy text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 group-hover:bg-academic-blue transition-colors">
                          {i + 1}
                        </div>
                        <p className="text-slate-700 leading-relaxed font-medium">{point}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Extracted Definitions */}
              <div className="lg:col-span-2 space-y-8">
                <section className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-xl shadow-slate-200/40 sticky top-32">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-academic-blue/5 text-academic-blue rounded-2xl flex items-center justify-center border border-academic-blue/10">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-academic-navy">Lexicon</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Academic Glossary</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {[
                      { term: "Algorithm", def: "A set of rules or instructions given to an AI, neural network, or other machines to help it learn on its own." },
                      { term: "Feature", def: "An individual measurable property or characteristic of a phenomenon being observed." },
                      { term: "Hyperparameter", def: "A parameter whose value is used to control the learning process, set before the learning process begins." },
                      { term: "Epoch", def: "One complete pass of the training dataset through the algorithm." }
                    ].map((item, i) => (
                      <div key={i} className="p-6 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-academic-blue/20 hover:shadow-xl hover:shadow-academic-navy/5 transition-all group">
                        <h3 className="text-sm font-bold text-academic-blue mb-2 uppercase tracking-widest group-hover:text-academic-navy transition-colors">{item.term}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed font-serif">{item.def}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12 border-t border-slate-100">
              <button 
                onClick={() => onNavigate('chat')}
                className="w-full sm:w-auto flex items-center justify-center gap-4 bg-white border border-slate-200 text-academic-navy px-10 py-5 rounded-[2rem] text-lg font-bold hover:bg-slate-50 hover:border-academic-navy/20 transition-all shadow-sm group"
              >
                <MessageSquare className="w-6 h-6 text-academic-blue group-hover:scale-110 transition-transform" />
                Inquire Further
              </button>
              <button 
                onClick={() => onNavigate('question_bank')}
                className="w-full sm:w-auto flex items-center justify-center gap-4 bg-academic-navy text-white px-10 py-5 rounded-[2rem] text-lg font-bold hover:bg-academic-blue transition-all shadow-2xl shadow-academic-navy/20 hover:-translate-y-1 active:translate-y-0"
              >
                <GraduationCap className="w-6 h-6" />
                Evaluate Mastery
                <ChevronRight className="w-6 h-6 ml-2" />
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
