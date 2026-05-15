import { GoogleGenAI } from "@google/genai";
import { Ollama } from "ollama";
import dotenv from "dotenv";
dotenv.config();

const OLLAMA_CHAT_MODEL = process.env.OLLAMA_CHAT_MODEL || "kimi-k2:1t-cloud";

class AIService {
  constructor() {
    const geminiKey = process.env.GEMINI_API_KEY;
    this.hasGemini = false;
    if (geminiKey && geminiKey.trim().length > 0) {
      try {
        this.ai = new GoogleGenAI({ apiKey: geminiKey });
        this.hasGemini = true;
      } catch (err) {
        console.error("[AI] Gemini Init Error:", err.message);
      }
    }

    const ollamaKey = process.env.OLLAMA_API_KEY;
    if (ollamaKey && ollamaKey.trim().length > 0) {
      try {
        this.ollama = new Ollama({
          host: "https://ollama.com",
          headers: { Authorization: `Bearer ${ollamaKey}` },
        });
      } catch (err) {
        console.error("[AI] Ollama Init Error:", err.message);
      }
    }
  }

  async generateEmbedding(text) {
    if (!this.hasGemini) {
      throw new Error("Gemini not configured - required for embeddings");
    }
    const result = await this.ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
    });
    return result.embeddings[0].values;
  }

  async askAI(prompt, context, provider = "gemini", history = "") {
    const fullPrompt = `Context:\n${context}\nHistory:\n${history}\nQuery:\n${prompt}`;

    if (provider === "gemini" && this.hasGemini) {
      try {
        const response = await this.ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: fullPrompt,
        });
        return response.text;
      } catch (err) {
        const isQuotaError =
          err.message?.includes("429") ||
          err.message?.includes("RESOURCE_EXHAUSTED") ||
          err.message?.includes("quota");

        if (isQuotaError) {
          console.warn("[AI] Gemini quota exhausted, falling back to Ollama...");
        } else {
          console.error("[AI] Gemini Chat Failed:", err.message);
        }
      }
    }

    if (!this.ollama) {
      throw new Error("Ollama provider not configured - missing OLLAMA_API_KEY");
    }
    const response = await this.ollama.chat({
      model: OLLAMA_CHAT_MODEL,
      messages: [{ role: "user", content: fullPrompt }],
    });
    return response.message.content;
  }

  async *askAIStream(prompt, context, provider = "gemini", history = "") {
    const fullPrompt = `Context:\n${context}\nHistory:\n${history}\nQuery:\n${prompt}`;

    if (provider === "gemini" && this.hasGemini) {
      const stream = await this.ai.models.generateContentStream({
        model: "gemini-flash-latest",
        contents: fullPrompt,
      });
      for await (const chunk of stream) {
        if (chunk.text) {
          yield { message: { content: chunk.text } };
        }
      }
      return;
    }

    if (!this.ollama) {
      throw new Error("Ollama provider not configured - missing OLLAMA_API_KEY");
    }
    const stream = await this.ollama.chat({
      model: OLLAMA_CHAT_MODEL,
      messages: [{ role: "user", content: fullPrompt }],
      stream: true,
    });
    for await (const part of stream) {
      yield part;
    }
  }
}

export default new AIService();
