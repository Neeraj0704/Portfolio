import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { withDeadline } from "../build/server/Frontend-Server/deadline.js";
import { generateReply, chatWithGemini } from "../build/server/Frontend-Server/llm.js";

const reply = "Neeraj works with Python and React. His projects include AI and web applications.";
const answer = () => Response.json({
  candidates: [{ content: { role: "model", parts: [{ text: reply }] }, finishReason: "STOP" }],
});

beforeEach((t) => {
  for (const name of ["GEMINI_API_KEY", "TEXT_TO_SPEECH_API"]) {
    const previous = process.env[name];
    process.env[name] = "test-key";
    t.after(() => {
      if (previous === undefined) delete process.env[name];
      else process.env[name] = previous;
    });
  }
});

test("deadlines abort stalled tasks and also reject tasks that ignore cancellation", async () => {
  let signal;
  await assert.rejects(withDeadline((value) => {
    signal = value;
    return new Promise(() => {});
  }, 10), { name: "TimeoutError" });
  assert.equal(signal.aborted, true);
  assert.equal(await withDeadline(async () => "ready", 100), "ready");
});

test("portfolio replies use Flash-Lite without a thinking pass", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.match(url, /models\/gemini-2.5-flash-lite:generateContent$/);
    assert.equal(JSON.parse(options.body).generationConfig.thinkingConfig.thinkingBudget, 0);
    assert.ok(options.signal instanceof AbortSignal);
    return answer();
  });
  assert.equal(await generateReply("skills?"), reply);
  assert.equal(fetchMock.mock.callCount(), 1);
});

test("overload switches to Flash once, while authentication failures are not retried", async (t) => {
  let attempts = 0;
  const fetchMock = t.mock.method(globalThis, "fetch", async (url) => {
    if (++attempts === 1) return Response.json({ error: { message: "Busy" } }, { status: 503 });
    assert.match(url, /models\/gemini-2.5-flash:generateContent$/);
    return answer();
  });
  assert.equal(await generateReply("skills?"), reply);
  assert.equal(attempts, 2);
  fetchMock.mock.mockImplementation(async () => Response.json({ error: { message: "Forbidden" } }, { status: 403 }));
  await assert.rejects(generateReply("skills?"), { status: 403 });
  assert.equal(fetchMock.mock.callCount(), 3);
});

test("a hung primary request is aborted after eight seconds and falls back", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let firstSignal;
  let attempts = 0;
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    if (++attempts === 1) {
      firstSignal = options.signal;
      return new Promise(() => {});
    }
    return answer();
  });
  const pending = generateReply("skills?");
  await new Promise(setImmediate);
  t.mock.timers.tick(8_000);
  assert.equal(await pending, reply);
  assert.equal(firstSignal.aborted, true);
  assert.equal(attempts, 2);
});

test("failure of both models stops after two attempts", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", async () =>
    Response.json({ error: { message: "Busy" } }, { status: 503 }));
  await assert.rejects(generateReply("skills?"), { status: 503 });
  assert.equal(fetchMock.mock.callCount(), 2);
});

test("speech failure preserves the successful text answer", async (t) => {
  t.mock.method(globalThis, "fetch", async (url) => url.includes("texttospeech")
    ? new Response("", { status: 503 }) : answer());
  const result = await chatWithGemini("skills?", ["Python and React"]);
  assert.equal(result.text, reply);
  assert.equal(result.audioBase64, null);
});

test("speech timeout returns text after six seconds", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let speechSignal;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    if (url.includes("texttospeech")) {
      speechSignal = options.signal;
      return new Promise(() => {});
    }
    return answer();
  });
  const pending = chatWithGemini("skills?", ["Python and React"]);
  await new Promise(setImmediate);
  assert.ok(speechSignal);
  t.mock.timers.tick(6_000);
  const result = await pending;
  assert.equal(result.text, reply);
  assert.equal(result.audioBase64, null);
  assert.equal(speechSignal.aborted, true);
});

test("successful speech retains the avatar audio contract", async (t) => {
  const audioBase64 = Buffer.from("MP3 bytes").toString("base64");
  t.mock.method(globalThis, "fetch", async (url) => url.includes("texttospeech")
    ? Response.json({ audioContent: audioBase64 }) : answer());
  assert.deepEqual(await chatWithGemini("skills?", ["Python and React"]), {
    text: reply, audioBase64, audioMimeType: "audio/mpeg",
  });
});
