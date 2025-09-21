const http = require('http');
const fs = require('fs');
const path = require('path');

// Read the JSON data
const dataPath = path.join(__dirname, 'apps/backend/src/main/resources/data/hisn_almuslim.json');
let azkarData = {};

try {
  const rawData = fs.readFileSync(dataPath, 'utf8');
  azkarData = JSON.parse(rawData);
  console.log('✅ Loaded hisn_almuslim.json successfully');
} catch (error) {
  console.error('❌ Failed to load data:', error.message);
  process.exit(1);
}

// Extract and process azkar
function processAzkarData() {
  const morningEvening = azkarData["أذكار الصباح والمساء"];
  if (!morningEvening || !morningEvening.text) {
    throw new Error('Could not find morning/evening azkar data');
  }

  const azkarTexts = morningEvening.text.filter(text => text && text.trim().length > 0);
  const footnotes = morningEvening.footnote || [];

  const processedAzkar = azkarTexts.map((text, index) => {
    // Extract repeat count
    let repeatMin = 1;

    // Look for patterns like "ثلاث مرات", "سبع مرات", etc.
    if (text.includes('ثلاث مرات') || text.includes('ثلاث')) repeatMin = 3;
    else if (text.includes('سبع مرات') || text.includes('سبع')) repeatMin = 7;
    else if (text.includes('مائة مرة') || text.includes('مائة')) repeatMin = 100;
    else if (text.includes('عشر مرات') || text.includes('عشر')) repeatMin = 10;
    else if (text.includes('أربع مرات') || text.includes('أربع')) repeatMin = 4;

    // Clean text by removing repeat indicators
    const cleanText = text
      .replace(/\(\s*.*?\s*مرا?ت?\s*\)/g, '')
      .replace(/(ثلاث|أربع|خمس|ست|سبع|ثمان|تسع|عشر|مائة)\s*مرا?ت?/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      id: index + 1,
      textAr: cleanText,
      footnoteAr: footnotes[index] || null,
      repeatMin: repeatMin,
      orderIndex: index + 1
    };
  });

  return processedAzkar;
}

// Mock API responses
const categories = [
  { id: 1, nameAr: "أذكار الصباح", slug: "morning", orderIndex: 1 },
  { id: 2, nameAr: "أذكار المساء", slug: "evening", orderIndex: 2 }
];

const azkarList = processAzkarData();

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  console.log(`${req.method} ${pathname}`);

  // Health check
  if (pathname === '/api/v1/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // Categories endpoint
  if (pathname === '/api/v1/categories') {
    res.writeHead(200);
    res.end(JSON.stringify(categories));
    return;
  }

  // Azkar endpoint
  if (pathname === '/api/v1/azkar') {
    const category = url.searchParams.get('category');
    console.log(`🔍 Category parameter received: '${category}'`);
    if (category === 'morning' || category === 'evening') {
      console.log(`✅ Valid category: ${category}, returning azkar data`);
      res.writeHead(200);
      res.end(JSON.stringify(azkarList));
    } else {
      console.log(`❌ Invalid/missing category: '${category}'`);
      res.writeHead(400);
      res.end(JSON.stringify({ error: `Invalid category '${category}'. Use "morning" or "evening"` }));
    }
    return;
  }

  // 404 for other routes
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🚀 Mock Azkar Backend running at http://localhost:${PORT}`);
  console.log(`📱 Available endpoints:`);
  console.log(`   GET http://localhost:${PORT}/api/v1/health`);
  console.log(`   GET http://localhost:${PORT}/api/v1/categories`);
  console.log(`   GET http://localhost:${PORT}/api/v1/azkar?category=morning`);
  console.log(`   GET http://localhost:${PORT}/api/v1/azkar?category=evening`);
  console.log(`\n✅ Ready to serve data to the web app!`);
});