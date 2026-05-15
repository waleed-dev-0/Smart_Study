import fs from 'fs';

const filePath = 'src/pages/AIChatPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add useAppContext import and usage
if (!content.includes('useAppContext')) {
  content = content.replace('import { useChat } from "../features/chat/hooks/useChat";', 'import { useAppContext } from "../context/AppContext";\nimport { useChat } from "../features/chat/hooks/useChat";');
}

if (!content.includes('const { isArabic } = useAppContext();')) {
  content = content.replace('const navigate = useNavigate();', 'const navigate = useNavigate();\n  const { isArabic } = useAppContext();');
}

// 2. Add translation object
const tObj = `
  const t = {
    chatHistory: isArabic ? "سجل المحادثة" : "Chat history",
    activeAnalysis: isArabic ? "تحليل نشط" : "Active Analysis",
    indexed: isArabic ? "مفهرس" : "Indexed",
    noDocs: isArabic ? "لم تتم فهرسة مستندات بعد." : "No documents indexed yet.",
    uploadNow: isArabic ? "ارفع الآن" : "Upload Now",
    researchAssistant: isArabic ? "مساعد البحث" : "Research Assistant",
    analysis: isArabic ? "التحليل:" : "Analysis:",
    selectDoc: isArabic ? "اختر مستنداً" : "Select a document",
    evaluations: isArabic ? "التقييمات" : "Evaluations",
    academicSession: isArabic ? "الجلسة الأكاديمية" : "Academic Session",
    scholar: isArabic ? "الطالب" : "Scholar",
    referencePage: isArabic ? "المرجع: صفحة" : "Reference: Page",
    uploadingIndexing: isArabic ? "جاري رفع وفهرسة السجل الجديد..." : "Uploading and indexing new record...",
    academicArchive: isArabic ? "الأرشيف الأكاديمي" : "Academic Archive",
    indexNewRecord: isArabic ? "فهرسة سجل جديد" : "Index New Record",
    inputPlaceholderDoc: isArabic ? "صُغ استفسارك بخصوص المستند..." : "Formulate your inquiry regarding the document...",
    inputPlaceholderNoDoc: isArabic ? "يرجى رفع مستند أولاً لبدء المحادثة." : "Please upload a document first to start chatting.",
    autoAnalysisMsg: isArabic ? "تحليل آلي. يخضع للتدقيق الأكاديمي." : "Automated analysis. Subject to academic verification.",
    evaluationsTitle: isArabic ? "التقييمات الأكاديمية" : "Academic Evaluations",
    reviewResults: isArabic ? "مراجعة النتائج" : "Review Results",
  };
`;

if (!content.includes('chatHistory: isArabic')) {
  content = content.replace('const [provider, setProvider] = useState<"gemini" | "ollama">("gemini");', tObj + '\n  const [provider, setProvider] = useState<"gemini" | "ollama">("gemini");');
}

// 3. Replacements
const replacements = [
  ['"Chat history"', 't.chatHistory'],
  ['"Active Analysis"', 't.activeAnalysis'],
  ['"Indexed"', 't.indexed'],
  ['"No documents indexed yet."', 't.noDocs'],
  ['"Upload Now"', 't.uploadNow'],
  ['"Research Assistant"', 't.researchAssistant'],
  ['"Analysis:"', 't.analysis'],
  ['"Select a document"', 't.selectDoc'],
  ['"Evaluations"', 't.evaluations'],
  ['"Academic Session • "', 't.academicSession + " • "'],
  ['"Scholar"', 't.scholar'],
  ['"Reference: Page "', 't.referencePage + " "'],
  ['"Uploading and indexing new record..."', 't.uploadingIndexing'],
  ['"Academic Archive"', 't.academicArchive'],
  ['"Index New Record"', 't.indexNewRecord'],
  ['"Formulate your inquiry regarding the document..."', 't.inputPlaceholderDoc'],
  ['"Please upload a document first to start chatting."', 't.inputPlaceholderNoDoc'],
  ['"Automated analysis. Subject to academic verification."', 't.autoAnalysisMsg'],
  ['"Academic Evaluations"', 't.evaluationsTitle'],
  ['"Review Results"', 't.reviewResults']
];

replacements.forEach(([from, to]) => {
  // Use regex to replace exact string matches inside JSX
  // e.g., >Research Assistant< to >{t.researchAssistant}<
  const jsxRegex = new RegExp('>(?:\\s*)' + from.replace(/"/g, '') + '(?:\\s*)<', 'g');
  content = content.replace(jsxRegex, '>{' + to + '}<');
  
  // also handle ternary cases or raw string literal cases
  const exactStrRegex = new RegExp(from, 'g');
  content = content.replace(exactStrRegex, to);
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Translated AIChatPage');
