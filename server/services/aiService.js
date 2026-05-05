import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const OPENROUTER_TIMEOUT = 45000;
const OPENROUTER_CHAT_MODEL = "openrouter/free";
const OPENROUTER_EMBED_MODEL = "openai/text-embedding-3-small";

class AIService {
  constructor() {
    const key = process.env.GEMINI_API_KEY;
    this.hasGemini = false;
    if (key && key.trim().length > 0) {
      try {
        this.ai = new GoogleGenAI({ apiKey: key });
        this.hasGemini = true;
        console.log("[AI] Gemini Initialized Successfully");
      } catch (err) {
        console.error("[AI] Initialization Error:", err.message);
      }
    }
  }

  async generateEmbedding(text) {
    if (this.hasGemini) {
      try {
        const result = await this.ai.models.embedContent({
          model: "gemini-embedding-001",
          contents: text,
        });
        return result.embeddings[0].values;
      } catch (error) {
        console.error("[AI] Gemini Embed Failed:", error.message);
      }
    }
    return this.generateOpenRouterEmbedding(text);
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
          console.warn(
            "[AI] Gemini quota exhausted, falling back to OpenRouter...",
          );
        } else {
          console.error("[AI] Gemini Chat Failed:", err.message);
        }
      }
    }
    return this.askOpenRouter(fullPrompt);
  }

  async generateOpenRouterEmbedding(text) {
    const key = process.env.OPENROUTER_API_KEY;
    const response = await axios.post(
      "https://openrouter.ai/api/v1/embeddings",
      { model: OPENROUTER_EMBED_MODEL, input: text },
      {
        headers: { Authorization: `Bearer ${key}` },
        timeout: OPENROUTER_TIMEOUT,
      },
    );
    return response.data.data[0].embedding;
  }

  async askOpenRouter(prompt) {
    const key = process.env.OPENROUTER_API_KEY;
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: OPENROUTER_CHAT_MODEL,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: { Authorization: `Bearer ${key}` },
        timeout: OPENROUTER_TIMEOUT,
      },
    );
    return response.data.choices[0].message.content;
  }
}

export default new AIService();
