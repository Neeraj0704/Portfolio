import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
const app = express();
// Enable CORS
app.use(cors({
    origin: "http://localhost:5173", // frontend dev server (local)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Register routes
registerRoutes(app);
// Use Render's PORT or fallback to 3000 locally
const PORT = Number(process.env.PORT) || 3000;
// ✅ Bind to 0.0.0.0 for Render
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});
