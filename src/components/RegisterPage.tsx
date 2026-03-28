import React from 'react';
import { GraduationCap, Mail, Lock, User, Building, ArrowRight, Shield, BookOpen, Search } from 'lucide-react';

export default function RegisterPage({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <div className="min-h-screen bg-academic-paper flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[520px] lg:px-16 xl:px-24 border-r border-slate-200 bg-white py-12">
        <div className="mx-auto w-full max-w-sm lg:w-full">
          <div className="flex items-center gap-3 mb-10 cursor-pointer group" onClick={() => onNavigate('landing')}>
            <div className="w-10 h-10 bg-academic-navy rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-serif font-bold text-academic-navy tracking-tight">Smart Study</span>
          </div>

          <div>
            <h2 className="text-3xl font-serif font-bold text-academic-navy tracking-tight">Access Application</h2>
            <p className="mt-3 text-sm text-slate-500 font-medium uppercase tracking-wider">
              Scholar Registration Portal
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-300" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-academic-blue/5 focus:border-academic-blue transition-all"
                    placeholder="Alex Johnson"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="university" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Institution
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-slate-300" />
                  </div>
                  <input
                    id="university"
                    name="university"
                    type="text"
                    required
                    className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-academic-blue/5 focus:border-academic-blue transition-all"
                    placeholder="University of Excellence"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Institutional Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-300" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-academic-blue/5 focus:border-academic-blue transition-all"
                    placeholder="scholar@university.edu"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Portal Key
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-300" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-300 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-academic-blue/5 focus:border-academic-blue transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-academic-navy focus:ring-academic-navy border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="terms" className="ml-2 block text-xs text-slate-500 font-medium">
                  I adhere to the{' '}
                  <a href="#" className="font-bold text-academic-blue hover:text-academic-navy">Research Integrity Policy</a>
                </label>
              </div>

              <div>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full flex justify-center items-center gap-2 py-4 px-6 border border-transparent rounded-2xl shadow-xl text-lg font-bold text-white bg-academic-navy hover:bg-academic-blue transition-all hover:shadow-academic-navy/30 active:scale-[0.98]"
                >
                  Confirm Registration
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-white text-slate-400 font-bold uppercase tracking-widest">Federated Access</span>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <button className="w-full inline-flex justify-center py-3.5 px-4 border border-slate-200 rounded-2xl bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                  Google Scholar
                </button>
                <button className="w-full inline-flex justify-center py-3.5 px-4 border border-slate-200 rounded-2xl bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                  ORCID
                </button>
              </div>
            </div>
            
            <p className="mt-10 text-center text-sm text-slate-500 font-medium">
              Already have an account?{' '}
              <button onClick={() => onNavigate('login')} className="font-bold text-academic-blue hover:text-academic-navy transition-colors">
                Log in to Portal
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:block relative w-0 flex-1 bg-slate-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-100" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-academic-navy via-academic-blue to-academic-gold opacity-50"></div>
        
        <div className="absolute inset-0 flex flex-col justify-center px-16 xl:px-24">
          <div className="max-w-xl">
            <h3 className="text-4xl font-serif font-bold text-academic-navy mb-12">
              Advanced Tools for Contemporary Scholars
            </h3>
            
            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-academic-blue/5 text-academic-blue flex items-center justify-center shrink-0 border border-academic-blue/10">
                  <Shield className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-serif font-bold text-academic-navy mb-2">Research Integrity</h4>
                  <p className="text-slate-600 leading-relaxed font-light">Secure, encrypted repositories for your lecture archives and personal research notes.</p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-academic-gold/5 text-academic-gold flex items-center justify-center shrink-0 border border-academic-gold/10">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-serif font-bold text-academic-navy mb-2">Evaluation Module</h4>
                  <p className="text-slate-600 leading-relaxed font-light">Generate comprehensive assessment sets to verify your understanding of complex curricula.</p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-academic-navy/5 text-academic-navy flex items-center justify-center shrink-0 border border-academic-navy/10">
                  <Search className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-serif font-bold text-academic-navy mb-2">Semantic Inquiry</h4>
                  <p className="text-slate-600 leading-relaxed font-light">Interact with your documents through advanced semantic querying and cited synthesis.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
