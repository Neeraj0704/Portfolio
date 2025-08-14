import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

import express from 'express';
import cors from 'cors';
import queryRoutes from './routes/query.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Query routes
app.use('/api/query', queryRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Resume Query Server is running!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Resume Query Server is running on port ${PORT}`);
  console.log(`📡 API endpoints available:`);
  console.log(`   - GET  /api/test`);
  console.log(`   - POST /api/query/text`);
  console.log(`   - POST /api/query/voice`);
});



const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

async function test() {
  const indexes = await pc.listIndexes();
  console.log("Indexes:", indexes);
}

test();