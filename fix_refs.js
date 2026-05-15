import fs from 'fs';

function fixFile(filePath, englishMap) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace `t.key` with `"English String"` inside the `const t = { ... }` block
  for (const [key, englishString] of Object.entries(englishMap)) {
    // The broken pattern is: key: isArabic ? "Arabic String" : t.key,
    // We want to replace `t.key` with `"English String"` ONLY if it's on the right side of the ternary inside the t object.
    
    // Actually, just find `isArabic ? "..." : t.key` and replace it
    const regex = new RegExp('isArabic \\? ("[^"]+") : t\\.' + key, 'g');
    content = content.replace(regex, 'isArabic ? $1 : "' + englishString + '"');
    
    // For ReportsPage: `45% ${t.used}` was broken?
    // In ReportsPage: used: isArabic ? "مستخدم" : t.used -> we want "used"
  }
  
  // Custom fix for ReportsPage template literals if needed
  if (filePath.includes('ReportsPage')) {
     content = content.replace(/used: isArabic \? "([^"]+)" : t\.used/g, 'used: isArabic ? "$1" : "used"');
  }

  fs.writeFileSync(filePath, content, 'utf-8');
}

const chatMap = {
  chatHistory: "Chat history",
  activeAnalysis: "Active Analysis",
  indexed: "Indexed",
  noDocs: "No documents indexed yet.",
  uploadNow: "Upload Now",
  researchAssistant: "Research Assistant",
  analysis: "Analysis:",
  selectDoc: "Select a document",
  evaluations: "Evaluations",
  scholar: "Scholar",
  uploadingIndexing: "Uploading and indexing new record...",
  academicArchive: "Academic Archive",
  indexNewRecord: "Index New Record",
  inputPlaceholderDoc: "Formulate your inquiry regarding the document...",
  inputPlaceholderNoDoc: "Please upload a document first to start chatting.",
  autoAnalysisMsg: "Automated analysis. Subject to academic verification.",
  evaluationsTitle: "Academic Evaluations",
  reviewResults: "Review Results"
};

const quizMap = {
  quizHistory: "Quiz History",
  yourProgress: "Your Progress",
  totalQuizzes: "Total Quizzes",
  averageScore: "Average Score",
  progress: "Progress",
  loading: "Loading history...",
  noHistory: "No quiz history found.",
  unknown: "Unknown",
  quizDetails: "Quiz Details",
  explanation: "Explanation:",
  noDetails: "No details available."
};

const reportsMap = {
  totalScholars: "Total Scholars",
  archivedSources: "Archived Sources",
  weeklyGrowth: "Weekly Growth",
  digitalStorage: "Digital Storage",
  adminOversight: "Administrative Oversight",
  systemAnalytics: "System Analytics & Scholar Audit",
  downloadDossier: "Download Full Dossier",
  scholarActivityAudit: "Scholar Activity Audit",
  active: "Active",
  inactive: "Inactive",
  enrollmentVelocity: "Enrollment Velocity",
  past7Days: "Past 7 Calendar Days",
  stabilizedStat: "Weekly intake has stabilized at ",
  stabilizedStat2: " relative to the previous archival period."
};

fixFile('src/pages/AIChatPage.tsx', chatMap);
fixFile('src/pages/QuizHistoryPage.tsx', quizMap);
fixFile('src/pages/ReportsPage.tsx', reportsMap);

console.log('Fixed reference errors!');
