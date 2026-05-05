import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";
const REQUEST_TIMEOUT_MS = 60_000;

export interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: string;
  isError?: boolean;
  citations?: { page: number; text: string }[];
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>("");

  const sendMessage = async (
    query: string,
    documentId: string,
    provider: "gemini" | "openrouter" = "gemini",
  ) => {
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setLoadingStatus("Searching document...");

    const statusTimer = setTimeout(
      () => setLoadingStatus("Generating answer..."),
      5000,
    );
    const slowTimer = setTimeout(
      () => setLoadingStatus("Almost there, this can take up to 30s..."),
      18000,
    );

    try {
      const response = await axios.post(
        `${API_URL}/chat`,
        { query, documentId, provider },
        { timeout: REQUEST_TIMEOUT_MS },
      );

      clearTimeout(statusTimer);
      clearTimeout(slowTimer);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: response.data.data.answer,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      clearTimeout(statusTimer);
      clearTimeout(slowTimer);
      console.error("Chat error:", error);

      const isTimeout =
        error.code === "ECONNABORTED" ||
        error.message?.toLowerCase().includes("timeout") ||
        error.response?.data?.message?.toLowerCase().includes("too long");

      const isNoDoc = error.response?.data?.message
        ?.toLowerCase()
        .includes("no indexed content");

      let errorText =
        "I encountered an error processing your request. Please try again.";
      if (isTimeout) {
        errorText =
          "The AI took too long to respond. Try a shorter question, or switch to a different provider using the toggle above.";
      } else if (isNoDoc) {
        errorText =
          "No indexed content was found for this document. Please re-upload the PDF so it can be processed correctly.";
      } else if (error.response?.data?.message) {
        errorText = error.response.data.message;
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: errorText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setLoadingStatus("");
    }
  };

  const fetchHistory = async (documentId: string) => {
    if (!documentId) return;
    setIsFetchingHistory(true);
    try {
      const response = await axios.get(`${API_URL}/chat/${documentId}`, {
        timeout: 10000,
      });
      if (response.data?.success && response.data.data?.length > 0) {
        setMessages(response.data.data);
      } else {
        setMessages([
          {
            id: "initial",
            role: "ai",
            text: "Welcome to the Research Portal. I have indexed your document. How may I assist your inquiry today?",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
      setMessages([
        {
          id: "initial",
          role: "ai",
          text: "Welcome to the Research Portal. I have indexed your document. How may I assist your inquiry today?",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsFetchingHistory(false);
    }
  };

  return {
    messages,
    isLoading,
    isFetchingHistory,
    loadingStatus,
    sendMessage,
    fetchHistory,
    setMessages,
  };
};
