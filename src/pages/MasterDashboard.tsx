import React, { useState } from 'react';
// Legacy: These modules no longer exist — page is not routed
// import { QuestionList } from '../features/questions/components/QuestionList';
// import { FileUploader } from '../features/upload/components/FileUploader';
// import { FileList } from '../features/upload/components/FileList';
// import { ChatWindow } from '../features/chat/components/ChatWindow';
// import { Card } from '../shared/components/Card';
import { motion } from 'motion/react';
import { BookOpen, Upload, MessageSquare, LayoutDashboard } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'questions' | 'uploads' | 'chat'>('questions');
  const [refreshUploads, setRefreshUploads] = useState(0);

  const tabs = [
    { id: 'questions', label: 'Question Bank', icon: BookOpen },
    { id: 'uploads', label: 'Study Files', icon: Upload },
    { id: 'chat', label: 'Discussions', icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">S</div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Smart Study</h1>
        </div>

        <nav className="space-y-1 flex-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                ${activeTab === tab.id 
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
              `}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="bg-slate-900 rounded-2xl p-4 text-white">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current User</p>
            <p className="font-semibold truncate">Walid_Al_Oumi</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-slate-900 capitalize">{activeTab}</span>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm" />
          </div>
        </header>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'questions' && <p className="text-slate-500">Question Bank (legacy)</p>}
          
          {activeTab === 'uploads' && (
            <div className="max-w-4xl mx-auto">
              <p className="text-slate-500">Study Files (legacy)</p>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="max-w-5xl mx-auto">
              <p className="text-slate-500">Discussions (legacy)</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
