import fs from 'fs';

const filePath = 'src/pages/QuizHistoryPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

if (!content.includes('useAppContext')) {
  content = content.replace('import api from \'../services/api\';', 'import api from \'../services/api\';\nimport { useAppContext } from "../context/AppContext";');
}

if (!content.includes('const { isArabic } = useAppContext();')) {
  content = content.replace('let navigate = useNavigate();', 'let navigate = useNavigate();\n  const { isArabic } = useAppContext();');
}

const tObj = `
  const t = {
    quizHistory: isArabic ? "سجل الاختبارات" : "Quiz History",
    yourProgress: isArabic ? "تقدمك" : "Your Progress",
    totalQuizzes: isArabic ? "إجمالي الاختبارات" : "Total Quizzes",
    averageScore: isArabic ? "متوسط الدرجات" : "Average Score",
    progress: isArabic ? "التقدم" : "Progress",
    loading: isArabic ? "جاري تحميل السجل..." : "Loading history...",
    noHistory: isArabic ? "لم يتم العثور على سجل للاختبارات." : "No quiz history found.",
    date: isArabic ? "التاريخ" : "Date",
    document: isArabic ? "المستند" : "Document",
    score: isArabic ? "الدرجة" : "Score",
    actions: isArabic ? "إجراءات" : "Actions",
    unknown: isArabic ? "غير معروف" : "Unknown",
    details: isArabic ? "التفاصيل" : "Details",
    quizDetails: isArabic ? "تفاصيل الاختبار" : "Quiz Details",
    explanation: isArabic ? "التفسير:" : "Explanation:",
    noDetails: isArabic ? "لا توجد تفاصيل متاحة." : "No details available."
  };
`;

if (!content.includes('quizHistory: isArabic')) {
  content = content.replace('const stats = calculateStats();', 'const stats = calculateStats();\n' + tObj);
}

const replacements = [
  ['"Quiz History"', 't.quizHistory'],
  ['"Your Progress"', 't.yourProgress'],
  ['"Total Quizzes"', 't.totalQuizzes'],
  ['"Average Score"', 't.averageScore'],
  ['"Progress"', 't.progress'],
  ['"Loading history..."', 't.loading'],
  ['"No quiz history found."', 't.noHistory'],
  ['>Date<', '>{t.date}<'],
  ['>Document<', '>{t.document}<'],
  ['>Score<', '>{t.score}<'],
  ['>Actions<', '>{t.actions}<'],
  ['\'Unknown\'', 't.unknown'],
  ['>Details<', '>{t.details}<'],
  ['"Quiz Details"', 't.quizDetails'],
  ['"Explanation:"', 't.explanation'],
  ['"No details available."', 't.noDetails']
];

replacements.forEach(([from, to]) => {
  content = content.replace(new RegExp(from, 'g'), to);
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Translated QuizHistoryPage');
