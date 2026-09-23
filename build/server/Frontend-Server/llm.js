import dotenv from "dotenv";
import { pipeline } from "@xenova/transformers";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { withDeadline } from "./deadline.js";
dotenv.config();
let embedder;
function requiredEnv(name) {
    const value = process.env[name];
    if (!value)
        throw new Error(`Missing ${name} environment variable`);
    return value;
}
async function getEmbedding(text) {
    // Share the initial model load between concurrent requests.
    embedder ??= pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2").catch((error) => {
        embedder = undefined;
        throw error;
    });
    const model = await embedder;
    const output = await model(text, { pooling: "mean", normalize: true });
    const embedding = Array.from(output.data);
    if (embedding.length !== 384)
        throw new Error(`Unexpected embedding length: ${embedding.length}`);
    return embedding;
}
export async function queryResume(queryText, topK = 5) {
    const pc = new Pinecone({ apiKey: requiredEnv("PINECONE_API_KEY") });
    const index = pc.Index(requiredEnv("PINECONE_INDEX"));
    const vector = await getEmbedding(queryText);
    const results = await index.query({ vector, topK, includeMetadata: true });
    return results.matches.map((match) => match.metadata?.text || "");
}
export async function synthesizeSpeech(text, signal = AbortSignal.timeout(6_000)) {
    const response = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Goog-Api-Key": requiredEnv("TEXT_TO_SPEECH_API") },
        body: JSON.stringify({
            input: { text },
            voice: { languageCode: "en-US", ssmlGender: "MALE" },
            audioConfig: { audioEncoding: "MP3" },
        }),
        signal,
    });
    if (!response.ok)
        throw new Error(`TTS API request failed: ${response.status}`);
    const data = await response.json();
    if (!data.audioContent)
        throw new Error("TTS API returned no audio");
    return Buffer.from(data.audioContent, "base64");
}
export async function generateReply(prompt) {
    const genAI = new GoogleGenerativeAI(requiredEnv("GEMINI_API_KEY"));
    const models = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];
    // Short portfolio answers do not need a reasoning pass.
    const generationConfig = {
        thinkingConfig: { thinkingBudget: 0 },
    };
    for (const [index, model] of models.entries()) {
        try {
            return await withDeadline(async (signal) => {
                const result = await genAI.getGenerativeModel({ model, generationConfig })
                    .generateContent(prompt, { signal });
                const text = result.response.text().trim();
                if (!text)
                    throw new Error("AI returned no answer");
                return text;
            }, 8_000);
        }
        catch (error) {
            const status = error.status;
            const transient = status === undefined || [404, 408, 429, 500, 502, 503, 504].includes(status);
            if (!transient || index === models.length - 1)
                throw error;
            console.warn("Chat model unavailable; trying fallback", { model, status: status ?? "timeout/network" });
        }
    }
    throw new Error("AI service unavailable");
}
export async function chatWithGemini(userQuery, contextDocs) {
    const prompt = `You are an AI assistant on Neeraj's portfolio website. Follow these rules strictly:

### Persona & Style
- You are an AI assistant that interacts with users on behalf of Neeraj.
- Speak naturally in first person as the assistant ("I", "me") most of the time.
- Be concise: 2 sentences only, never shorter or longer.

### Content Rules
- Projects: Always highlight projects that are relevant first.
- Skills: Mention only the top 3-4 important skills (e.g., Python, Java, React, Node.js, TypeScript) naturally, without listing everything.
- Favorite food or color: reply humorously in a complete sentence.
- Hobbies: mention Neeraj enjoys cricket and football (soccer) in a natural way.
- Unrelated topics (politics, celebrities, news, etc.): reply with "I don't have that information. Sorry!"
- Always produce a complete, natural, and friendly reply with no asterisks or special characters.

Context for reference:
${contextDocs.join("\n\n")}

User Question:
${userQuery}`;
    const text = await generateReply(prompt);
    try {
        const audio = await withDeadline((signal) => synthesizeSpeech(text, signal), 6_000);
        return { text, audioBase64: audio.toString("base64"), audioMimeType: "audio/mpeg" };
    }
    catch {
        console.warn("Chat speech unavailable; returning text answer");
        return { text, audioBase64: null, audioMimeType: "audio/mpeg" };
    }
}
