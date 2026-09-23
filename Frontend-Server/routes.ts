import { type Express } from "express";
import nodemailer from "nodemailer";
import { queryResume, chatWithGemini } from "./llm.js";
import { withDeadline } from "./deadline.js";

export function registerRoutes(app: Express) {
  app.post("/api/contact/send", async (req, res) => {
    const { name, email, subject, message } = req.body || {};
    if (![name, email, message].every((value) => typeof value === "string" && value.trim()) ||
        (subject !== undefined && typeof subject !== "string")) {
      res.status(400).json({ error: "Please fill in all required fields." });
      return;
    }
    if (!process.env.SMTP_APP_PASSWORD) {
      res.status(503).json({ error: "Contact form is unavailable. Please email Neeraj directly." });
      return;
    }

    try {
      const user = process.env.SMTP_USER || "neerajvpattanashetti@gmail.com";
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass: process.env.SMTP_APP_PASSWORD },
      });
      await transporter.sendMail({
        from: user,
        replyTo: email,
        to: user,
        subject: subject || "New Contact Form Message",
        text: `From: ${name} <${email}>\n\n${message}`,
      });
      res.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    const { query } = req.body || {};
    if (typeof query !== "string" || !query.trim() || query.length > 2000) {
      res.status(400).json({ error: "Query must contain 1 to 2000 characters" });
      return;
    }
    try {
      const started = performance.now();
      const contextDocs = await withDeadline(() => queryResume(query.trim()), 10_000);
      const contextReady = performance.now();
      const reply = await chatWithGemini(query.trim(), contextDocs);
      res.setHeader("Server-Timing", `context;dur=${(contextReady - started).toFixed(1)}, reply;dur=${(performance.now() - contextReady).toFixed(1)}`);
      res.json(reply);
    } catch (error) {
      console.error("Chat unavailable:", { name: (error as Error).name, status: (error as { status?: number }).status });
      res.status(503).json({ error: "The AI service is busy right now. Please try again shortly." });
    }
  });
}
