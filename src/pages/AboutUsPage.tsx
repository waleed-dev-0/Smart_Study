import { useNavigate } from "react-router-dom";
import React from 'react';
import Sidebar from "../components/Sidebar";
import { Github, Linkedin, Mail, Library, Award, Globe, GraduationCap, Users } from 'lucide-react';
import { useAppContext } from "../context/AppContext";

export default function AboutUsPage({ isAdmin }: { isAdmin?: boolean }) {
  const navigate = useNavigate();
  const { isArabic } = useAppContext();
  
  const t = {
    title: isArabic ? "المعلومات المؤسسية" : "Institutional Information",
    subtitle: isArabic ? "الأصول التأسيسية والقيم الأكاديمية" : "Foundational Origins & Academic Values",
    consortium: isArabic ? "الاتحاد البحثي" : "The Research Consortium",
    desc: isArabic ? '"تمثل منصة الدراسة الذكية مسعى متطوراً تأسس على يد ائتلاف من الباحثين المتفانين. يعمل هذا المشروع كتأليف نهائي بين الذكاء الاصطناعي والمنهجية الأكاديمية، صُمم لإحداث ثورة في المشهد التربوي من خلال المعالجة الدلالية المستقلة."' : '"Smart Study represents a sophisticated endeavor founded by a coalition of dedicated scholars. This project serves as a definitive synthesis of artificial intelligence and academic methodology, designed to revolutionize the pedagogical landscape through autonomous semantic processing."',
    missionTitle: isArabic ? "مهمتنا الأكاديمية" : "Our Academic Mission",
    missionDesc: isArabic ? '"تتمثل مهمتنا في إضفاء الطابع الديمقراطي على الوصول إلى المنهجيات التربوية النخبوية من خلال الاستفادة من الذكاء الحسابي المتقدم. نحن نهدف إلى تحويل المستودعات الثابتة للمعلومات إلى بيئات ديناميكية غنية دلالياً، مما يسهل مستويات غير مسبوقة من المشاركة الفكرية والإتقان للباحثين في جميع أنحاء العالم."' : '"Our mission is to democratize access to elite pedagogical methodologies by leveraging advanced computational intelligence. We aim to transmute static repositories of information into dynamic, semantically-rich environments, facilitating unprecedented levels of intellectual engagement and mastery for researchers worldwide."',
    footer: isArabic ? "© 2024 اتحاد الدراسة الذكية البحثي. جميع الملكيات الفكرية محفوظة. يُحظر تمامًا الاستنساخ غير المصرح به للأطر المعمارية بموجب اللوائح المؤسسية." : "© 2024 The Smart Study Research Consortium. All intellectual properties reserved. Unauthorized duplication of architectural frameworks is strictly prohibited under institutional statutes.",
    roles: {
      "Principal Investigator & AI Lead": isArabic ? "الباحث الرئيسي وقائد الذكاء الاصطناعي" : "Principal Investigator & AI Lead",
      "Director of Visual Experience": isArabic ? "مدير التجربة المرئية" : "Director of Visual Experience",
      "Core Systems Architect": isArabic ? "مهندس النظم الأساسية" : "Core Systems Architect",
      "Strategic Research Coordinator": isArabic ? "منسق البحوث الاستراتيجية" : "Strategic Research Coordinator",
    }
  };
  const team = [
    {
      name: 'Ahmed Youssef',
      role: 'Principal Investigator & AI Lead',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Sarah Chen',
      role: 'Director of Visual Experience',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Omar Khalid',
      role: 'Core Systems Architect',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Leila Hassan',
      role: 'Strategic Research Coordinator',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    }
  ];

  return (
    <div className="flex min-h-screen bg-academic-paper">
      <Sidebar currentScreen="about" isAdmin={isAdmin} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-academic-navy/5 flex items-center px-10 shrink-0 sticky top-0 z-10">
          <div className="w-12 h-12 bg-academic-navy/5 text-academic-navy rounded-2xl flex items-center justify-center border border-academic-navy/10 me-6">
            <Library className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-academic-navy">{t.title}</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{t.subtitle}</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 pb-24 md:pb-10">
          <div className="max-w-6xl mx-auto">
            
            <div className="text-center mb-16 mt-8 relative">
              <div className="absolute top-0 start-1/2 -translate-x-1/2 -mt-8 text-academic-gold/20 flex gap-4">
                <Award className="w-16 h-16" />
                <Globe className="w-16 h-16" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy tracking-tight mb-8 relative z-10 leading-tight">
                {t.consortium}
              </h2>
              <div className="w-24 h-1 bg-academic-gold mx-auto mb-10"></div>
              <p className="text-xl font-serif italic text-slate-600 max-w-3xl mx-auto leading-relaxed px-4 md:px-0 text-justify">
                {t.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-xl shadow-academic-navy/5 hover:shadow-2xl hover:shadow-academic-navy/10 transition-all hover:-translate-y-2 flex flex-col items-center p-10 text-center group">
                  <div className="relative mb-8">
                    <div className="w-36 h-36 rounded-3xl overflow-hidden border-4 border-slate-50 group-hover:border-academic-blue/20 transition-all duration-500 transform rotate-3 group-hover:rotate-0 shadow-xl group-hover:scale-110">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute -bottom-3 -end-3 bg-academic-navy text-white p-2.5 rounded-2xl shadow-lg border-2 border-white group-hover:bg-academic-gold transition-colors duration-500">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-academic-navy mb-2 leading-tight">{member.name}</h3>
                  <p className="text-xs font-bold text-academic-blue uppercase tracking-widest mb-8">{(t.roles as any)[member.role]}</p>
                  
                  <div className="flex items-center justify-center gap-6 mt-auto pt-8 border-t border-slate-50 w-full">
                    <button className="text-slate-300 hover:text-academic-navy transition-all transform hover:scale-125">
                      <Github className="w-5 h-5" />
                    </button>
                    <button className="text-slate-300 hover:text-academic-blue transition-all transform hover:scale-125">
                      <Linkedin className="w-5 h-5" />
                    </button>
                    <button className="text-slate-300 hover:text-academic-gold transition-all transform hover:scale-125">
                      <Mail className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-24 bg-academic-navy rounded-[4rem] p-16 md:p-24 text-center text-white shadow-2xl shadow-academic-navy/30 relative overflow-hidden group">
              <div className="absolute top-0 end-0 -mt-20 -me-20 w-80 h-80 bg-academic-blue/10 rounded-full blur-[100px] group-hover:bg-academic-gold/10 transition-colors duration-1000"></div>
              <div className="absolute bottom-0 start-0 -mb-20 -ms-20 w-80 h-80 bg-academic-blue/10 rounded-full blur-[100px] group-hover:bg-academic-gold/10 transition-colors duration-1000"></div>
              
              <div className="flex justify-center mb-10">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-700">
                  <Users className="w-10 h-10 text-academic-gold" />
                </div>
              </div>
              
              <h3 className="text-3xl md:text-5xl font-serif font-bold mb-10 relative z-10 tracking-tight">{t.missionTitle}</h3>
              <p className="text-slate-300 text-xl md:text-2xl max-w-4xl mx-auto leading-[1.6] font-serif italic relative z-10 text-justify md:text-center text-opacity-80">
                {t.missionDesc}
              </p>
              
              <div className="mt-16 flex justify-center gap-8 relative z-10 opacity-30">
                <div className="w-1 h-16 bg-white/20"></div>
                <div className="w-1 h-16 bg-white/20"></div>
              </div>
            </div>

            <p className="mt-20 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose max-w-xl mx-auto">
              {t.footer}
            </p>

          </div>
        </main>
      </div>
    </div>
  );
}
