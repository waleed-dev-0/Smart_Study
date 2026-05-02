import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

class AIService {
  genAI = null;
  geminiModel = null;
  embeddingModel = null;

  openRouterModel = "minimax/minimax-m2.5:free";

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.geminiModel = this.genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
        });
        this.embeddingModel = this.genAI.getGenerativeModel({
          model: "text-embedding-004",
        });
        console.log("AI Service Initialized");
      } catch (err) {
        console.error("Failed to initialize AI Service:", err);
      }
    } else {
      console.warn("AI configuration incomplete, using secondary provider.");
    }
  }

  async generateEmbedding(text) {
    if (this.embeddingModel) {
      try {
        const result = await this.embeddingModel.embedContent(text);
        return result.embedding.values;
      } catch (error) {
        console.error("Primary embedding error, using fallback...", error);
      }
    }

    return this.generateOpenRouterEmbedding(text);
  }

  async generateOpenRouterEmbedding(text) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("API Configuration missing for embeddings");

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/embeddings",
        {
          model: "openai/text-embedding-3-small",
          input: text,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data.data[0].embedding;
    } catch (error) {
      console.error(
        "Embedding generation error:",
        error.response?.data || error.message,
      );
      throw new Error("Failed to generate content embedding");
    }
  }

  async askAI(prompt, context, provider = "gemini") {
    const fullPrompt = `
      You are an elite academic research assistant. Use the following context extracted from a student's textbook to provide a high-quality, accurate, and educational answer.
      
      RULES:
      1. If the answer is within the context, prioritize that information.
      2. If the context is insufficient, provide a general academic answer but clearly state it's based on general knowledge.
      3. Maintain a professional, clear, and encouraging tone.
      
      CONTEXT FROM DOCUMENT:
      ${context}
      
      STUDENT'S INQUIRY:
      ${prompt}
    `;

    if (provider === "gemini" && this.geminiModel) {
      try {
        const result = await this.geminiModel.generateContent(fullPrompt);
        return result.response.text();
      } catch (err) {
        console.error("Primary provider error, using fallback...", err);
      }
    }

    return this.askOpenRouter(fullPrompt);
  }

  async askOpenRouter(prompt) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("API Configuration missing");

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: this.openRouterModel,
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Smart Study Research Portal",
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.data?.choices || response.data.choices.length === 0) {
        throw new Error('Invalid response from AI provider');
      }

      return response.data.choices[0].message.content;
    } catch (error) {
      const errorMsg = error.response?.data?.error?.message || error.message;
      console.error("Service error:", errorMsg);
      throw new Error(`AI Service error: ${errorMsg}`);
    }
  }
}

export default new AIService();
