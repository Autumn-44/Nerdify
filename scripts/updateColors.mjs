import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// Color mapping from old to new
const colorReplacements = [
  // Green shades to Primary (amber/gold)
  { from: /green-50\b/g, to: 'primary-50' },
  { from: /green-100\b/g, to: 'primary-100' },
  { from: /green-200\b/g, to: 'primary-200' },
  { from: /green-300\b/g, to: 'primary-300' },
  { from: /green-400\b/g, to: 'primary-400' },
  { from: /green-500\b/g, to: 'primary-500' },
  { from: /green-600\b/g, to: 'primary-600' },
  { from: /green-700\b/g, to: 'primary-700' },
  { from: /green-800\b/g, to: 'primary-800' },
  { from: /green-900\b/g, to: 'primary-900' },
  
  // Hex colors
  { from: /#4ade80/gi, to: '#fbbf24' },
  { from: /#22d3ee/gi, to: '#f59e0b' },
  { from: /#a855f7/gi, to: '#d97706' },
  
  // RGBA colors
  { from: /rgba\(74,\s*222,\s*128/g, to: 'rgba(251, 191, 36' },
  { from: /rgba\(34,\s*211,\s*238/g, to: 'rgba(245, 158, 11' },
  { from: /rgba\(168,\s*85,\s*247/g, to: 'rgba(217, 119, 6' },
  
  // Cyan shades to Primary
  { from: /cyan-400\b/g, to: 'primary-400' },
  { from: /cyan-500\b/g, to: 'primary-500' },
  
  // Purple shades - keep for private notes but update to warmer tone
  { from: /purple-400\b/g, to: 'accent-400' },
  { from: /purple-500\b/g, to: 'accent-500' },
  { from: /purple-600\b/g, to: 'accent-600' },
];

function updateColorsInFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf8');
    let modified = false;
    
    colorReplacements.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to);
        modified = true;
      }
    });
    
    if (modified) {
      writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Updated: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`✗ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function walkDirectory(dir, filePattern = /\.(jsx|js|css)$/) {
  const files = [];
  
  function walk(currentPath) {
    const items = readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = join(currentPath, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!item.startsWith('.') && item !== 'node_modules' && item !== 'dist') {
          walk(fullPath);
        }
      } else if (filePattern.test(item)) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

// Main execution
const srcDir = join(process.cwd(), 'src');
console.log('🎨 Starting color theme update...\n');

const files = walkDirectory(srcDir);
let updatedCount = 0;

files.forEach(file => {
  if (updateColorsInFile(file)) {
    updatedCount++;
  }
});

console.log(`\n✨ Complete! Updated ${updatedCount} files with new color scheme.`);

// Made with Bob
