import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFilePath = 'C:/Users/pc/.gemini/antigravity-ide/brain/3424e1bc-0d62-48cf-b21d-a84b3071fe44/.system_generated/steps/19/output.txt';
const outputFilePath = path.join(__dirname, '../src/App.jsx');

let content = fs.readFileSync(inputFilePath, 'utf8');

// Replace URLs
content = content.replace(/http:\/\/localhost:3845\/assets\//g, '/assets/');

// Remove MCP prompt text at the end
const endOfComponent = content.lastIndexOf('}');
if (endOfComponent !== -1) {
  content = content.substring(0, endOfComponent + 1);
}

fs.writeFileSync(outputFilePath, content + '\n');
console.log('Successfully updated and cleaned App.jsx');
