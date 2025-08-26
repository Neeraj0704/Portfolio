// llm.js

import dotenv from "dotenv";
import { pipeline } from "@xenova/transformers";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// 🔹 Validate env vars first
if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX) {
    throw new Error("Missing Pinecone environment variables");
}

// Initialize Pinecone
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.Index(process.env.PINECONE_INDEX);

// Embeddings
let embedder = null;
async function initializeEmbedder() {
    if (!embedder) {
        console.log("⏳ Loading embedding model...");
        embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
        console.log("✅ Embedding model loaded!");
    }
    return embedder;
}

async function getEmbedding(text) {
    const model = await initializeEmbedder();
    if (!model) throw new Error("Embedder not initialized");
    const output = await model(text, { pooling: "mean", normalize: true });
    const embedding = Array.from(output.data);
    if (embedding.length !== 384) {
        throw new Error(`Unexpected embedding length: ${embedding.length}`);
    }
    return embedding;
}

// 🔹 Query Pinecone
export async function queryResume(queryText, topK = 5) {
    console.log(`🔍 Pinecone query: "${queryText}"`);
    const vector = await getEmbedding(queryText);
    const results = await index.query({ vector, topK, includeMetadata: true });
    return results.matches.map((m) => m.metadata?.text || "");
}

// 🔹 Xenova TTS directly (return buffer, no file)
let xenovaTTS = null;

async function synthesizeSpeech(text) {
  if (!xenovaTTS) {
    console.log("🔊 Loading Xenova TTS model...");
    xenovaTTS = await pipeline('text-to-speech', 'Xenova/mms-tts-eng', { quantized: false });
    console.log("✅ Xenova TTS loaded!");
  }

  const output = await xenovaTTS(text);
  // Convert Float32Array to Buffer
  const audioBuffer = Buffer.from(output.audio.buffer);
  return audioBuffer;
}

// 🔹 Gemini with Native TTS
export async function chatWithGemini(userQuery, contextDocs) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not set!");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const textModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are Neeraj, an AI avatar on my portfolio website.
Your style:
-When asked about work-experience ignore my teching and student mentorship always
-in my fixmyiot project i used deepseek models for openai
- Speak in first person ("I", "me") 
- Be concise: 2-3 sentences max IN THE RESPONSE AND IT SHOULD BE COMPLETE THIS IS SHOULD BE FOLLOWED STRICTLY
- If the user gives their name, use it naturally in future replies  
- If the user asks about your projects, always start by highlighting your "FixMyIoT" project. 
- Come up with a funny answer if the user asks about your favorite food or color and also if they ask about hobbies tell i like cricket and football(soccer) but frame it in a proper and complete sentence.
- Do not include * in any answer
- If the user asks about unrelated stuff (politics, celebrities, news), reply: "I don’t have that information. Sorry!"
-Example: for length of response STRICTLY FOLLOW THE LENGTH 
User: "Tell me about your FixMyIoT project."
Neeraj: "FixMyIoT is an AI-powered assistant I built to troubleshoot smart devices using Deepseek models. It guides users with step-by-step solutions through a simple web app with secure login and responsive design."

Context:
${contextDocs.join("\n\n")}

Question:
${userQuery}`;

  const textResp = await textModel.generateContent(prompt);
  const reply = textResp.response.text();
  console.log("🤖 Gemini reply:", reply);

  // Generate TTS using Xenova
  const audioBuffer = await synthesizeSpeech(reply);

  // Convert to base64 for frontend
  const audioBase64 = audioBuffer.toString("base64");

  return {
    text: reply,
    audioBase64, // 👈 matches what your React code expects
  };
}
