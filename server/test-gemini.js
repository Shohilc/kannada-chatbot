 import "dotenv/config";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const prompt =
  "Alice, Bob, and Carol each live in a different house: red, green, and blue. The person in the red house owns a cat. Bob does not live in the green house. Carol owns a dog. The green house is to the left of the red house. Alice does not own a cat. Who lives where, and who owns what?";

for (const name of ["default", "minimal", "low", "medium", "high"]) {
  const thinkingConfig = { includeThoughts: true };

  if (name !== "default") {
    const level = ThinkingLevel[name.toUpperCase()];
    if (!level) {
      console.log(name.padEnd(8), "not available in this SDK version");
      continue;
    }
    thinkingConfig.thinkingLevel = level;
  }

  try {
    const r = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: prompt,
      config: { thinkingConfig },
    });
    const parts = r.candidates[0].content.parts;
    console.log(
      name.padEnd(8),
      "| thought parts:",
      parts.filter((p) => p.thought).length,
      "| thinking tokens:",
      r.usageMetadata.thoughtsTokenCount ?? 0
    );
  } catch (e) {
    console.log(name.padEnd(8), "| error:", e.status, String(e.message).slice(0, 80));
  }
  await sleep(3000);
}