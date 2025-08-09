import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

// Initialize ElevenLabs client
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export interface VoiceConfig {
  voiceId: string;
  modelId: string;
  stability: number;
  similarityBoost: number;
}

// Default voice configuration for Satya's AI agent
const DEFAULT_VOICE_CONFIG: VoiceConfig = {
  voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel voice - professional and clear
  modelId: "eleven_monolingual_v1",
  stability: 0.5,
  similarityBoost: 0.8,
};

export async function generateSpeech(
  text: string,
  voiceConfig: Partial<VoiceConfig> = {}
): Promise<Buffer> {
  try {
    const config = { ...DEFAULT_VOICE_CONFIG, ...voiceConfig };
    
    const audioStream = await elevenlabs.textToSpeech.convert(config.voiceId, {
      text,
      modelId: config.modelId,
      voiceSettings: {
        stability: config.stability,
        similarityBoost: config.similarityBoost,
      },
    });

    // Convert stream to buffer
    const reader = audioStream.getReader();
    const chunks: Uint8Array[] = [];
    
    let done = false;
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      if (value) {
        chunks.push(value);
      }
    }
    
    // Combine all chunks into a single buffer
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    
    return Buffer.from(result);
  } catch (error: any) {
    if (error?.message) {
      throw new Error(`ElevenLabs API Error: ${error.message}`);
    }
    throw new Error(`Speech generation failed: ${error}`);
  }
}

export async function getAvailableVoices() {
  try {
    const voices = await elevenlabs.voices.getAll();
    return voices.voices;
  } catch (error: any) {
    if (error?.message) {
      throw new Error(`ElevenLabs API Error: ${error.message}`);
    }
    throw new Error(`Failed to fetch voices: ${error}`);
  }
}