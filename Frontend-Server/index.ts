import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes.ts";

const app = express();

// ✅ Enable CORS for frontend
app.use(
  cors({
    origin: "http://localhost:5173", // frontend dev server
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Register all routes
console.log("1");
registerRoutes(app);

// ✅ Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

