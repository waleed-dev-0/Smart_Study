import fs from 'fs';

let content = fs.readFileSync('src/pages/ReportsPage.tsx', 'utf-8');

// Use simple string replacements without relying on specific newline counts
const fixes = [
  ['Administrative Oversight', '{t.adminOversight}'],
  ['System Analytics & Scholar Audit', '{t.systemAnalytics}'],
  ['Download Full Dossier', '{t.downloadDossier}'],
  ['Scholar Activity Audit', '{t.scholarActivityAudit}'],
  ['>Scholar<', '>{t.scholar}<'],
  ['>Archived Files<', '>{t.archivedFiles}<'],
  ['>Status<', '>{t.status}<'],
  ['>Last Signal<', '>{t.lastSignal}<'],
  ['>Units<', '>{t.units}<'],
  ['Enrollment Velocity', '{t.enrollmentVelocity}'],
  ['Past 7 Calendar Days', '{t.past7Days}'],
  ['{scholar.lastActive}', '{t.lastActiveMap ? (t.lastActiveMap as any)[scholar.lastActive] || scholar.lastActive : scholar.lastActive}'],
  // The bottom insight - replace the whole paragraph content
  [
    '"Weekly intake has stabilized at <span className="font-bold text-academic-blue">+12%</span> relative to the previous archival period."',
    '{t.stabilizedStat}<span className="font-bold text-academic-blue">+12%</span>{t.stabilizedStat2}'
  ],
];

let changed = 0;
for (const [from, to] of fixes) {
  if (content.includes(from)) {
    content = content.split(from).join(to);
    changed++;
    console.log('Fixed:', from.substring(0, 50));
  } else {
    console.warn('NOT FOUND:', from.substring(0, 50));
  }
}

fs.writeFileSync('src/pages/ReportsPage.tsx', content, 'utf-8');
console.log(`\nDone: Fixed ${changed}/${fixes.length} strings`);
