const FRAME_SECONDS = 0.02;

export function buildSpeechEnvelope(audioBuffer) {
  const frameSize = Math.max(1, Math.round(audioBuffer.sampleRate * FRAME_SECONDS));
  const channels = Array.from(
    { length: audioBuffer.numberOfChannels },
    (_, channel) => audioBuffer.getChannelData(channel)
  );
  const levels = new Float32Array(Math.ceil(audioBuffer.length / frameSize));
  for (let frame = 0; frame < levels.length; frame++) {
    const start = frame * frameSize;
    const end = Math.min(start + frameSize, audioBuffer.length);
    let energy = 0;
    for (const channel of channels) {
      for (let sample = start; sample < end; sample++) {
        energy += channel[sample] * channel[sample];
      }
    }
    levels[frame] = Math.sqrt(energy / ((end - start) * channels.length));
  }

  // Normalize against voiced frames so pauses stay closed and quiet voices still move.
  const voiced = Array.from(levels).filter((level) => level > 0.008).sort((a, b) => a - b);
  const reference = Math.max(0.04, voiced[Math.floor(voiced.length * 0.9)] || 0);
  for (let frame = 0; frame < levels.length; frame++) {
    levels[frame] = Math.min(1, Math.max(0, (levels[frame] - 0.008) / reference));
  }
  return { levels, frameSeconds: frameSize / audioBuffer.sampleRate };
}

export function getMouthOpenness(playback) {
  const { audio, envelope } = playback || {};
  if (!audio || audio.paused || audio.ended || !envelope) return 0;
  const position = audio.currentTime / envelope.frameSeconds;
  const frame = Math.floor(position);
  const current = envelope.levels[frame] || 0;
  const next = envelope.levels[frame + 1] || 0;
  return current + (next - current) * (position - frame);
}

export async function decodeSpeechEnvelope(bytes) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  const context = new AudioContext();
  try {
    return buildSpeechEnvelope(await context.decodeAudioData(bytes));
  } finally {
    await context.close();
  }
}
