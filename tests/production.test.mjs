import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { synthesizeSpeech } from "../build/server/Frontend-Server/llm.js";

let server;
let base;
before(async () => {
  server = spawn(process.execPath, ["build/server/Frontend-Server/index.js"], {
    env: { ...process.env, PORT: "0", NODE_ENV: "test", SMTP_APP_PASSWORD: "" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Server startup timed out: " + output)), 15000);
    server.stderr.on("data", (data) => { output += data; });
    server.stdout.on("data", (data) => {
      output += data;
      const match = output.match(/Server listening on port (\d+)/);
      if (match) {
        base = "http://127.0.0.1:" + match[1];
        clearTimeout(timer);
        resolve();
      }
    });
    server.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error("Server exited with " + code + ": " + output));
    });
  });
});
after(async () => {
  if (server && server.exitCode === null) {
    const exited = new Promise((resolve) => server.once("exit", resolve));
    server.kill();
    await exited;
  }
});

test("the compiled server serves health, the built frontend and SPA routes", async () => {
  const health = await fetch(base + "/api/health");
  assert.equal(health.status, 200);
  assert.equal((await health.json()).status, "ok");
  for (const path of ["/", "/portfolio/nested-route"]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /<div id="root"><\/div>/);
  }
});

test("resume downloads contain the exact current PDF", async () => {
  const response = await fetch(base + "/Neeraj_V_Pattanashetti_Resume.pdf");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /application\/pdf/);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), await readFile("public/Neeraj_V_Pattanashetti_Resume.pdf"));
});

test("missing API routes and assets do not return the SPA HTML", async () => {
  for (const path of ["/api/missing", "/missing.glb"]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 404);
  }
});

test("invalid chat requests are rejected before calling AI providers", async () => {
  for (const body of [{}, { query: "   " }, { query: {} }, { query: "x".repeat(2001) }]) {
    const response = await fetch(base + "/api/chat", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    assert.equal(response.status, 400);
  }
});

test("contact requests require valid fields and configured mail credentials", async () => {
  const post = (body) => fetch(base + "/api/contact/send", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  assert.equal((await post({ name: {}, email: "test@example.com", message: "test" })).status, 400);
  assert.equal((await post({ name: "Test", email: "test@example.com", message: "test" })).status, 503);
});

test("Google TTS preserves the deployed MP3 contract and handles provider failures", async (t) => {
  const previousKey = process.env.TEXT_TO_SPEECH_API;
  process.env.TEXT_TO_SPEECH_API = "test-key";
  t.after(() => {
    if (previousKey === undefined) delete process.env.TEXT_TO_SPEECH_API;
    else process.env.TEXT_TO_SPEECH_API = previousKey;
  });
  const audio = Buffer.from("test MP3 bytes");
  const fetchMock = t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://texttospeech.googleapis.com/v1/text:synthesize");
    assert.equal(options.headers["X-Goog-Api-Key"], "test-key");
    assert.equal(JSON.parse(options.body).audioConfig.audioEncoding, "MP3");
    return Response.json({ audioContent: audio.toString("base64") });
  });
  assert.deepEqual(await synthesizeSpeech("Hello"), audio);
  fetchMock.mock.mockImplementation(async () => new Response("", { status: 403 }));
  await assert.rejects(synthesizeSpeech("Hello"), /TTS API request failed: 403/);
  fetchMock.mock.mockImplementation(async () => Response.json({}));
  await assert.rejects(synthesizeSpeech("Hello"), /no audio/);
});
