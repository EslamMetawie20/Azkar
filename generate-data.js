const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'apps/web/public/azkar.json');
const rawData = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(rawData);

const combinedKey = "أذكار الصباح والمساء";
const categoryData = data[combinedKey];

if (!categoryData || !categoryData.text) {
  console.error('Data not found!');
  process.exit(1);
}

const azkarTexts = categoryData.text.filter(text => text && text.trim().length > 0);
const footnotes = categoryData.footnote || [];

const processedAzkar = azkarTexts.map((text, index) => {
  let repeatMin = 1;
  if (text.includes('ثلاث مرات') || text.includes('ثلاث')) repeatMin = 3;
  else if (text.includes('سبع مرات') || text.includes('سبع')) repeatMin = 7;
  else if (text.includes('مائة مرة') || text.includes('مائة')) repeatMin = 100;
  else if (text.includes('عشر مرات') || text.includes('عشر')) repeatMin = 10;
  else if (text.includes('أربع مرات') || text.includes('أربع')) repeatMin = 4;

  const cleanText = text
    .replace(/\(\s*.*?\s*مرات?\s*\)/g, '')
    .replace(/(ثلاث|أربع|خمس|ست|سبع|ثمان|تسع|عشر|مائة)\s*مرات?/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    id: index + 1,
    textAr: cleanText,
    footnoteAr: footnotes[index] || undefined,
    repeatMin: repeatMin,
    orderIndex: index + 1
  };
});

const tsContent = `// Auto-generated file. Do not edit directly.
import type { Zikr } from '@azkar/shared';

export const azkarSabahMasaaData: Zikr[] = ${JSON.stringify(processedAzkar, null, 2)};
`;

const outPath = path.join(__dirname, 'apps/web/src/data/azkarData.ts');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, tsContent);
console.log('✅ Generated azkarData.ts successfully');
