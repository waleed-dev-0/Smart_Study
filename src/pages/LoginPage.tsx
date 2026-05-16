import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, FormEvent } from "react";
import { GraduationCap, Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { authService } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isArabic } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = {
    institutionalAccess: isArabic ? "الدخول المؤسسي" : "Welcome Back",
    secureAuth: isArabic ? "توثيق آمن للباحثين" : "Log in to your account",
    academicEmail: isArabic ? "البريد الأكاديمي" : "Email Address",
    emailPlaceholder: isArabic ? "باحث@الجامعة. edu" : "you@example.com",
    secretKey: isArabic ? "المفتاح السري" : "Password",
    passwordPlaceholder: isArabic ? "••••••••" : "••••••••",
    stayAuthenticated: isArabic ? "البقاء مسجلاً" : "Remember me",
    resetCredentials: isArabic ? "إعادة تعيين البيانات" : "Forgot password?",
    authenticating: isArabic ? "جاري التحقق..." : "Logging in...",
    enterPortal: isArabic ? "دخول البوابة" : "Log In",
    newApplicant: isArabic ? "باحث جديد؟" : "Don't have an account?",
    applyForAccess: isArabic ? "طلب الدخول" : "Sign up",
    failedLogin: isArabic ? "فشل تسجيل الدخول" : "Failed to login",
    smartStudy: isArabic ? "الدراسة الذكية" : "Smart Study",
  };

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  }, [isArabic]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || t.failedLogin);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cafe-surface flex" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[560px] lg:px-16 xl:px-24 border-r border-slate-200 dark:border-cafe-surface-dark bg-white dark:bg-cafe-surface-dark-alt shadow-lg shadow-slate-200/30 dark:shadow-black/20">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div
            className="flex items-center gap-3 mb-10 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-cafe-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-cafe-primary dark:text-white tracking-tight">
              {t.smartStudy}
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-display font-bold text-cafe-primary dark:text-white tracking-tight">
              {t.institutionalAccess}
            </h2>
            <p className="mt-2 mb-2 text-sm text-slate-500 dark:text-cafe-text-dark-muted font-medium uppercase tracking-wider">
              {t.secureAuth}
            </p>
          </div>

          <div className="mt-10">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 dark:border-red-900/30 font-medium">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold text-slate-500 dark:text-cafe-text-dark-muted uppercase tracking-widest mb-2"
                >
                  {t.academicEmail}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isArabic ? "end-0 pe-4" : "start-0 ps-4"} flex items-center pointer-events-none`}>
                    <Mail className="h-5 w-5 text-slate-300" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full ${isArabic ? "pe-12 ps-4" : "ps-12 pe-4"} py-3.5 border border-slate-200 dark:border-cafe-border-dark rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-cafe-primary-light/5 focus:border-cafe-primary-light transition-all bg-white dark:bg-cafe-surface-dark`}
                    placeholder={t.emailPlaceholder}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-slate-500 dark:text-cafe-text-dark-muted uppercase tracking-widest mb-2"
                >
                  {t.secretKey}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isArabic ? "end-0 pe-4" : "start-0 ps-4"} flex items-center pointer-events-none`}>
                    <Lock className="h-5 w-5 text-slate-300" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full ${isArabic ? "pe-12 ps-4" : "ps-12 pe-4"} py-3.5 border border-slate-200 dark:border-cafe-border-dark rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-cafe-primary-light/5 focus:border-cafe-primary-light transition-all bg-white dark:bg-cafe-surface-dark`}
                    placeholder={t.passwordPlaceholder}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-cafe-primary focus:ring-cafe-primary border-slate-300 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="remember-me"
                    className={`${isArabic ? "me-2" : "ms-2"} block text-sm text-slate-500 dark:text-cafe-text-dark font-medium cursor-pointer`}
                  >
                    {t.stayAuthenticated}
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => navigate('/reset-password')}
                    className="font-bold text-cafe-primary-light hover:text-cafe-primary transition-colors bg-transparent border-none p-0 cursor-pointer"
                  >
                    {t.resetCredentials}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-4 px-6 border border-transparent rounded-2xl shadow-xl text-lg font-bold text-white bg-cafe-primary hover:bg-cafe-primary-light transition-all hover:shadow-cafe-primary/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? t.authenticating : t.enterPortal}
                  {!loading && <ArrowIcon className="w-5 h-5" />}
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-slate-500 dark:text-cafe-text-dark font-medium">
              {t.newApplicant}{" "}
              <button
                onClick={() => navigate('/register')}
                className="font-bold text-cafe-primary-light hover:text-cafe-primary transition-colors bg-transparent border-none p-0 cursor-pointer"
              >
                {t.applyForAccess}
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative w-0 flex-1 bg-cafe-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cafe-primary to-cafe-primary-light opacity-95" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />

        <div className="absolute inset-0 flex flex-col justify-center px-16 xl:px-24 gap-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] max-w-xl shadow-2xl">
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className="w-2 h-2 rounded-full bg-cafe-warning/60"
                ></div>
              ))}
            </div>
            <blockquote className="text-2xl font-display font-light text-white leading-relaxed mb-8 italic">
              {isArabic
                ? '"دقة وإتقان التوليف البحثي الذي توفره هذه البوابة لا مثيل له. لقد أصبحت جزءاً أساسياً من دراساتي الدكتوراه."'
                : '"The precision and fidelity of the research synthesis provided by this portal is unparalleled. It has become an essential component of my doctoral studies."'}
            </blockquote>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-cafe-warning/20 border border-cafe-warning/30 flex items-center justify-center text-cafe-warning font-bold text-xl uppercase">
                EM
              </div>
              <div>
                <div className="text-white font-bold text-lg">
                  {isArabic ? "د. إلينا موريتي" : "Dr. Elena Moretti"}
                </div>
                <div className="text-slate-400 text-sm font-medium tracking-wide">
                  {isArabic ? "زميل أبحاث جامعي" : "University Research Fellow"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
