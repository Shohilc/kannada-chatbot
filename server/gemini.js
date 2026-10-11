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

  for (let attempt = 0; ; attempt++) {
    let started = false;
    try {
      const stream = await ai.models.generateContentStream({
        model: MODEL,
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          thinkingConfig: {
            includeThoughts: true,
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });

      for await (const chunk of stream) {
        const parts = chunk.candidates?.[0]?.content?.parts ?? [];
        for (const part of parts) {
          if (!part.text) continue;
          started = true;
          yield { type: part.thought ? "thought" : "answer", text: part.text };
        }
      }
      return;
    } catch (err) {
      const retryable = [429, 500, 503].includes(err.status);
      if (started || !retryable || attempt >= 2) throw err;
      await sleep(1000 * 2 ** attempt);
    }
  }
}
