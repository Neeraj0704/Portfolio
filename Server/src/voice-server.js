import express from "express";
import cors from "cors";
import { queryResume } from "./Services/queryResume.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Voice Query Server is running!" });
});

// Query endpoint
app.post("/api/query", async (req, res) => {
  try {
    const { query, topK = 5 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "Query text is required" });
    }
    
    console.log(`📝 Received query: "${query}"`);
    const results = await queryResume(query, topK);
    
    res.json({
      success: true,
      query,
      results
    });
    
  } catch (error) {
    console.error("❌ Query error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Voice Query Server running on port ${PORT}`);
  console.log(`📡 Access at: http://localhost:${PORT}`);
});