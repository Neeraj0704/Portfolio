import fs from "fs";
import fetch from "node-fetch"; // If using Node 18+, you can use built-in fetch



export async function synthesizeSpeech(text, outputFile) {
    try {
        const response = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.TEXT_TO_SPEECH_API}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    input: { text },
                    voice: { languageCode: "en-US", ssmlGender: "MALE" },
                    audioConfig: { audioEncoding: "MP3" },
                }),
            }
        );

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        // Decode base64 audioContent and save as MP3
        const audioBuffer = Buffer.from(data.audioContent, "base64");
        fs.writeFileSync(outputFile, audioBuffer);
        console.log(`✅ Audio saved to ${outputFile}`);
    } catch (error) {
        console.error("❌ Error generating speech:", error.message);
    }
}

// Example usage (run this file directly with node)
if (process.argv[1].includes("test.js")) {
    synthesizeSpeech("Hello! I'm Neeraj's AI avatar. I can tell you about his experience, projects, and skills. You can either type your questions or use voice input. How can I help you today?"
    , "welcome.mp3");
}
