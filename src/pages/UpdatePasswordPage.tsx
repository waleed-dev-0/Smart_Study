import { useNavigate, useParams } from "react-router-dom";
import React, { useState } from "react";
import { GraduationCap, Lock, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { authService } from "../services/authService";

export default function UpdatePasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!token) {
      setError("Invalid reset link");
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(token, password);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-academic-paper flex">
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:flex-none lg:w-[480px] lg:px-16 xl:px-24 border-r border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div
            className="flex items-center gap-3 mb-12 cursor-pointer group"
            onClick={() => navigate('/')}
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
              Set New Password
            </h2>
            <p className="mt-3 text-sm text-slate-500 font-medium tracking-wider">
              {isSubmitted
                ? "Your credentials have been securely updated."
                : "Create a new secret key for your academic portal access."}
            </p>
          </div>

          <div className="mt-10">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
                {error}
              </div>
            )}
            
            {!isSubmitted ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2"
                  >
                    New Secret Key
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-300" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full ps-12 pe-4 py-3.5 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-academic-blue/5 focus:border-academic-blue transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2"
                  >
                    Confirm Secret Key
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-300" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full ps-12 pe-4 py-3.5 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-academic-blue/5 focus:border-academic-blue transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 py-4 px-6 border border-transparent rounded-2xl shadow-xl text-lg font-bold text-white bg-academic-navy hover:bg-academic-blue transition-all hover:shadow-academic-navy/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? "Updating..." : "Update Password"}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="p-8 bg-slate-50 border border-slate-200 rounded-3xl text-center shadow-sm">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-academic-navy" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">
                    Password Updated
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Your password has been successfully reset. You can now use your new credentials to access the portal.
                  </p>
                  <div className="mt-8">
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full flex justify-center items-center gap-2 py-3 px-6 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-academic-navy hover:bg-academic-blue transition-all"
                    >
                      Continue to Login
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!isSubmitted && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-academic-navy transition-colors bg-transparent border-none p-0 cursor-pointer"
                  type="button"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Cancel and Return
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative w-0 flex-1 bg-academic-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-academic-navy to-academic-blue opacity-95" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />

        <div className="absolute inset-0 flex flex-col justify-center px-16 xl:px-24">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[2rem] max-w-xl shadow-2xl">
            <h3 className="text-3xl font-serif font-light text-white leading-relaxed mb-6">
              Security Notice
            </h3>
            <p className="text-lg text-slate-300 font-medium leading-relaxed">
              For your protection, this reset link is valid for a single use only. 
              Always ensure you are accessing the legitimate academic portal before 
              entering new credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
