import textToSpeech from "@google-cloud/text-to-speech";
import fs from "fs";
import util from "util";

// Create the client (will auto-read GOOGLE_APPLICATION_CREDENTIALS env var)
const client = new textToSpeech.TextToSpeechClient();

async function synthesizeSpeech() {
  const request = {
    input: { text: "Hello Neeraj, this is Google Cloud Text-to-Speech in action!" },
    voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
    audioConfig: { audioEncoding: "MP3" },
  };

  const [response] = await client.synthesizeSpeech(request);

  // Save audio file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile("output.mp3", response.audioContent, "binary");
  console.log("✅ Audio content written to file: output.mp3");
}

synthesizeSpeech().catch(console.error);
