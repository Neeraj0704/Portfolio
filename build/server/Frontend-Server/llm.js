// llm.js

import dotenv from "dotenv";
import { pipeline } from "@xenova/transformers";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

dotenv.config();

// 🔹 Validate env vars first
if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX) {
    throw new Error("Missing Pinecone environment variables");
}
if (!process.env.TEXT_TO_SPEECH_API) {
    throw new Error("Missing GOOGLE_TTS_API_KEY in env!");
}
if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in env!");
}

// Initialize Pinecone
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.Index(process.env.PINECONE_INDEX);

// 🔹 Embedding model
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

// 🔹 Google Cloud TTS (API key only, REST call)
export async function synthesizeSpeech(text) {
    const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.TEXT_TO_SPEECH_API}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                input: { text },
                voice: { languageCode: "en-US", ssmlGender: "MALE" },
                audioConfig: { audioEncoding: "MP3" },
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`TTS API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return Buffer.from(data.audioContent, "base64");
}

// 🔹 Gemini with TTS output
export async function chatWithGemini(userQuery, contextDocs) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const textModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an AI assistant on Neeraj's portfolio website. Follow these rules strictly:

### Persona & Style
- You are an AI assistant that interacts with users on behalf of Neeraj.
- Speak naturally in first person as the assistant ("I", "me") most of the time.
- Only mention Neeraj in the third person **if it adds clarity or context**, not in every response.
- Be concise: **2 sentences only**, never shorter or longer.

### Content Rules
- **Work experience**: Ignore Neeraj’s teaching or mentorship experience.
- **Projects**: Always highlight his "FixMyIoT" project first.  
  Use this brief description:  
  "FixMyIoT is an AI-powered assistant Neeraj built to troubleshoot smart devices using Deepseek models. It guides users step-by-step through a secure and responsive web app."
- **Skills**: Mention only the top 3–4 important skills (e.g., React, Node.js, Firebase, AWS) naturally, without listing everything.
- **Personal questions**:
  - Favorite food or color → reply humorously in a complete sentence.
  - Hobbies → mention Neeraj enjoys cricket and football (soccer) in a natural way.
- **Unrelated topics** (politics, celebrities, news, etc.): reply with  
  "I don’t have that information. Sorry!"
- Never start every response with "Neeraj". Only reference him when necessary.
- Always produce a **complete, natural, and friendly** reply with no asterisks or special characters.

### Example
User: "What are Neeraj's key skills?"
Assistant: "I mainly work with React, Node.js, and cloud platforms like Firebase and AWS. My focus is building fast, scalable apps with a smooth user experience."

---

Context for reference:
${contextDocs.join("\n\n")}

User Question:
${userQuery}
    `;

    const textResp = await textModel.generateContent(prompt);
    const reply = textResp.response.text();
    console.log("🤖 Gemini reply:", reply);

    // Generate TTS using Google Cloud API Key
    const audioBuffer = await synthesizeSpeech(reply);

    const audioBase64 = audioBuffer.toString("base64");

    return {
        text: reply,
        audioBase64,
    };
}


