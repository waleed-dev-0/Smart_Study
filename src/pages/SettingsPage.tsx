import { useNavigate } from "react-router-dom";
import React from 'react';
import Sidebar from "../components/Sidebar";
import { Upload, LogOut, Moon, Sun, Globe, Mail } from 'lucide-react';

export default function SettingsPage({ isAdmin }: { isAdmin?: boolean }) {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentScreen="settings" isAdmin={isAdmin} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shrink-0">
          <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
            
            {/* Profile Picture */}
            <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Avatar Picture</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-blue-700 font-bold text-2xl overflow-hidden shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
                    alt="User Avatar" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                  <Upload className="w-4 h-4" />
                  Change Avatar
                </button>
              </div>
            </div>

            {/* Email Settings */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Email Address</h2>
              <div className="max-w-md">
                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="email" 
                    defaultValue="alex.johnson@university.edu" 
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm transition-shadow" 
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Preferences</h2>
              
              <div className="space-y-6 max-w-md">
                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-slate-400" />
                    </div>
                    <select className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm appearance-none bg-white transition-shadow">
                      <option>English</option>
                      <option>Arabic (العربية)</option>
                      <option>French (Français)</option>
                      <option>Spanish (Español)</option>
                    </select>
                  </div>
                </div>

                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                  <div className="flex items-center gap-4">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-blue-600 bg-blue-50 text-blue-700 rounded-xl font-medium text-sm transition-all">
                      <Sun className="w-4 h-4" />
                      Light
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-medium text-sm transition-all">
                      <Moon className="w-4 h-4" />
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
              <h2 className="text-lg font-bold text-red-600 mb-2">Account Actions</h2>
              <p className="text-sm text-slate-500 mb-4">Log out of your account on this device.</p>
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
