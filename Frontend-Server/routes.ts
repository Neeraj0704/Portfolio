import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import nodemailer from "nodemailer";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Contact form route
  app.post("/api/contact/send", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "neerajvpattanashetti@gmail.com",
          pass: "Nakulneeraj@123", // Replace with Gmail App Password
        },
      });

      await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: "neerajvpattanashetti@gmail.com",
        subject: subject || "New Contact Form Message",
        text: `From: ${name} <${email}>\n\n${message}`,
      });

      res.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
