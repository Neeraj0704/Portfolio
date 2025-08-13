import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import { fileURLToPath } from "url";

// Figure out __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to Data folder (always correct, no matter where you run node)
const dataDir = path.join(__dirname, "../Data");

async function readPDF(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  } catch (err) {
    console.error(`❌ Error reading ${filePath}: ${err.message}`);
    return "";
  }
}

function chunkText(text, chunkSize = 200) {
  const words = text.split(/\s+/);
  let chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push({
      id: `chunk-${i / chunkSize + 1}`,
      text: words.slice(i, i + chunkSize).join(" ")
    });
  }
  return chunks;
}

async function main() {
  if (!fs.existsSync(dataDir)) {
    console.error(`❌ Data directory not found: ${dataDir}`);
    return;
  }

  // Load all PDFs in Data folder
  const resumeFiles = fs
    .readdirSync(dataDir)
    .filter(file => file.toLowerCase().endsWith(".pdf"))
    .map(file => path.join(dataDir, file));

  if (resumeFiles.length === 0) {
    console.error("❌ No PDF files found in Data directory.");
    return;
  }

  let allText = "";
  for (const file of resumeFiles) {
    console.log(`📄 Reading: ${file}`);
    const text = await readPDF(file);
    if (text) allText += "\n" + text;
  }

  if (!allText.trim()) {
    console.error("❌ No text extracted from PDFs.");
    return;
  }

  const chunks = chunkText(allText, 200);
  const outputPath = path.join(dataDir, "Resume.json");
  fs.writeFileSync(outputPath, JSON.stringify(chunks, null, 2));

  console.log(`✅ Created Resume.json with ${chunks.length} chunks at ${outputPath}`);
}

main();
