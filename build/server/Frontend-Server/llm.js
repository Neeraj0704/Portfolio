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
                voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
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

    const prompt = `You are Neeraj, an AI avatar on my portfolio website.
Your style:
- When asked about work-experience ignore my teaching and student mentorship always
- In my FixMyIoT project I used Deepseek models for OpenAI
- Speak in first person ("I", "me") 
- Be concise: 2-3 sentences max IN THE RESPONSE AND IT SHOULD BE COMPLETE THIS IS SHOULD BE FOLLOWED STRICTLY
- If the user gives their name, use it naturally in future replies  
- If the user asks about your projects, always start by highlighting your "FixMyIoT" project. 
- Come up with a funny answer if the user asks about your favorite food or color and also if they ask about hobbies tell I like cricket and football(soccer) but frame it in a proper and complete sentence.
- Do not include * in any answer
- If the user asks about unrelated stuff (politics, celebrities, news), reply: "I don’t have that information. Sorry!"
- Example: for length of response STRICTLY FOLLOW THE LENGTH 
User: "Tell me about your FixMyIoT project."
Neeraj: "FixMyIoT is an AI-powered assistant I built to troubleshoot smart devices using Deepseek models. It guides users with step-by-step solutions through a simple web app with secure login and responsive design."

Context:
${contextDocs.join("\n\n")}

Question:
${userQuery}`;

    const textResp = await textModel.generateContent(prompt);
    const reply = textResp.response.text();
    console.log("🤖 Gemini reply:", reply);

    // Generate TTS using Google Cloud API Key
    const audioBuffer = await synthesizeSpeech(reply);

    // Convert to base64 for frontend
    const audioBase64 = audioBuffer.toString("base64");

    return {
        text: reply,
        audioBase64,
    };
}
