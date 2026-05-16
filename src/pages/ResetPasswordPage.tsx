import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { GraduationCap, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { authService } from "../services/authService";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { isArabic } = useAppContext();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = {
    smartStudy: isArabic ? "الدراسة الذكية" : "Smart Study",
    resetCredentials: isArabic ? "إعادة تعيين البيانات" : "Reset Credentials",
    emailSent: isArabic
      ? "تحقق من بريدك المؤسسي للحصول على رابط الاسترداد."
      : "Check your institutional email for the recovery link.",
    enterEmail: isArabic
      ? "أدخل بريدك المؤسسي لاستعادة الدخول."
      : "Enter your institutional email to recover access.",
    academicEmail: isArabic ? "البريد الأكاديمي" : "Academic Email",
    emailPlaceholder: isArabic ? "باحث@الجامعة.edu" : "scholar@university.edu",
    sending: isArabic ? "جاري الإرسال..." : "Sending...",
    sendRecovery: isArabic ? "إرسال رابط الاسترداد" : "Send Recovery Link",
    instructionsSent: isArabic ? "تم إرسال التعليمات" : "Instructions Sent",
    instructionsDesc: isArabic
      ? "لقد أرسلنا رابطًا آمنًا إلى بريدك الأكاديمي. يرجى التحقق من صندوق الوارد واتباع التعليمات لإعادة تعيين كلمة المرور."
      : "We've sent a secure link to your academic email address. Please check your inbox and follow the instructions to reset your password.",
    returnLogin: isArabic ? "العودة لتسجيل الدخول المؤسسي" : "Return to Institutional Login",
    secureRecovery: isArabic ? "استرداد الأصول الآمنة" : "Secure Asset Recovery",
    securityNotice: isArabic
      ? "تتطلب بروتوكولات الأمان المؤسسي التحقق اليدوي لإعادة تعيين البيانات. إذا فقدت الوصول إلى بريدك الأكاديمي، يرجى الاتصال بخدمات تكنولوجيا المعلومات مباشرة."
      : "Institutional security protocols require manual verification for credential resets. If you have lost access to your academic email, please contact IT services directly.",
    failedSend: isArabic ? "فشل إرسال رابط إعادة التعيين" : "Failed to send reset link",
  };

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  useEffect(() => {
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [isArabic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || t.failedSend);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cafe-surface flex" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[480px] lg:px-16 xl:px-24 border-r border-slate-200 dark:border-cafe-surface-dark bg-white py-8 sm:py-12">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div
            className="flex items-center gap-3 mb-10 sm:mb-12 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-cafe-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-display font-bold text-cafe-primary tracking-tight">
              {t.smartStudy}
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-cafe-primary tracking-tight">
              {t.resetCredentials}
            </h2>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-500 font-medium tracking-wider">
              {isSubmitted ? t.emailSent : t.enterEmail}
            </p>
          </div>

          <div className="mt-8 sm:mt-10">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 dark:border-red-900/30 font-medium">
                {error}
              </div>
            )}

            {!isSubmitted ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2"
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
                      className={`block w-full ${isArabic ? "pe-12 ps-4" : "ps-12 pe-4"} py-3.5 border border-slate-200 dark:border-cafe-surface-dark rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-cafe-primary-light/5 focus:border-cafe-primary-light transition-all bg-white`}
                      placeholder={t.emailPlaceholder}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 py-4 px-6 border border-transparent rounded-2xl shadow-xl text-lg font-bold text-white bg-cafe-primary hover:bg-cafe-primary-light transition-all hover:shadow-cafe-primary/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? t.sending : t.sendRecovery}
                    {!loading && <ArrowIcon className="w-5 h-5" />}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="p-6 sm:p-8 bg-slate-50 border border-slate-200 dark:border-cafe-surface-dark rounded-2xl sm:rounded-3xl text-center shadow-sm">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl shadow-sm border border-slate-100 dark:border-cafe-surface-dark flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-cafe-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 mb-2 sm:mb-3">
                    {t.instructionsSent}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {t.instructionsDesc}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-10 sm:mt-12 text-center">
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-cafe-primary transition-colors bg-transparent border-none p-0 cursor-pointer"
                type="button"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.returnLogin}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative w-0 flex-1 bg-cafe-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cafe-primary to-cafe-primary-light opacity-95" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />

        <div className="absolute inset-0 flex flex-col justify-center px-16 xl:px-24">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-12 rounded-[2rem] max-w-xl shadow-2xl">
            <h3 className="text-xl sm:text-3xl font-display font-light text-white leading-relaxed mb-4 sm:mb-6">
              {t.secureRecovery}
            </h3>
            <p className="text-sm sm:text-lg text-slate-300 font-medium leading-relaxed">
              {t.securityNotice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
