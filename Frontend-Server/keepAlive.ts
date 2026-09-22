import cron from "node-cron";
import https from "https";

if (process.env.NODE_ENV === "production") {
  const url = process.env.RENDER_EXTERNAL_URL || "https://neeraj-v-p.onrender.com/";
  cron.schedule("*/1 * * * *", () => {
    const request = https.get(url, (response) => {
      response.resume();
      if (response.statusCode !== 200) console.warn("Self-ping failed:", response.statusCode);
    });
    request.setTimeout(10_000, () => request.destroy());
    request.on("error", (error) => console.error("Self-ping error:", error.message));
  });
}
