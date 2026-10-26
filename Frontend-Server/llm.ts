import dotenv from "dotenv";
import { GoogleGenerativeAI, type GenerationConfig } from "@google/generative-ai";
import { withDeadline } from "./deadline.js";
import { resumeContext } from "./resume-context.js";

dotenv.config();

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} environment variable`);
  return value;
}

export async function queryResume(_queryText: string): Promise<string[]> {
  // The resume is small enough to include in full; no embedding download or remote lookup is needed.
  return [...resumeContext];
}

export async function synthesizeSpeech(text: string, signal = AbortSignal.timeout(6_000)): Promise<Buffer> {
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
  if (!response.ok) throw new Error(`TTS API request failed: ${response.status}`);
  const data = await response.json() as { audioContent?: string };
  if (!data.audioContent) throw new Error("TTS API returned no audio");
  return Buffer.from(data.audioContent, "base64");
}

export async function generateReply(prompt: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(requiredEnv("GEMINI_API_KEY"));
  const models = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];
  // Short portfolio answers do not need a reasoning pass.
  const generationConfig: GenerationConfig & { thinkingConfig: { thinkingBudget: number } } = {
    thinkingConfig: { thinkingBudget: 0 },
  };
  for (const [index, model] of models.entries()) {
    try {
      return await withDeadline(async (signal) => {
        const result = await genAI.getGenerativeModel({ model, generationConfig })
          .generateContent(prompt, { signal });
        const text = result.response.text().trim();
        if (!text) throw new Error("AI returned no answer");
        return text;
      }, 8_000);
    } catch (error) {
      const status = (error as { status?: number }).status;
      const transient = status === undefined || [404, 408, 429, 500, 502, 503, 504].includes(status);
      if (!transient || index === models.length - 1) throw error;
      console.warn("Chat model unavailable; trying fallback", { model, status: status ?? "timeout/network" });
    }
  }
  throw new Error("AI service unavailable");
}

export async function chatWithGemini(userQuery: string, contextDocs: string[]) {
  const prompt = `You are an AI assistant on Neeraj's portfolio website. Follow these rules strictly:

### Persona & Style
- You are an AI assistant that interacts with users on behalf of Neeraj.
- Speak naturally in first person as the assistant ("I", "me") most of the time.
- Be concise: 2 sentences only, never shorter or longer.

### Content Rules
- Use only the supplied resume and portfolio facts. Never invent employment, dates, metrics, goals, or credentials.
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
  } catch {
    console.warn("Chat speech unavailable; returning text answer");
    return { text, audioBase64: null, audioMimeType: "audio/mpeg" };
  }
}
