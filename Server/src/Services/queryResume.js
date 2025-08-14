import { pipeline } from "@xenova/transformers";
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

// Load Pinecone
const pc = new Pinecone({ 
  apiKey: process.env.PINECONE_API_KEY 
});
const index = pc.Index(process.env.PINECONE_INDEX);

let embedder = null;

// Initialize embedding model (same as used in uploadResume.js)
async function initializeEmbedder() {
  if (!embedder) {
    console.log("⏳ Loading embedding model...");
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2" // 384-dim - same model as upload
    );
    console.log("✅ Embedding model loaded!");
  }
  return embedder;
}

// Convert text to embedding
async function getEmbedding(text) {
  const model = await initializeEmbedder();
  const output = await model(text, { pooling: "mean", normalize: true });
  const embedding = Array.from(output.data);
  
  if (embedding.length !== 384) {
    throw new Error(`❌ Embedding dimension mismatch: got ${embedding.length}, expected 384`);
  }
  
  return embedding;
}

// Query vector database
export async function queryResume(queryText, topK = 5) {
  try {
    console.log(`🔍 Querying: "${queryText}"`);
    
    // Get embedding for query
    const queryEmbedding = await getEmbedding(queryText);
    
    // Search Pinecone
    console.log("📡 Searching Pinecone...");
    const results = await index.query({
      vector: queryEmbedding,
      topK: topK,
      includeMetadata: true,
    });
    
    console.log(`✅ Found ${results.matches.length} results`);
    
    // Format results
    const formattedResults = results.matches.map(match => ({
      id: match.id,
      score: match.score,
      text: match.metadata?.text || "No text available"
    }));
    
    return formattedResults;
    
  } catch (error) {
    console.error("❌ Query error:", error);
    throw error;
  }
}

// Speech recognition using Web Speech API (for browser)
export function startVoiceRecognition() {
  return new Promise((resolve, reject) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      reject(new Error('Speech recognition not supported'));
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      console.log('🎤 Voice recognition started');
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('🗣️ Recognized:', transcript);
      resolve(transcript);
    };
    
    recognition.onerror = (event) => {
      console.error('❌ Speech recognition error:', event.error);
      reject(new Error(`Speech recognition error: ${event.error}`));
    };
    
    recognition.onend = () => {
      console.log('🎤 Voice recognition ended');
    };
    
    recognition.start();
  });
}

// Voice query function that combines speech recognition and vector search
export async function voiceQueryResume(topK = 5) {
  try {
    console.log("🎤 Starting voice query...");
    
    // Get voice input
    const spokenQuery = await startVoiceRecognition();
    console.log(`🗣️ You said: "${spokenQuery}"`);
    
    // Query the resume
    const results = await queryResume(spokenQuery, topK);
    
    return {
      query: spokenQuery,
      results: results
    };
    
  } catch (error) {
    console.error("❌ Voice query error:", error);
    throw error;
  }
}