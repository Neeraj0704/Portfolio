// test.js
import { KokoroTTS } from "kokoro-js";
import fs from "fs";

async function main() {
  const [text, outFile] = process.argv.slice(2);

  if (!text || !outFile) {
    console.error("Usage: node test.js <text> <outFile>");
    process.exit(1);
  }

  const model_id = "onnx-community/Kokoro-82M-ONNX";
  const tts = await KokoroTTS.from_pretrained(model_id, { dtype: "q8" });

  // 👇 fixed voice: am_michael
  const audio = await tts.generate(text, { voice: "am_puck" });
  await audio.save(outFile);

  // Print the file path so llm.ts can grab it
  console.log(outFile);
}

main();
