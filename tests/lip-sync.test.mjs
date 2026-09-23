import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { buildSpeechEnvelope, getMouthOpenness } from "../src/lib/lip-sync.js";

function audioBuffer(channels, sampleRate = 1000) {
  return {
    sampleRate,
    length: channels[0].length,
    numberOfChannels: channels.length,
    getChannelData: (channel) => channels[channel],
  };
}

test("mouth movement follows speech bursts and closes during silence", () => {
  const samples = new Float32Array(100);
  samples.fill(0.1, 20, 40);
  samples.fill(0.3, 60, 80);
  const envelope = buildSpeechEnvelope(audioBuffer([samples]));
  const audio = { paused: false, ended: false, currentTime: 0 };
  const playback = { audio, envelope };
  assert.equal(getMouthOpenness(playback), 0);
  audio.currentTime = 0.02;
  const quietSpeech = getMouthOpenness(playback);
  assert.ok(quietSpeech > 0.2);
  audio.currentTime = 0.04;
  assert.equal(getMouthOpenness(playback), 0);
  audio.currentTime = 0.06;
  assert.ok(getMouthOpenness(playback) > quietSpeech);
  assert.ok(getMouthOpenness(playback) <= 1);
  audio.currentTime = 0.08;
  assert.equal(getMouthOpenness(playback), 0);
});

test("paused, ended, cleared, and out-of-range audio leave the mouth closed", () => {
  const envelope = buildSpeechEnvelope(audioBuffer([new Float32Array(100).fill(0.2)]));
  const audio = { paused: true, ended: false, currentTime: 0.02 };
  assert.equal(getMouthOpenness({ audio, envelope }), 0);
  audio.paused = false;
  audio.ended = true;
  assert.equal(getMouthOpenness({ audio, envelope }), 0);
  audio.ended = false;
  audio.currentTime = 10;
  assert.equal(getMouthOpenness({ audio, envelope }), 0);
  assert.equal(getMouthOpenness(null), 0);
  assert.equal(getMouthOpenness({ audio, envelope: null }), 0);
});

test("stereo phase cancellation and near-silent noise do not distort the envelope", () => {
  const mono = new Float32Array(40).fill(0.2);
  const inverted = new Float32Array(40).fill(-0.2);
  assert.deepEqual(
    buildSpeechEnvelope(audioBuffer([mono, inverted])).levels,
    buildSpeechEnvelope(audioBuffer([mono])).levels
  );
  const noise = new Float32Array(40).fill(0.001);
  assert.deepEqual(Array.from(buildSpeechEnvelope(audioBuffer([noise])).levels), [0, 0]);
});

test("partial frames and different sample rates preserve speech timing", () => {
  const envelope = buildSpeechEnvelope(audioBuffer([new Float32Array(1200).fill(0.2)], 48000));
  assert.equal(envelope.frameSeconds, 0.02);
  assert.equal(envelope.levels.length, 2);
  assert.ok(Array.from(envelope.levels).every((value) => Number.isFinite(value) && value > 0));
});

test("the shipped avatar contains the mouth control used by lip sync", async () => {
  const glb = await readFile("public/68994a8568086dd7c6759d42.glb");
  const model = JSON.parse(glb.subarray(20, 20 + glb.readUInt32LE(12)).toString());
  const face = model.meshes.find((mesh) => mesh.name === "Wolf3D_Avatar");
  const mouthIndex = face.extras.targetNames.indexOf("mouthOpen");
  assert.ok(mouthIndex >= 0);
  assert.ok(face.primitives[0].targets[mouthIndex].POSITION !== undefined);
});
