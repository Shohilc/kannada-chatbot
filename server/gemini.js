 import { GoogleGenAI } from "@google/genai";
 import { SYSTEM_PROMPT } from "./prompts.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = process.env.GEMINI_MODEL || " gemini-3.6-flash";

 export async function askGemini(prompt) {
   const response = await ai.models.generateContent({
     model: MODEL,
     contents: prompt,
   config: { systemInstruction: SYSTEM_PROMPT },
   });
   return response.text;
 }
  export async function* streamGemini(prompt) {
   const stream = await ai.models.generateContentStream({
     model: MODEL,
     contents: prompt,
     config: { systemInstruction: SYSTEM_PROMPT },
   });
  for await (const chunk of stream) {
    if (chunk.text) yield chunk.text;
  }
 }