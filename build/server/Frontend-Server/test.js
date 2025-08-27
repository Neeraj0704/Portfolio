import textToSpeech from "@google-cloud/text-to-speech";
import fs from "fs";
import util from "util";

// Load your API key from environment variable
const apiKey = process.env.TEXT_TO_SPEECH_API;

// Create the client with the API key
const client = new textToSpeech.TextToSpeechClient({
  key: apiKey,
});

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
