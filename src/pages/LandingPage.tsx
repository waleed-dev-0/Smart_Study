import { useNavigate } from "react-router-dom";
import React from 'react';
import { BookOpen, GraduationCap, FileText, Search, Upload, ShieldCheck, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-academic-paper flex flex-col font-sans">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-academic-navy rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-serif font-bold text-academic-navy tracking-tight">Smart Study</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
            <a href="#" className="hover:text-academic-blue transition-colors">Resources</a>
            <a href="#" className="hover:text-academic-blue transition-colors">Methodology</a>
            <a href="#" className="hover:text-academic-blue transition-colors">Institutional</a>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/login')}
              className="text-sm font-bold text-slate-600 hover:text-academic-navy transition-colors"
            >
              Log In
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="text-sm font-bold bg-academic-blue text-white px-6 py-2.5 rounded-full hover:bg-academic-navy transition-all shadow-lg shadow-academic-blue/20"
            >
              Join Portal
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-32 pb-20 md:pb-40">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-academic-navy/5 text-academic-navy text-xs md:text-sm font-bold mb-8 border border-academic-navy/10 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Academic Research Assistant</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-academic-navy tracking-tight leading-[1.1] mb-8">
              Elevate Your Academic <br className="hidden md:block"/> Research with Precision
            </h1>
            <p className="text-lg md:text-2xl text-slate-600 mb-12 leading-relaxed px-4 md:px-0 max-w-3xl mx-auto font-light italic">
              "Providing students with the analytical tools to transform lecture archives into structured knowledge repositories."
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 px-4 md:px-0">
              <button 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-academic-navy text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-academic-blue transition-all shadow-2xl shadow-academic-navy/30 hover:-translate-y-1"
              >
                Start Researching
                <ChevronRight className="w-6 h-6" />
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="w-full sm:w-auto text-academic-navy font-bold hover:underline"
              >
                View Institutional Overview
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white py-24 border-y border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-academic-blue/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-academic-gold/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="premium-card p-10">
                <div className="w-14 h-14 bg-slate-50 text-academic-navy rounded-2xl flex items-center justify-center mb-8 border border-slate-100 shadow-sm">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-academic-navy mb-4">Structural Analysis</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  Our advanced linguistic algorithms deconstruct academic documents to extract core theorems, definitions, and contextual summaries.
                </p>
              </div>
              
              <div className="premium-card p-10">
                <div className="w-14 h-14 bg-slate-50 text-academic-navy rounded-2xl flex items-center justify-center mb-8 border border-slate-100 shadow-sm">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-academic-navy mb-4">Knowledge Evaluation</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  Generate rigorous examination sets including multiple-choice and critical-thinking prompts tailored to your specific curriculum.
                </p>
              </div>
              
              <div className="premium-card p-10">
                <div className="w-14 h-14 bg-slate-50 text-academic-navy rounded-2xl flex items-center justify-center mb-8 border border-slate-100 shadow-sm">
                  < Search className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-academic-navy mb-4">Interactive Synthesis</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  Engage in high-fidelity synthesis with our research assistant to clarify complex paradigms and verify interdisciplinary connections.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-academic-navy py-20 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-8">Modernizing the Pursuit of Knowledge</h2>
            <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto font-light">
              Join a community of scholars leveraging precision tools to optimize their study workflows and academic performance.
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto bg-white text-academic-navy px-12 py-5 rounded-2xl text-xl font-bold hover:bg-slate-100 transition-all shadow-xl shadow-black/20"
            >
              Request Access
            </button>
          </div>
        </div>
      </main>
      
      <footer className="bg-academic-paper py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm font-medium tracking-wide">© 2024 Smart Study Institutional Portal. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
