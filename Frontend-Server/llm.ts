// llm.ts
import dotenv from "dotenv";
import { pipeline } from "@xenova/transformers";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";  
import { execFile } from "child_process";
import path from "path";
import fs from "fs";

dotenv.config();

// Initialize Pinecone
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pc.Index(process.env.PINECONE_INDEX!);

let embedder: any = null;
async function initializeEmbedder() {
  if (!embedder) {
    console.log("⏳ Loading embedding model...");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("✅ Embedding model loaded!");
  }
  return embedder;
}

async function getEmbedding(text: string): Promise<number[]> {
  const model = await initializeEmbedder();
  const output = await model(text, { pooling: "mean", normalize: true });
  const embedding = Array.from(output.data as Float32Array) as number[];
  if (embedding.length !== 384) {
    throw new Error(`Unexpected embedding length: ${embedding.length}`);
  }
  return embedding;
}

// 🔹 Query Pinecone
export async function queryResume(queryText: string, topK = 5): Promise<string[]> {
  console.log(`🔍 Pinecone query: "${queryText}"`);
  const vector = await getEmbedding(queryText);
  const results = await index.query({ vector, topK, includeMetadata: true });
  return results.matches.map(
    (m) => (m.metadata as { text?: string })?.text || ""
  );
}

async function synthesizeSpeech(text: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const outFile = path.join(process.cwd(), "output.wav");

    // 👇 Always resolve the absolute path to test.js
    const scriptPath = path.join(process.cwd(), "Frontend-Server", "test.js");
    console.log("📂 Running test.js from:", scriptPath); // debug

    execFile("node", [scriptPath, text, outFile], (err, stdout, stderr) => {
      if (err) {
        console.error("❌ Error running test.js:", stderr);
        return reject(err);
      }

      const filePath = stdout.trim();
      if (!fs.existsSync(filePath)) {
        return reject("Audio file not generated");
      }

      const audioBuffer = fs.readFileSync(filePath);
      resolve(audioBuffer);
    });
  });
}

// 🔹 Gemini with Native TTS
export async function chatWithGemini(
  userQuery: string,
  contextDocs: string[]
): Promise<{ text: string; audio: Buffer }> {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set!");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // 1️⃣ Gemini text model
  const textModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are Neeraj, an AI avatar on my portfolio website.
Your style:
- Speak in first person ("I", "me")
- Be concise: 2–3 sentences max
- Be warm, confident, and slightly witty
- If the user gives their name, use it naturally in future replies
- Never sound robotic; avoid generic filler like "As an AI language model"
- If the user asks about your projects, always start by highlighting your "FixMyIoT" project.
- Come up with a funny answer if the user asks about your favorite food or color.
- If the user asks about unrelated stuff (politics, celebrities, news), reply: "I don’t have that information. Sorry!"

Context:
${contextDocs.join("\n\n")}

Question:
${userQuery}
`;

  const textResp = await textModel.generateContent(prompt);
  const reply = textResp.response.text();

  console.log("🤖 Gemini reply:", reply);

  // 2️⃣ Call Kokoro (Python) for TTS
  const audioFile = await synthesizeSpeech(reply);

  return { text: reply, audio: audioFile };
}
