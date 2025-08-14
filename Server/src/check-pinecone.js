import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

async function checkPineconeIndex() {
  try {
    console.log("🔍 Checking Pinecone configuration...");
    
    if (!process.env.PINECONE_API_KEY) {
      console.error("❌ PINECONE_API_KEY not found in environment variables");
      return;
    }
    
    if (!process.env.PINECONE_INDEX) {
      console.error("❌ PINECONE_INDEX not found in environment variables");
      return;
    }
    
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    
    // List all indexes
    console.log("📊 Fetching index information...");
    const indexes = await pc.listIndexes();
    console.log("Available indexes:", indexes.indexes?.map(idx => idx.name) || []);
    
    // Get specific index stats
    const indexName = process.env.PINECONE_INDEX;
    const index = pc.Index(indexName);
    
    const stats = await index.describeIndexStats();
    console.log("\n📈 Index Statistics:");
    console.log(`Index Name: ${indexName}`);
    console.log(`Dimension: ${stats.dimension || 'Unknown'}`);
    console.log(`Total Vector Count: ${stats.totalVectorCount || 0}`);
    console.log(`Index Fullness: ${stats.indexFullness || 0}`);
    
    if (stats.dimension && stats.dimension !== 384) {
      console.warn(`⚠️  WARNING: Index dimension (${stats.dimension}) doesn't match embedding model dimension (384)`);
      console.warn("You may need to use a different embedding model or recreate the index");
    } else {
      console.log("✅ Index dimension matches embedding model!");
    }
    
  } catch (error) {
    console.error("❌ Error checking Pinecone:", error.message);
  }
}

checkPineconeIndex();