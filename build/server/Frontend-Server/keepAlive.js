// keepAlive.js
import cron from "node-cron";
import https from "https";

const url = "https://neeraj-v-p.onrender.com/"; // replace with your Render URL

// Run every 14 minutes (before Render's 15min idle cutoff)
cron.schedule("*/14 * * * *", () => {
  https.get(url, (res) => {
    if (res.statusCode === 200) {
      console.log("✅ Self-ping successful at", new Date().toLocaleTimeString());
    } else {
      console.log("⚠ Ping failed:", res.statusCode);
    }
  }).on("error", (err) => {
    console.error("❌ Ping error:", err.message);
  });
});