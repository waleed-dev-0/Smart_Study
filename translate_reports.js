import fs from 'fs';

const filePath = 'src/pages/ReportsPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

if (!content.includes('useAppContext')) {
  content = content.replace('import React from "react";', 'import React from "react";\nimport { useAppContext } from "../context/AppContext";');
}

if (!content.includes('const { isArabic } = useAppContext();')) {
  content = content.replace('const navigate = useNavigate();', 'const navigate = useNavigate();\n  const { isArabic } = useAppContext();');
}

const tObj = `
  const t = {
    totalScholars: isArabic ? "إجمالي الطلاب" : "Total Scholars",
    archivedSources: isArabic ? "المصادر المؤرشفة" : "Archived Sources",
    weeklyGrowth: isArabic ? "النمو الأسبوعي" : "Weekly Growth",
    digitalStorage: isArabic ? "التخزين الرقمي" : "Digital Storage",
    used: isArabic ? "مستخدم" : "used",
    adminOversight: isArabic ? "الإشراف الإداري" : "Administrative Oversight",
    systemAnalytics: isArabic ? "تحليلات النظام ومراجعة الطلاب" : "System Analytics & Scholar Audit",
    downloadDossier: isArabic ? "تحميل الملف الكامل" : "Download Full Dossier",
    scholarActivityAudit: isArabic ? "مراجعة نشاط الطلاب" : "Scholar Activity Audit",
    scholar: isArabic ? "الطالب" : "Scholar",
    archivedFiles: isArabic ? "الملفات المؤرشفة" : "Archived Files",
    status: isArabic ? "الحالة" : "Status",
    lastSignal: isArabic ? "آخر إشارة" : "Last Signal",
    units: isArabic ? "وحدات" : "Units",
    active: isArabic ? "نشط" : "Active",
    inactive: isArabic ? "غير نشط" : "Inactive",
    enrollmentVelocity: isArabic ? "سرعة التسجيل" : "Enrollment Velocity",
    past7Days: isArabic ? "آخر 7 أيام" : "Past 7 Calendar Days",
    stabilizedStat: isArabic ? '"استقر المدخول الأسبوعي عند "' : '"Weekly intake has stabilized at "',
    stabilizedStat2: isArabic ? '" نسبة إلى فترة الأرشفة السابقة."' : '" relative to the previous archival period."'
  };
`;

if (!content.includes('totalScholars: isArabic')) {
  content = content.replace('const stats = [', tObj + '\n  const stats = [');
}

const replacements = [
  ['"Total Scholars"', 't.totalScholars'],
  ['"Archived Sources"', 't.archivedSources'],
  ['"Weekly Growth"', 't.weeklyGrowth'],
  ['"Digital Storage"', 't.digitalStorage'],
  ['"45% used"', '`45% ${t.used}`'],
  ['"Administrative Oversight"', 't.adminOversight'],
  ['"System Analytics & Scholar Audit"', 't.systemAnalytics'],
  ['"Download Full Dossier"', 't.downloadDossier'],
  ['"Scholar Activity Audit"', 't.scholarActivityAudit'],
  ['>Scholar<', '>{t.scholar}<'],
  ['>Archived Files<', '>{t.archivedFiles}<'],
  ['>Status<', '>{t.status}<'],
  ['>Last Signal<', '>{t.lastSignal}<'],
  ['>Units<', '>{t.units}<'],
  ['"Active"', 't.active'],
  ['"Inactive"', 't.inactive'],
  ['"Enrollment Velocity"', 't.enrollmentVelocity'],
  ['"Past 7 Calendar Days"', 't.past7Days'],
  ['"Weekly intake has stabilized at "', 't.stabilizedStat'],
  ['" relative to the previous archival period."', 't.stabilizedStat2']
];

replacements.forEach(([from, to]) => {
  content = content.replace(new RegExp(from, 'g'), to);
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Translated ReportsPage');
