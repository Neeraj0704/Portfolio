import { queryResume } from "./Services/queryResume.js";
import dotenv from "dotenv";

dotenv.config();

async function testQuery() {
  try {
    // Check environment variables first
    if (!process.env.PINECONE_API_KEY) {
      console.error("❌ PINECONE_API_KEY not set in environment variables");
      process.exit(1);
    }

    if (!process.env.PINECONE_INDEX) {
      console.error("❌ PINECONE_INDEX not set in environment variables");
      process.exit(1);
    }

    console.log("🧪 Testing query functionality...");
    console.log(`Using index: ${process.env.PINECONE_INDEX}\n`);

    const question = "What are your skills?";
    const response = await queryResume(question);
    console.log("✅ Query successful!");
    console.log("❓ Question:", question);
    console.log("💡 Answer:", response);
  } catch (error) {
    console.error("❌ An error occurred during the query test:", error);
    process.exit(1);
  }
}

testQuery();