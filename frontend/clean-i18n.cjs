const fs = require('fs');

// Read the file
const content = fs.readFileSync('src/services/i18n.ts', 'utf8');
const lines = content.split('\n');

// Track seen keys for each language section
let currentSection = null;
const seenKeys = {
  es: new Set(),
  en: new Set()
};

const cleanedLines = [];

for (const line of lines) {
  // Detect section changes
  if (line.includes('es: {')) {
    currentSection = 'es';
    cleanedLines.push(line);
    continue;
  } else if (line.includes('en: {')) {
    currentSection = 'en';
    cleanedLines.push(line);
    continue;
  } else if (line.includes('},')) {
    currentSection = null;
    cleanedLines.push(line);
    continue;
  }

  // Check for duplicate keys
  const keyMatch = line.match(/^\s*'([^']+)':/);
  if (keyMatch && currentSection) {
    const key = keyMatch[1];
    if (seenKeys[currentSection].has(key)) {
      console.log(`Removing duplicate key in ${currentSection}: ${key}`);
      continue;
    }
    seenKeys[currentSection].add(key);
  }
  
  cleanedLines.push(line);
}

// Write the cleaned file
fs.writeFileSync('src/services/i18n.ts', cleanedLines.join('\n'));
console.log('Cleaned i18n.ts file - removed duplicate keys');
