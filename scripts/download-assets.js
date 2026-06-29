/* global Buffer */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFilePath = 'C:/Users/pc/.gemini/antigravity-ide/brain/3424e1bc-0d62-48cf-b21d-a84b3071fe44/.system_generated/steps/19/output.txt';
const outputDir = path.join(__dirname, '../public/assets');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const content = fs.readFileSync(inputFilePath, 'utf8');
const urlRegex = /http:\/\/localhost:3845\/assets\/([^"']+)/g;

let match;
const urls = new Set();
while ((match = urlRegex.exec(content)) !== null) {
  urls.add(match[0]);
}

console.log(`Found ${urls.size} unique asset URLs.`);

for (const url of urls) {
  const filename = url.split('/').pop();
  const outputPath = path.join(outputDir, filename);
  
  if (!fs.existsSync(outputPath)) {
    console.log(`Downloading ${url}...`);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(outputPath, buffer);
      console.log(`Saved ${filename}`);
    } catch (e) {
      console.error(`Failed to download ${url}: ${e.message}`);
    }
  } else {
    console.log(`${filename} already exists, skipping.`);
  }
}
