import { useState } from "react";
import api from "../../../services/api";

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
  const [streamingText, setStreamingText] = useState("");

  const sendMessage = async (
    query: string,
    documentId: string,
    provider: "gemini" | "ollama" = "gemini",
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

    if (provider === "ollama") {
      await streamMessage(query, documentId);
    } else {
      await geminiMessage(query, documentId);
    }
  };

  const streamMessage = async (query: string, documentId: string) => {
    setIsLoading(true);
    setLoadingStatus("Searching document...");

    const statusTimer = setTimeout(
      () => setLoadingStatus("Generating answer..."),
      5000,
    );

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query,
          documentId,
          provider: "ollama",
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(
          errBody.message || `Request failed (${response.status})`,
        );
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          const data = JSON.parse(part.slice(6));

          if (data.token) {
            fullText += data.token;
            setStreamingText(fullText);
          } else if (data.error) {
            setMessages((prev) => [
              ...prev,
              {
                id: (Date.now() + 1).toString(),
                role: "ai" as const,
                text: data.error,
                timestamp: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                isError: true,
              },
            ]);
            return;
          }
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: fullText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Stream error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai" as const,
          text:
            error.message ||
            "I encountered an error processing your request. Please try again.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isError: true,
        },
      ]);
    } finally {
      clearTimeout(statusTimer);
      setStreamingText("");
      setIsLoading(false);
      setLoadingStatus("");
    }
  };

  const geminiMessage = async (query: string, documentId: string) => {
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
      const response = await api.post(
        "/chat",
        { query, documentId, provider: "gemini" },
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
      const response = await api.get(`/chat/${documentId}`, {
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
    streamingText,
    sendMessage,
    fetchHistory,
    setMessages,
  };
};
