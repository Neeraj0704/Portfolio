import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

async function test() {
  const indexes = await pc.listIndexes();
  console.log("Indexes:", indexes);
}

test();