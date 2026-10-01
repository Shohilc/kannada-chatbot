import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

export async function askGemini(prompt) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });
  return response.text;
}