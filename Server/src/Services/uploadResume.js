import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { pipeline } from "@xenova/transformers";
import { Pinecone } from "@pinecone-database/pinecone";

dotenv.config();

// Load Pinecone
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.Index(process.env.PINECONE_INDEX);

async function main() {
  console.log("⏳ Loading local embedding model...");
  const embedder = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2" // 384-dim
  );
  console.log("✅ Model loaded!");

  // Load resume JSON
  const jsonPath = path.join("src", "Data", "Resume.json");
  const chunks = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

  let vectors = [];
  for (const chunk of chunks) {
    console.log(`🔹 Embedding ${chunk.id}`);
    const output = await embedder(chunk.text, { pooling: "mean", normalize: true });
    const embedding = Array.from(output.data);

    if (embedding.length !== 384) {
      throw new Error(`❌ Embedding dimension mismatch: got ${embedding.length}, expected 384`);
    }

    vectors.push({
      id: chunk.id,
      values: embedding,
      metadata: { text: chunk.text },
    });
  }

  console.log("📤 Uploading to Pinecone...");
  await index.upsert(vectors);
  console.log("✅ Resume successfully stored in Pinecone!");
}

main();
