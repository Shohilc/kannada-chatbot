import "dotenv/config";
import express from "express";
import cors from "cors";
import { askGemini, streamGemini } from "./gemini.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Kannada chatbot server is running" });
});

app.post("/api/chat", async (req, res) => {
 try {
    const { messages } = req.body;
   
    const valid = Array.isArray(messages) &&messages.length > 0 &&messages.every((m) => ["user", "bot"].includes(m.role) && typeof m.content === "string" );
    if (!valid) {
      return res.status(400).json({ error: "messages array is required" });
    }
    const reply = await askGemini(message);
    res.json({ reply });
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});app.post("/api/chat", async (req, res) => {
 try {
   const { message } = req.body;
    if (!message || typeof message !== "string") {
     return res.status(400).json({ error: "message is required" });
    }
    const reply = await askGemini(message);
    res.json({ reply });
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});
app.post("/api/chat/stream", async (req, res) => {
  const { messages } = req.body;
  const valid =
    Array.isArray(messages) &&
    messages.length > 0 &&
    messages.every(
      (m) => ["user", "bot"].includes(m.role) && typeof m.content === "string"
    );
  if (!valid) {
    return res.status(400).json({ error: "messages array is required" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    for await (const text of streamGemini(messages.slice(-20))) {
      send("answer", { text });
    }
    send("done", {});
  } catch (err) {
    console.error("Gemini stream error:", err.status, err.message);
    send("error", { message: "Something went wrong. Please try again." });
  } finally {
    res.end();
  }
});
 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});