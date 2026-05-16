import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Shield,
  BookOpen,
  Search,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { authService } from "../services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isArabic, setUser } = useAppContext();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = {
    smartStudy: isArabic ? "الدراسة الذكية" : "Smart Study",
    createAccount: isArabic ? "إنشاء حساب" : "Create your account",
    startSmarter: isArabic ? "ابدأ الدراسة بذكاء اليوم" : "Sign up to get started",
    fullName: isArabic ? "الاسم الكامل" : "Full Name",
    namePlaceholder: isArabic ? "أحمد محمد" : "Alex Johnson",
    email: isArabic ? "البريد الإلكتروني" : "Email Address",
    emailPlaceholder: isArabic ? "باحث@الجامعة.edu" : "you@example.com",
    password: isArabic ? "كلمة المرور" : "Password",
    passwordPlaceholder: "••••••••",
    agreeTerms: isArabic ? "أوافق على" : "I agree to the",
    termsOfService: isArabic ? "شروط الخدمة" : "Terms of Service",
    and: isArabic ? "و" : "and",
    privacyPolicy: isArabic ? "سياسة الخصوصية" : "Privacy Policy",
    registering: isArabic ? "جاري التسجيل..." : "Creating account...",
    confirmRegistration: isArabic ? "تأكيد التسجيل" : "Sign Up",
    existingAccount: isArabic ? "لديك حساب بالفعل؟" : "Already have an account?",
    loginPortal: isArabic ? "تسجيل الدخول" : "Log In",
    aiNotes: isArabic ? "ملاحظات مدعومة بالذكاء الاصطناعي" : "AI-powered notes",
    aiNotesDesc: isArabic
      ? "حوّل مواد دراستك إلى ملاحظات منظمة وسهلة المراجعة باستخدام الذكاء الاصطناعي."
      : "Turn your study materials into organized, easy-to-review notes with AI.",
    smartQuizzes: isArabic ? "اختبارات ذكية" : "Smart quizzes",
    smartQuizzesDesc: isArabic
      ? "أنشئ اختبارات مخصصة من ملاحظاتك لاختبار معرفتك."
      : "Generate custom quizzes from your notes to test your knowledge.",
    trackProgress: isArabic ? "تتبع تقدمك" : "Track your progress",
    trackProgressDesc: isArabic
      ? "شاهد كيف تتحسن مع خطوط الدراسة ورؤى الأداء."
      : "See how you're improving with study streaks and performance insights.",
    toolsTitle: isArabic ? "أدوات دراسة ذكية تعمل حقاً" : "Smart study tools that actually work",
    failedRegister: isArabic ? "فشل التسجيل" : "Failed to register",
  };

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  useEffect(() => {
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  }, [isArabic]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const lang = localStorage.getItem("language") || "English";
      const data = await authService.register(username, email, password, lang);
      if (data.user) setUser(data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || t.failedRegister);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cafe-surface flex" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[520px] lg:px-16 xl:px-24 border-r border-slate-200 dark:border-cafe-border-dark bg-white dark:bg-cafe-surface-dark-alt py-12">
        <div className="mx-auto w-full max-w-sm lg:w-full">
          <div
            className="flex items-center gap-3 mb-10 cursor-pointer group"
            onClick={() => navigate("/")}
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
              {t.createAccount}
            </h2>
            <p className="mt-2 mb-2 text-sm text-slate-500 dark:text-cafe-text-dark-muted font-medium tracking-wider">
              {t.startSmarter}
            </p>
          </div>

          <div className="mt-10">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 dark:border-red-900/30 font-medium">
                {error}
              </div>
            )}
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-bold text-slate-500 dark:text-cafe-text-dark-muted uppercase tracking-widest mb-2"
                >
                  {t.fullName}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isArabic ? "end-0 pe-4" : "start-0 ps-4"} flex items-center pointer-events-none`}>
                    <User className="h-5 w-5 text-slate-300" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`block w-full ${isArabic ? "pe-12 ps-4" : "ps-12 pe-4"} py-3.5 border border-slate-200 dark:border-cafe-border-dark rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-cafe-primary-light/5 focus:border-cafe-primary-light transition-all bg-white dark:bg-cafe-surface-dark`}
                    placeholder={t.namePlaceholder}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold text-slate-500 dark:text-cafe-text-dark-muted uppercase tracking-widest mb-2"
                >
                  {t.email}
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
                  {t.password}
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

              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-cafe-primary focus:ring-cafe-primary border-slate-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className={`${isArabic ? "me-2" : "ms-2"} block text-sm text-slate-500 dark:text-cafe-text-dark font-medium cursor-pointer leading-tight`}
                >
                  {t.agreeTerms}{" "}
                  <a
                    href="#"
                    className="font-bold text-blue-600 hover:text-blue-500"
                  >
                    {t.termsOfService}
                  </a>{" "}
                  {t.and}{" "}
                  <a
                    href="#"
                    className="font-bold text-blue-600 hover:text-blue-500"
                  >
                    {t.privacyPolicy}
                  </a>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-4 px-6 border border-transparent rounded-2xl shadow-xl text-lg font-bold text-white bg-cafe-primary hover:bg-cafe-primary-light transition-all hover:shadow-cafe-primary/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? t.registering : t.confirmRegistration}
                  {!loading && <ArrowIcon className="w-5 h-5" />}
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-slate-500 dark:text-cafe-text-dark font-medium">
              {t.existingAccount}{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-bold text-cafe-primary-light hover:text-cafe-primary transition-colors"
              >
                {t.loginPortal}
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative w-0 flex-1 bg-slate-50 dark:bg-cafe-surface-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white dark:from-cafe-surface-dark-alt to-slate-100 dark:to-cafe-surface-dark" />
        <div className="absolute top-0 start-0 w-full h-1 bg-gradient-to-r from-cafe-primary via-cafe-primary-light to-cafe-warning opacity-50"></div>

        <div className="absolute inset-0 flex flex-col justify-center px-16 xl:px-24">
          <div className="max-w-xl">
            <h3 className="text-3xl font-bold text-slate-900 mb-12">
              {t.toolsTitle}
            </h3>

            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-cafe-surface-dark-alt border border-slate-200 dark:border-cafe-border-dark shadow-sm dark:shadow-black/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-cafe-primary-light dark:text-cafe-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cafe-primary dark:text-white mb-2">
                    {t.aiNotes}
                  </h3>
                  <p className="text-slate-500 dark:text-cafe-text-dark leading-relaxed">
                    {t.aiNotesDesc}
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-cafe-surface-dark-alt border border-slate-200 dark:border-cafe-border-dark shadow-sm dark:shadow-black/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-cafe-primary-light dark:text-cafe-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cafe-primary dark:text-white mb-2">
                    {t.smartQuizzes}
                  </h3>
                  <p className="text-slate-500 dark:text-cafe-text-dark leading-relaxed">
                    {t.smartQuizzesDesc}
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-cafe-surface-dark-alt border border-slate-200 dark:border-cafe-border-dark shadow-sm dark:shadow-black/20 flex items-center justify-center">
                  <Search className="w-6 h-6 text-cafe-primary-light dark:text-cafe-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cafe-primary dark:text-white mb-2">
                    {t.trackProgress}
                  </h3>
                  <p className="text-slate-500 dark:text-cafe-text-dark leading-relaxed">
                    {t.trackProgressDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
