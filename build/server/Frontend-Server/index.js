import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS (only needed in dev mode)
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173", // frontend dev server
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
    })
  );
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register API routes
registerRoutes(app);

// ✅ Serve frontend from dist
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

// ✅ Catch-all route (send index.html)
app.get("/*\w", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Use Render's PORT or fallback to 3000 locally
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});
