import React from "react";
import { GraduationCap, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage({
  onNavigate,
}: {
  onNavigate: (screen: string) => void;
}) {
  return (
    <div className="min-h-screen bg-academic-paper flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[480px] lg:px-16 xl:px-24 border-r border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div
            className="flex items-center gap-3 mb-8 cursor-pointer group"
            onClick={() => onNavigate("landing")}
          >
            <div className="w-10 h-10 bg-academic-navy rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-serif font-bold text-academic-navy tracking-tight">
              Smart Study
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-serif font-bold text-academic-navy tracking-tight">
              Institutional Access
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-medium uppercase tracking-wider">
              Secure Scholar Authentication
            </p>
          </div>

          <div className="mt-8">
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2"
                >
                  Academic Email
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
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2"
                >
                  Secret Key
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
                    className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-academic-blue/5 focus:border-academic-blue transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-academic-navy focus:ring-academic-navy border-slate-300 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-slate-500 font-medium cursor-pointer"
                  >
                    Stay authenticated
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => onNavigate("reset_password")}
                    className="font-bold text-academic-blue hover:text-academic-navy transition-colors bg-transparent border-none p-0 cursor-pointer"
                  >
                    Reset Credentials
                  </button>
                </div>
              </div>

              <div>
                <button
                  onClick={() => onNavigate("dashboard")}
                  className="w-full flex justify-center items-center gap-2 py-4 px-6 border border-transparent rounded-2xl shadow-xl text-lg font-bold text-white bg-academic-navy hover:bg-academic-blue transition-all hover:shadow-academic-navy/30 active:scale-[0.98]"
                >
                  Enter Portal
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="mt-12 text-center text-sm text-slate-500 font-medium">
              New Research Applicant?{" "}
              <button
                onClick={() => onNavigate("register")}
                className="font-bold text-academic-blue hover:text-academic-navy transition-colors bg-transparent border-none p-0 cursor-pointer"
              >
                Apply for Access
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Academic Image */}
      <div className="hidden lg:block relative w-0 flex-1 bg-academic-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-academic-navy to-academic-blue opacity-95" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />

        <div className="absolute inset-0 flex flex-col justify-center px-16 xl:px-24">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[2rem] max-w-xl shadow-2xl">
            <div className="flex gap-1 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className="w-2 h-2 rounded-full bg-academic-gold/60"
                ></div>
              ))}
            </div>
            <blockquote className="text-3xl font-serif font-light text-white leading-relaxed mb-10 italic">
              "The precision and fidelity of the research synthesis provided by
              this portal is unparalleled. It has become an essential component
              of my doctoral studies."
            </blockquote>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-academic-gold/20 border border-academic-gold/30 flex items-center justify-center text-academic-gold font-bold text-xl uppercase">
                EM
              </div>
              <div>
                <div className="text-white font-bold text-lg">
                  Dr. Elena Moretti
                </div>
                <div className="text-slate-400 text-sm font-medium tracking-wide">
                  University Research Fellow
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
