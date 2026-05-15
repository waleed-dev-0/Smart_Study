import { useNavigate } from "react-router-dom";
import React from 'react';
import { BookOpen, GraduationCap, FileText, Search, Upload, ShieldCheck, ChevronRight, ChevronLeft, Globe } from 'lucide-react';
import { useAppContext } from "../context/AppContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isArabic, updateLanguage } = useAppContext();

  const t = {
    smartStudy: isArabic ? "الدراسة الذكية" : "Smart Study",
    resources: isArabic ? "المصادر" : "Resources",
    methodology: isArabic ? "المنهجية" : "Methodology",
    institutional: isArabic ? "المؤسسي" : "Institutional",
    logIn: isArabic ? "تسجيل الدخول" : "Log In",
    joinPortal: isArabic ? "انضم للبوابة" : "Join Portal",
    certifiedAssistant: isArabic ? "مساعد بحث أكاديمي معتمد" : "Certified Academic Research Assistant",
    heroTitle: isArabic ? "ارتقِ ببحثك الأكاديمي\nبدقة متناهية" : "Elevate Your Academic\nResearch with Precision",
    heroDesc: isArabic ? '"تزويد الطلاب بالأدوات التحليلية لتحويل محاضراتهم إلى مستودعات معرفية منظمة."' : '"Providing students with the analytical tools to transform lecture archives into structured knowledge repositories."',
    startResearching: isArabic ? "ابدأ البحث" : "Start Researching",
    viewOverview: isArabic ? "عرض النظرة المؤسسية" : "View Institutional Overview",
    structuralAnalysis: isArabic ? "التحليل الهيكلي" : "Structural Analysis",
    structuralDesc: isArabic ? "تقوم خوارزمياتنا اللغوية المتطورة بتفكيك المستندات الأكاديمية لاستخراج النظريات والتعريفات والملخصات السياقية الأساسية." : "Our advanced linguistic algorithms deconstruct academic documents to extract core theorems, definitions, and contextual summaries.",
    knowledgeEvaluation: isArabic ? "تقييم المعرفة" : "Knowledge Evaluation",
    knowledgeDesc: isArabic ? "قم بإنشاء مجموعات اختبار صارمة تشمل أسئلة الاختيار من متعدد والتفكير النقدي المصممة خصيصاً لمنهجك الدراسي." : "Generate rigorous examination sets including multiple-choice and critical-thinking prompts tailored to your specific curriculum.",
    interactiveSynthesis: isArabic ? "التوليف التفاعلي" : "Interactive Synthesis",
    synthesisDesc: isArabic ? "تفاعل مع مساعد البحث لديك بتوليف عالي الدقة لتوضيح النماذج المعقدة والتحقق من الروابط متعددة التخصصات." : "Engage in high-fidelity synthesis with our research assistant to clarify complex paradigms and verify interdisciplinary connections.",
    modernizing: isArabic ? "تحديث مسعى المعرفة" : "Modernizing the Pursuit of Knowledge",
    modernizingDesc: isArabic ? "انضم إلى مجتمع من الباحثين يستخدمون أدوات دقيقة لتحسين سير عملهم الدراسي وأدائهم الأكاديمي." : "Join a community of scholars leveraging precision tools to optimize their study workflows and academic performance.",
    requestAccess: isArabic ? "طلب الدخول" : "Request Access",
    footerDesc: isArabic ? "مساعد بحث أكاديمي معتمد" : "Certified Academic Research Assistant",
    copyright: isArabic ? "© 2024 بوابة الدراسة الذكية المؤسسية. جميع الحقوق محفوظة." : "© 2024 Smart Study Institutional Portal. All Rights Reserved.",
  };

  const ChevronIcon = isArabic ? ChevronLeft : ChevronRight;

  return (
    <div className="min-h-screen bg-academic-paper flex flex-col font-sans" dir={isArabic ? "rtl" : "ltr"}>
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-academic-navy rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-serif font-bold text-academic-navy tracking-tight">{t.smartStudy}</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
            <a href="#resources" className="hover:text-academic-blue transition-colors">{t.resources}</a>
            <a href="#methodology" className="hover:text-academic-blue transition-colors">{t.methodology}</a>
            <a href="#institutional" className="hover:text-academic-blue transition-colors">{t.institutional}</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateLanguage(isArabic ? "English" : "Arabic")}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-academic-navy hover:bg-slate-100 transition-all group"
              title={isArabic ? "Switch to English" : "التبديل إلى العربية"}
            >
              <Globe className="w-5 h-5 text-slate-400 group-hover:text-academic-blue transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline text-slate-400 group-hover:text-academic-navy transition-colors">
                {isArabic ? "EN" : "AR"}
              </span>
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="text-sm font-bold text-slate-600 hover:text-academic-navy transition-colors"
            >
              {t.logIn}
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="text-sm font-bold bg-academic-blue text-white px-6 py-2.5 rounded-full hover:bg-academic-navy transition-all shadow-lg shadow-academic-blue/20"
            >
              {t.joinPortal}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <div id="resources" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-32 pb-20 md:pb-40">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-academic-navy/5 text-academic-navy text-xs md:text-sm font-bold mb-8 border border-academic-navy/10 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.certifiedAssistant}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-academic-navy tracking-tight leading-[1.1] mb-8">
              {t.heroTitle.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <br className="hidden md:block" />}
                  {line}
                </React.Fragment>
              ))}
            </h1>
            <p className="text-lg md:text-2xl text-slate-600 mb-12 leading-relaxed px-4 md:px-0 max-w-3xl mx-auto font-light italic">
              {t.heroDesc}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 px-4 md:px-0">
              <button 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-academic-navy text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-academic-blue transition-all shadow-2xl shadow-academic-navy/30 hover:-translate-y-1"
              >
                {t.startResearching}
                <ChevronIcon className="w-6 h-6" />
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="w-full sm:w-auto text-academic-navy font-bold hover:underline"
              >
                {t.viewOverview}
              </button>
            </div>
          </div>
        </div>

        <div id="methodology" className="bg-white py-24 border-y border-slate-100 relative overflow-hidden">
          <div className={`absolute top-0 ${isArabic ? "start-0" : "end-0"} w-96 h-96 bg-academic-blue/5 rounded-full ${isArabic ? "-ms-48" : "-me-48"} -mt-48 blur-3xl`}></div>
          <div className={`absolute bottom-0 ${isArabic ? "end-0" : "start-0"} w-96 h-96 bg-academic-gold/5 rounded-full ${isArabic ? "-me-48" : "-ms-48"} -mb-48 blur-3xl`}></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-3 gap-12" style={{ direction: isArabic ? 'rtl' : 'ltr' }}>
              <div className="premium-card p-10">
                <div className="w-14 h-14 bg-slate-50 text-academic-navy rounded-2xl flex items-center justify-center mb-8 border border-slate-100 shadow-sm">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-academic-navy mb-4">{t.structuralAnalysis}</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  {t.structuralDesc}
                </p>
              </div>
              
              <div className="premium-card p-10">
                <div className="w-14 h-14 bg-slate-50 text-academic-navy rounded-2xl flex items-center justify-center mb-8 border border-slate-100 shadow-sm">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-academic-navy mb-4">{t.knowledgeEvaluation}</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  {t.knowledgeDesc}
                </p>
              </div>
              
              <div className="premium-card p-10">
                <div className="w-14 h-14 bg-slate-50 text-academic-navy rounded-2xl flex items-center justify-center mb-8 border border-slate-100 shadow-sm">
                  < Search className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-academic-navy mb-4">{t.interactiveSynthesis}</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  {t.synthesisDesc}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div id="institutional" className="bg-academic-navy py-20 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-8">{t.modernizing}</h2>
            <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto font-light">
              {t.modernizingDesc}
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto bg-white text-academic-navy px-12 py-5 rounded-2xl text-xl font-bold hover:bg-slate-100 transition-all shadow-xl shadow-black/20"
            >
              {t.requestAccess}
            </button>
          </div>
        </div>
      </main>
      
      <footer className="bg-academic-navy py-16 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-slate-300">
          <div className="mb-6 md:mb-0 text-center md:text-start">
            <span className="text-2xl font-serif font-bold text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
              <GraduationCap className="w-6 h-6 text-academic-blue" />
              {t.smartStudy}
            </span>
            <p className="text-sm mt-2 text-slate-400">{t.footerDesc}</p>
          </div>
          <div className="flex gap-8 text-sm font-medium">
            <a href="#resources" className="hover:text-white transition-colors">{t.resources}</a>
            <a href="#methodology" className="hover:text-white transition-colors">{t.methodology}</a>
            <a href="/login" className="hover:text-white transition-colors">{t.logIn}</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center mt-10 pt-8 border-t border-slate-800/50">
          <p className="text-slate-500 text-sm font-medium tracking-wide">{t.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
