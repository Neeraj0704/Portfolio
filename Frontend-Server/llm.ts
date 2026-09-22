import dotenv from "dotenv";
import { pipeline, type FeatureExtractionPipeline } from "@xenova/transformers";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

let embedder: Promise<FeatureExtractionPipeline> | undefined;

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} environment variable`);
  return value;
}

async function getEmbedding(text: string): Promise<number[]> {
  // Share the initial model load between concurrent requests.
  embedder ??= pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2").catch((error) => {
    embedder = undefined;
    throw error;
  });
  const model = await embedder;
  const output = await model(text, { pooling: "mean", normalize: true });
  const embedding = Array.from(output.data as Float32Array);
  if (embedding.length !== 384) throw new Error(`Unexpected embedding length: ${embedding.length}`);
  return embedding;
}

export async function queryResume(queryText: string, topK = 5): Promise<string[]> {
  const pc = new Pinecone({ apiKey: requiredEnv("PINECONE_API_KEY") });
  const index = pc.Index(requiredEnv("PINECONE_INDEX"));
  const vector = await getEmbedding(queryText);
  const results = await index.query({ vector, topK, includeMetadata: true });
  return results.matches.map((match) => (match.metadata as { text?: string })?.text || "");
}

export async function synthesizeSpeech(text: string): Promise<Buffer> {
  const response = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": requiredEnv("TEXT_TO_SPEECH_API") },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: "en-US", ssmlGender: "MALE" },
      audioConfig: { audioEncoding: "MP3" },
    }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`TTS API request failed: ${response.status}`);
  const data = await response.json() as { audioContent?: string };
  if (!data.audioContent) throw new Error("TTS API returned no audio");
  return Buffer.from(data.audioContent, "base64");
}

export async function chatWithGemini(userQuery: string, contextDocs: string[]) {
  const genAI = new GoogleGenerativeAI(requiredEnv("GEMINI_API_KEY"));
  const textModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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

  const textResp = await textModel.generateContent(prompt);
  const text = textResp.response.text();
  const audio = await synthesizeSpeech(text);
  return { text, audioBase64: audio.toString("base64"), audioMimeType: "audio/mpeg" };
}
