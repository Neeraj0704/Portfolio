import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { type AddressInfo } from "net";
import { registerRoutes } from "./routes.js";
import "./keepAlive.js";

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:5173" }));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", commit: process.env.RENDER_GIT_COMMIT || null });
});
registerRoutes(app);
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API route not found" });
});

const distPath = fileURLToPath(new URL("../../../dist", import.meta.url));
app.use(express.static(distPath));
app.get("/{*path}", (req, res) => {
  if (path.extname(req.path)) {
    res.sendStatus(404);
    return;
  }
  res.sendFile(path.join(distPath, "index.html"));
});

const port = Number(process.env.PORT || 3000);
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${(server.address() as AddressInfo).port}`);
});
