import fs from 'fs';

let content = fs.readFileSync('src/pages/AIChatPage.tsx', 'utf-8');

const fixes = [
  // Fix "Analysis:" hardcoded label
  ['                  Analysis:{" "}\r\n', '                  {t.analysis}{" "}\r\n'],
  // Fix "Academic Session" hardcoded text
  ['              Academic Session \u2022{" "}\r\n              {new Date().toLocaleDateString("en-US", {', 
   '              {t.academicSession} \u2022{" "}\r\n              {new Date().toLocaleDateString(isArabic ? "ar-EG" : "en-US", {'],
  // Fix "Reference: Page"
  ['                          Reference: Page {cite.page}\r\n',
   '                          {t.referencePage} {cite.page}\r\n'],
  // Fix evaluations panel border and RTL slide direction
  ['        className={`fixed inset-y-0 end-0 z-[70] w-80 bg-white border-l border-slate-200 transform transition-transform duration-300 flex flex-col h-screen shadow-2xl ${isQuizzesOpen ? "translate-x-0" : "translate-x-full"}`}\r\n',
   '        className={`fixed inset-y-0 end-0 z-[70] w-80 bg-white border-s border-slate-200 transform transition-transform duration-300 flex flex-col h-screen shadow-2xl ${isQuizzesOpen ? "translate-x-0" : isArabic ? "-translate-x-full" : "translate-x-full"}`}\r\n'],
];

let changed = 0;
for (const [from, to] of fixes) {
  if (content.includes(from)) {
    content = content.split(from).join(to);
    changed++;
    console.log('Fixed:', from.substring(0, 50).replace(/\r\n/g, '\\r\\n'));
  } else {
    console.warn('NOT FOUND:', JSON.stringify(from.substring(0, 80)));
  }
}

fs.writeFileSync('src/pages/AIChatPage.tsx', content, 'utf-8');
console.log(`\nDone: Fixed ${changed}/${fixes.length} strings in AIChatPage`);
