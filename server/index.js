import "dotenv/config";
import express from "express";
import cors from "cors";
import { askGemini } from "./gemini.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Kannada chatbot server is running" });
});

app.post("/api/chat", async (req, res) => {
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

 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});