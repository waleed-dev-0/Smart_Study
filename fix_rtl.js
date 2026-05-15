import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replacements = [
  { regex: /\bpl-(\d+|px|auto|0\.5|1\.5|2\.5|3\.5)\b/g, replace: 'ps-$1' },
  { regex: /\bpr-(\d+|px|auto|0\.5|1\.5|2\.5|3\.5)\b/g, replace: 'pe-$1' },
  { regex: /\bml-(\d+|px|auto|0\.5|1\.5|2\.5|3\.5)\b/g, replace: 'ms-$1' },
  { regex: /\bmr-(\d+|px|auto|0\.5|1\.5|2\.5|3\.5)\b/g, replace: 'me-$1' },
  { regex: /\btext-left\b/g, replace: 'text-start' },
  { regex: /\btext-right\b/g, replace: 'text-end' },
  { regex: /\bborder-l-(\d+|px|transparent|slate-\d+|blue-\d+|academic-[a-z]+)\b/g, replace: 'border-s-$1' },
  { regex: /\bborder-r-(\d+|px|transparent|slate-\d+|blue-\d+|academic-[a-z]+)\b/g, replace: 'border-e-$1' },
  { regex: /\bleft-(\d+|px|auto|full|0\.5|1\.5|2\.5|3\.5)\b/g, replace: 'start-$1' },
  { regex: /\bright-(\d+|px|auto|full|0\.5|1\.5|2\.5|3\.5)\b/g, replace: 'end-$1' },
  // And also fix absolute positioning if left-0 right-0 is used, start-0 end-0 is better
  { regex: /\brounded-l-(\d+|full|md|lg|xl|2xl|3xl)\b/g, replace: 'rounded-s-$1' },
  { regex: /\brounded-r-(\d+|full|md|lg|xl|2xl|3xl)\b/g, replace: 'rounded-e-$1' },
  { regex: /\brounded-tl-(\d+|full|md|lg|xl|2xl|3xl|none)\b/g, replace: 'rounded-ts-$1' },
  { regex: /\brounded-tr-(\d+|full|md|lg|xl|2xl|3xl|none)\b/g, replace: 'rounded-te-$1' },
  { regex: /\brounded-bl-(\d+|full|md|lg|xl|2xl|3xl|none)\b/g, replace: 'rounded-bs-$1' },
  { regex: /\brounded-br-(\d+|full|md|lg|xl|2xl|3xl|none)\b/g, replace: 'rounded-be-$1' }
];

let changedFiles = 0;

walkDir('./src', (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

  let content = fs.readFileSync(filePath, 'utf-8');
  let newContent = content;

  replacements.forEach(({ regex, replace }) => {
    newContent = newContent.replace(regex, replace);
  });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    changedFiles++;
    console.log(`Updated ${filePath}`);
  }
});

console.log(`\nFixed RTL issues in ${changedFiles} files.`);
