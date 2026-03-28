import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Search, FileText, Calendar, HardDrive, ChevronRight, ArrowLeft, Filter, Library, GraduationCap } from 'lucide-react';

export default function DocumentLibraryPage({ onNavigate, isAdmin }: { onNavigate: (screen: string) => void, isAdmin?: boolean }) {
  const [searchQuery, setSearchQuery] = useState('');

  const documents = [
    { id: 1, title: 'Introduction to Machine Learning.pdf', date: 'Oct 24, 2023', size: '2.4 MB', category: 'Computer Science' },
    { id: 2, title: 'Advanced Data Structures.pdf', date: 'Oct 22, 2023', size: '5.1 MB', category: 'Computer Science' },
    { id: 3, title: 'Calculus III - Chapter 4 Notes.pdf', date: 'Oct 18, 2023', size: '1.2 MB', category: 'Mathematics' },
    { id: 4, title: 'Physics 101 - Mechanics.pdf', date: 'Oct 15, 2023', size: '8.7 MB', category: 'Physics' },
    { id: 5, title: 'History of Modern Europe.pdf', date: 'Oct 10, 2023', size: '3.5 MB', category: 'History' },
    { id: 6, title: 'Biology - Cell Structure.pdf', date: 'Oct 05, 2023', size: '4.2 MB', category: 'Biology' },
    { id: 7, title: 'Macroeconomics Principles.pdf', date: 'Oct 01, 2023', size: '6.1 MB', category: 'Economics' },
    { id: 8, title: 'Organic Chemistry Reactions.pdf', date: 'Sep 28, 2023', size: '3.8 MB', category: 'Chemistry' },
  ];

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-academic-paper">
      <Sidebar currentScreen="dashboard" onNavigate={onNavigate} isAdmin={isAdmin} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-academic-navy/5 flex items-center px-6 md:px-10 shrink-0 z-10 gap-6">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="p-3 bg-slate-50 hover:bg-academic-navy hover:text-white rounded-xl text-slate-500 transition-all shrink-0 hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <Library className="w-6 h-6 text-academic-navy" />
            <h1 className="text-2xl font-serif font-bold text-academic-navy tracking-tight">Scholarly Archive</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-24 md:pb-10">
          <div className="max-w-7xl mx-auto">
            
            <div className="mb-12 flex flex-col sm:flex-row gap-6">
              {/* Search Bar */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-slate-300" />
                </div>
                <input 
                  type="text" 
                  placeholder="Query source materials by nomenclature or classification..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4.5 bg-white border border-slate-200 rounded-[1.5rem] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-academic-blue/5 focus:border-academic-blue shadow-xl shadow-academic-navy/5 transition-all font-medium"
                />
              </div>
              
              <button className="flex items-center justify-center gap-3 px-8 py-4.5 bg-white border border-slate-200 text-academic-navy rounded-[1.5rem] font-bold hover:bg-slate-50 transition-all shadow-xl shadow-academic-navy/5 shrink-0 uppercase tracking-widest text-xs">
                <Filter className="w-4 h-4" />
                Parameter Filter
              </button>
            </div>

            {/* Document Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDocs.map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => onNavigate('chat')}
                  className="bg-white rounded-[2rem] border border-slate-100 p-8 hover:border-academic-blue/20 hover:shadow-2xl hover:shadow-academic-navy/5 transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden shadow-sm"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-academic-blue transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  
                  <div className="flex items-start gap-5 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-academic-blue/5 text-academic-blue flex items-center justify-center shrink-0 border border-academic-blue/10 group-hover:bg-academic-navy group-hover:text-white transition-all transform group-hover:scale-110">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="text-xl font-serif font-bold text-academic-navy truncate group-hover:text-academic-blue transition-colors leading-tight" title={doc.title}>
                        {doc.title}
                      </h3>
                      <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <GraduationCap className="w-3 h-3 text-academic-gold/50" />
                        {doc.category}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <div className="flex items-center gap-5">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-300" />
                          {doc.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <HardDrive className="w-3.5 h-3.5 text-slate-300" />
                          {doc.size}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-academic-blue/10 transition-all">
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-academic-blue transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDocs.length === 0 && (
              <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-slate-200 border-dashed">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-slate-100">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-academic-navy mb-2">No Records Found</h3>
                <p className="text-slate-500 font-medium">Your search query did not correlate with any archives in this repository.</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-8 text-academic-blue font-bold uppercase tracking-widest text-xs hover:text-academic-navy transition-colors"
                >
                  Clear All Parameters
                </button>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
