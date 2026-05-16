import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import {
  GraduationCap,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Brain,
  Zap,
  BarChart3,
  Mail,
  Heart,
  Github,
  Twitter,
  Shield,
  Clock,
  FileText,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import Logo from "../components/Logo";

const team = [
  {
    name: "Ahmad Hannani",
    image: "/images/man.png",
  },
  {
    name: "Waleed Younis",
    image: "/images/man.png",
  },
  {
    name: "Tamara hisham",
    image: "/images/girl.png",
  },

  {
    name: "Hussam Al Sharif",
    image: "/images/man.png",
  },
  {
    name: "Yazan Naseer",
    image: "/images/dev1.jpg",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isArabic } = useAppContext();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      const el = document.getElementById(state.scrollTo);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const t = {
    smartStudy: isArabic ? "الدراسة الذكية" : "Smart Study",
    heroTitle: isArabic
      ? "ادرس بذكاء.\nوتعلم بشكل أسرع."
      : "Study Smarter.\nLearn Faster.",
    heroDesc: isArabic
      ? "حول محاضراتك إلى اختبارات تفاعلية وملخصات ذكية وأدلة دراسة — كلها مدعومة بالذكاء الاصطناعي."
      : "Turn your lectures into interactive quizzes, smart summaries, and study guides — all powered by AI.",
    startFree: isArabic ? "ابدأ مجاناً" : "Get Started Free",
    learnMore: isArabic ? "اعرف المزيد" : "Learn More",
    aiPowered: isArabic ? "مدعوم بالذكاء الاصطناعي" : "AI-Powered",
    securePrivate: isArabic ? "آمن وخاص" : "Secure & Private",
    saveTime: isArabic ? "وفر وقتك" : "Save Time",
    smartSummary: isArabic ? "ملخص ذكي" : "Smart Summary",
    quiz: isArabic ? "اختبار" : "Quiz",
    studyGuide: isArabic ? "دليل دراسة" : "Study Guide",
    downloadPdf: isArabic ? "تحميل PDF" : "Download PDF",
    score85: isArabic ? "85% نتيجة" : "85% Score",
    startNow: isArabic ? "ابدأ الآن" : "Start Now",
    feature1Title: isArabic ? "ملاحظات ذكية" : "Smart Notes",
    feature1Desc: isArabic
      ? "ارفع ملفاتك ودع الذكاء الاصطناعي يحولها إلى ملاحظات منظمة وسهلة القراءة."
      : "Upload your files and let AI turn them into clean, organized notes instantly.",
    feature2Title: isArabic ? "اختبارات تفاعلية" : "Interactive Quizzes",
    feature2Desc: isArabic
      ? "اختبر نفسك بأسئلة من إنشاء الذكاء الاصطناعي مبنية على محاضراتك."
      : "Test yourself with AI-generated questions based on your own materials.",
    feature3Title: isArabic ? "تتبع تقدمك" : "Track Progress",
    feature3Desc: isArabic
      ? "شاهد أداءك وتحسن بمرور الوقت مع إحصائيات وتقارير مبسطة."
      : "See your performance improve over time with simple stats and reports.",
    ctaTitle: isArabic ? "مستعد لتبدأ رحلتك؟" : "Ready to start?",
    ctaDesc: isArabic
      ? "انضم إلى آلاف الطلاب الذين يستخدمون الدراسة الذكية للتفوق في دراستهم."
      : "Join thousands of students already studying smarter with AI.",
    createAccount: isArabic ? "إنشاء حساب مجاني" : "Create Free Account",
    footerTagline: isArabic
      ? "ادرس بذكاء، وليس بجهد."
      : "Study smarter, not harder.",
    aboutUs: isArabic ? "من نحن" : "About Us",
    features: isArabic ? "المميزات" : "Features",
    contact: isArabic ? "تواصل معنا" : "Contact",
    privacy: isArabic ? "سياسة الخصوصية" : "Privacy Policy",
    terms: isArabic ? "الشروط والأحكام" : "Terms of Service",
    copyright: isArabic
      ? "© 2024 الدراسة الذكية. جميع الحقوق محفوظة."
      : "© 2024 Smart Study. All rights reserved.",
    legal: isArabic ? "القانوني" : "Legal",
    madeWith: isArabic ? "صُنع بحب للطلاب" : "Made with love for students",
    aboutTitle: isArabic ? "قصة الدراسة الذكية" : "About Us",
    aboutDesc: isArabic
      ? "منصة تعليمية ذكية تحول موادك الدراسية إلى اختبارات وملخصات تفاعلية. نؤمن أن التعلم يجب أن يكون أذكى، لا أصعب."
      : "Smart Study is an AI-powered platform that turns your materials into interactive quizzes and summaries. We believe learning should be smarter, not harder.",
    aboutTeam: isArabic ? "فريق التطوير" : "Our Team",
    missionTitle: isArabic ? "رسالتنا" : "Our Mission",
    missionDesc: isArabic
      ? "نبني أدوات ذكية تخفف عناء الدراسة وتساعد الطلاب على الفهم بشكل أسرع وأعمق."
      : "We build simple tools that make studying less stressful and more effective.",
    visionTitle: isArabic ? "رؤيتنا" : "Our Vision",
    visionDesc: isArabic
      ? "عالم يتعلم فيه كل طالب بالطريقة التي تناسبه، مدعوماً بالذكاء الاصطناعي."
      : "A world where every student can learn at their own pace, supported by AI.",
  };

  const ChevronIcon = isArabic ? ChevronLeft : ChevronRight;

  return (
    <div
      className="min-h-screen bg-cafe-surface dark:bg-cafe-surface-dark flex flex-col font-sans"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <main className="flex-1">
        <section id="resources" className="relative overflow-hidden bg-cafe-surface dark:bg-cafe-surface-dark">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cafe-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-16 pb-0">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className={isArabic ? "order-2 lg:order-1" : "order-1"}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cafe-primary/10 dark:bg-cafe-primary-light/10 text-cafe-primary dark:text-cafe-primary-light text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{t.startNow}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-cafe-primary dark:text-white tracking-tight leading-[1.1] mb-4 sm:mb-6">
                  {t.heroTitle.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i === 0 && <br />}
                    </React.Fragment>
                  ))}
                </h1>

                <p className="text-sm sm:text-base md:text-lg text-slate-500 dark:text-cafe-text-dark-muted mb-6 sm:mb-8 leading-relaxed max-w-lg">
                  {t.heroDesc}
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <button
                    onClick={() => navigate("/register")}
                    className="inline-flex items-center justify-center gap-2 bg-cafe-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-sm sm:text-base font-bold hover:bg-cafe-primary-light transition-all shadow-lg shadow-cafe-primary/25"
                  >
                    {t.startFree}
                    <ChevronIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="inline-flex items-center justify-center gap-2 bg-white dark:bg-cafe-surface-dark-alt text-cafe-primary dark:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-sm sm:text-base font-bold border border-cafe-secondary/50 dark:border-cafe-border-dark hover:bg-cafe-surface dark:hover:bg-cafe-surface-dark transition-all shadow-sm dark:shadow-black/20"
                  >
                    {t.learnMore}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500 dark:text-cafe-text-dark-muted">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-cafe-primary/60" />
                    <span className="text-xs sm:text-sm font-medium">{t.aiPowered}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500 dark:text-cafe-text-dark-muted">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-cafe-primary/60" />
                    <span className="text-xs sm:text-sm font-medium">{t.securePrivate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500 dark:text-cafe-text-dark-muted">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-cafe-primary/60" />
                    <span className="text-xs sm:text-sm font-medium">{t.saveTime}</span>
                  </div>
                </div>
              </div>

              <div className={isArabic ? "order-1 lg:order-2" : "order-2"}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cafe-primary/10 to-transparent rounded-3xl blur-3xl scale-110" />
                  
                  <div className="relative">
                    <img
                      src="/images/hero-student.png"
                      alt="Student studying"
                      className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto"
                    />

                    <div className={`hidden sm:block absolute -top-2 ${isArabic ? 'left-4' : 'right-4'} bg-white dark:bg-cafe-surface-dark-alt rounded-2xl p-3 sm:p-4 shadow-xl dark:shadow-black/20 border border-slate-100 dark:border-cafe-border-dark animate-float`}>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">{t.smartSummary}</p>
                          <div className="flex gap-1 mt-1">
                            <div className="h-1 sm:h-1.5 w-10 sm:w-16 bg-slate-200 dark:bg-cafe-border-dark rounded-full" />
                            <div className="h-1 sm:h-1.5 w-6 sm:w-10 bg-slate-200 dark:bg-cafe-border-dark rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`hidden sm:block absolute top-16 ${isArabic ? 'right-4' : 'left-4'} bg-white dark:bg-cafe-surface-dark-alt rounded-2xl p-3 sm:p-4 shadow-xl dark:shadow-black/20 border border-slate-100 dark:border-cafe-border-dark animate-float-delayed`}>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">{t.quiz}</p>
                          <div className="flex gap-1 mt-1">
                            <div className="h-1 sm:h-1.5 w-8 sm:w-12 bg-slate-200 dark:bg-cafe-border-dark rounded-full" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-1 sm:mt-2 inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-50 dark:bg-green-900/30 rounded-lg">
                        <span className="text-[10px] sm:text-xs font-semibold text-green-700 dark:text-green-400">{t.score85}</span>
                      </div>
                    </div>

                    <div className={`hidden sm:block absolute bottom-12 ${isArabic ? 'left-8' : 'right-8'} bg-white dark:bg-cafe-surface-dark-alt rounded-2xl p-3 sm:p-4 shadow-xl dark:shadow-black/20 border border-slate-100 dark:border-cafe-border-dark animate-float`}>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">{t.studyGuide}</p>
                          <div className="flex gap-1 mt-1">
                            <div className="h-1 sm:h-1.5 w-10 sm:w-14 bg-slate-200 dark:bg-cafe-border-dark rounded-full" />
                            <div className="h-1 sm:h-1.5 w-5 sm:w-8 bg-slate-200 dark:bg-cafe-border-dark rounded-full" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-1 sm:mt-2 inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                        <span className="text-[10px] sm:text-xs font-semibold text-purple-700 dark:text-purple-400">{t.downloadPdf}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
              <path d="M0 20C480 60 960 60 1440 20V60H0V20Z" fill="white" className="dark:fill-cafe-surface-dark"/>
            </svg>
          </div>
        </section>

        <section
          id="methodology"
          className="bg-white dark:bg-cafe-surface-dark py-12 sm:py-16 md:py-20 lg:py-28 border-t border-cafe-secondary/60 dark:border-cafe-border-dark"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-cafe-primary dark:text-white mb-3 sm:mb-4">
                {t.features}
              </h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-cafe-text-dark-muted max-w-xl mx-auto">{t.heroDesc}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="group bg-cafe-surface dark:bg-cafe-surface-dark-alt rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-cafe-secondary/60 dark:border-cafe-border-dark hover:border-cafe-primary/20 dark:hover:border-cafe-border-dark/50 hover:shadow-lg dark:shadow-black/20 hover:shadow-cafe-primary/5 transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cafe-primary/10 dark:bg-cafe-primary-light/10 text-cafe-primary dark:text-cafe-primary-light rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-cafe-primary dark:text-white mb-2 sm:mb-3">
                  {t.feature1Title}
                </h3>
                <p className="text-sm sm:text-base text-slate-500 dark:text-cafe-text-dark-muted leading-relaxed">
                  {t.feature1Desc}
                </p>
              </div>

              <div className="group bg-cafe-surface dark:bg-cafe-surface-dark-alt rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-cafe-secondary/60 dark:border-cafe-border-dark hover:border-cafe-primary/20 dark:hover:border-cafe-border-dark/50 hover:shadow-lg dark:shadow-black/20 hover:shadow-cafe-primary/5 transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cafe-primary/10 dark:bg-cafe-primary-light/10 text-cafe-primary dark:text-cafe-primary-light rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-cafe-primary dark:text-white mb-2 sm:mb-3">
                  {t.feature2Title}
                </h3>
                <p className="text-sm sm:text-base text-slate-500 dark:text-cafe-text-dark-muted leading-relaxed">
                  {t.feature2Desc}
                </p>
              </div>

              <div className="group bg-cafe-surface dark:bg-cafe-surface-dark-alt rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-cafe-secondary/60 dark:border-cafe-border-dark hover:border-cafe-primary/20 dark:hover:border-cafe-border-dark/50 hover:shadow-lg dark:shadow-black/20 hover:shadow-cafe-primary/5 transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cafe-primary/10 dark:bg-cafe-primary-light/10 text-cafe-primary dark:text-cafe-primary-light rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-cafe-primary dark:text-white mb-2 sm:mb-3">
                  {t.feature3Title}
                </h3>
                <p className="text-sm sm:text-base text-slate-500 dark:text-cafe-text-dark-muted leading-relaxed">
                  {t.feature3Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="py-12 sm:py-16 md:py-20 lg:py-28 bg-cafe-surface dark:bg-cafe-surface-dark border-t border-cafe-secondary/60 dark:border-cafe-border-dark"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-[10px] font-bold text-cafe-warning uppercase tracking-widest mb-3 sm:mb-4 block">
                {isArabic ? "من نحن" : "ABOUT US"}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-cafe-primary dark:text-white mb-3 sm:mb-4">
                {t.aboutTitle}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-slate-500 dark:text-cafe-text-dark-muted max-w-3xl mx-auto leading-relaxed">
                {t.aboutDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-20 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-cafe-surface-dark-alt rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-cafe-secondary/60 dark:border-cafe-border-dark hover:shadow-lg dark:shadow-black/20 hover:shadow-cafe-primary/5 transition-all">
                <h4 className="text-base sm:text-lg font-display font-bold text-cafe-primary dark:text-white mb-2 sm:mb-3">
                  {t.missionTitle}
                </h4>
                <p className="text-sm sm:text-base text-slate-500 dark:text-cafe-text-dark-muted leading-relaxed">
                  {t.missionDesc}
                </p>
              </div>
              <div className="bg-white dark:bg-cafe-surface-dark-alt rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-cafe-secondary/60 dark:border-cafe-border-dark hover:shadow-lg dark:shadow-black/20 hover:shadow-cafe-primary/5 transition-all">
                <h4 className="text-base sm:text-lg font-display font-bold text-cafe-primary dark:text-white mb-2 sm:mb-3">
                  {t.visionTitle}
                </h4>
                <p className="text-sm sm:text-base text-slate-500 dark:text-cafe-text-dark-muted leading-relaxed">
                  {t.visionDesc}
                </p>
              </div>
            </div>

            <div className="text-center mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-cafe-primary dark:text-white mb-2 sm:mb-3">
                {t.aboutTeam}
              </h3>
              <div className="w-10 sm:w-12 h-1 bg-cafe-warning mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden ring-2 ring-cafe-secondary/40 dark:ring-cafe-border-dark ring-offset-2 dark:ring-offset-cafe-surface-dark group-hover:ring-cafe-warning/60 transition-all">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="text-xs sm:text-sm font-display font-bold text-cafe-primary dark:text-white">
                    {member.name}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="institutional"
          className="py-12 sm:py-16 md:py-20 lg:py-28 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cafe-primary to-cafe-primary-dark" />
          <div className="absolute top-0 right-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-white/5 rounded-full -mr-24 sm:-mr-36 md:-mr-48 -mt-24 sm:-mt-36 md:-mt-48 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-white/5 rounded-full -ml-24 sm:-ml-36 md:-ml-48 -mb-24 sm:-mb-36 md:-mb-48 blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 sm:mb-6 leading-tight">
              {t.ctaTitle}
            </h2>
            <p className="text-cafe-secondary text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
              {t.ctaDesc}
            </p>
            <button
              onClick={() => navigate("/register")}
              className="inline-flex items-center gap-2 bg-white text-cafe-primary px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-2xl text-sm sm:text-base md:text-lg font-bold hover:bg-cafe-secondary transition-all shadow-xl shadow-black/20"
            >
              {t.createAccount}
              <ChevronIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-cafe-primary-dark border-t border-cafe-primary/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 sm:gap-10">
            <div className="sm:col-span-1">
               <div className="flex items-center gap-3 mb-3 sm:mb-4">
                 <Logo className="w-9 h-9" />
                 <span className="text-lg sm:text-xl font-display font-bold text-white">
                   {t.smartStudy}
                 </span>
               </div>
              <p className="text-cafe-secondary/70 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                {t.footerTagline}
              </p>
              <p className="text-cafe-secondary/50 text-xs">
                {t.madeWith} <Heart className="w-3 h-3 inline text-red-400" />
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                {t.aboutUs}
              </h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() =>
                      document
                        .getElementById("about")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-cafe-secondary/70 hover:text-white text-sm transition-colors bg-transparent border-none p-0 cursor-pointer"
                  >
                    {t.aboutUs}
                  </button>
                </li>
                <li>
                  <a
                    href="#methodology"
                    className="text-cafe-secondary/70 hover:text-white text-sm transition-colors"
                  >
                    {t.features}
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/register")}
                    className="text-cafe-secondary/70 hover:text-white text-sm transition-colors bg-transparent border-none p-0 cursor-pointer"
                  >
                    {t.startFree}
                  </button>
                </li>
              </ul>
            </div>


          </div>
        </div>

        <div className="border-t border-cafe-primary/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-cafe-secondary/50 text-xs">&copy; 2026 Smart Study. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
