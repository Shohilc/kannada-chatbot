 import { GoogleGenAI, ThinkingLevel } from "@google/genai";
 import { SYSTEM_PROMPT } from "./prompts.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = process.env.GEMINI_MODEL || " gemini-3.6-flash";

 export async function askGemini(prompt) {
   const response = await ai.models.generateContent({
     model: MODEL,
     contents: prompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      thinkingConfig: { includeThoughts: true, thinkingLevel: ThinkingLevel.HIGH },
   },
   });
   console.log(JSON.stringify(response.candidates?.[0]?.content?.parts?.map((p) => p.text)));
   return response.text;
 }
 
export async function* streamGemini(messages) {
  const contents = messages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));
  const stream = await ai.models.generateContentStream({
    model: MODEL,
    contents,
    config: { systemInstruction: SYSTEM_PROMPT },
  });
   for await (const chunk of stream) {
    const parts = chunk.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      if (!part.text) continue;
      yield { type: part.thought ? "thought" : "answer", text: part.text };
    }
  }
 }
