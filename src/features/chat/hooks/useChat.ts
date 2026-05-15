import { useState } from "react";
import api from "../../../services/api";
import { SSE_STREAM_URL } from "../../../config";
import { formatTime } from "../../../utils/formatTime";

const REQUEST_TIMEOUT_MS = 60_000;

export function getWelcomeMessage(isArabic?: boolean): string {
  return isArabic
    ? "مرحباً بك في بوابة البحث. لقد قمت بفهرسة مستندك. كيف يمكنني مساعدتك اليوم؟"
    : "Welcome to the Research Portal. I have indexed your document. How may I assist your inquiry today?";
}

export function getFreeWelcomeMessage(isArabic?: boolean): Message {
  const text = isArabic
    ? "مرحباً! أنا مساعدك الذكي. اسألني عن أي شيء، أو ارفع مستنداً لتحليله."
    : "Hello! I'm your AI assistant. Ask me anything, or upload a document to analyze.";
  return {
    id: "free-initial",
    role: "ai",
    text,
    timestamp: formatTime(),
  };
}

export interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: string;
  isError?: boolean;
  citations?: { page: number; text: string }[];
}

function createUserMessage(text: string): Message {
  return {
    id: Date.now().toString(),
    role: "user",
    text,
    timestamp: formatTime(),
  };
}

function createAIMessage(text: string, isError = false): Message {
  return {
    id: (Date.now() + 1).toString(),
    role: "ai",
    text,
    timestamp: formatTime(),
    isError,
  };
}

function createWelcomeMessage(isArabic?: boolean): Message {
  return {
    id: "initial",
    role: "ai",
    text: getWelcomeMessage(isArabic),
    timestamp: formatTime(),
  };
}

export const useChat = (isArabic?: boolean) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>("");
  const [streamingText, setStreamingText] = useState("");

  const lang = isArabic ? "Arabic" : "English";

  const statusText = {
    searching: isArabic ? "جاري البحث في المستند..." : "Searching document...",
    generating: isArabic ? "جاري إنشاء الإجابة..." : "Generating answer...",
    almostThere: isArabic ? "يكاد ينتهي، قد يستغرق هذا حتى 30 ثانية..." : "Almost there, this can take up to 30s...",
    thinking: isArabic ? "جاري التفكير..." : "Thinking...",
  };

  const errorTexts = {
    general: isArabic ? "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى." : "I encountered an error processing your request. Please try again.",
    timeout: isArabic ? "استغرق الذكاء الاصطناعي وقتاً طويلاً للرد. حاول بسؤال أقصر، أو قم بالتبديل إلى مزود آخر باستخدام المفاتيح أعلاه." : "The AI took too long to respond. Try a shorter question, or switch to a different provider using the toggle above.",
    noContent: isArabic ? "لم يتم العثور على محتوى مفهرس لهذا المستند. يرجى إعادة رفع PDF لمعالجته بشكل صحيح." : "No indexed content was found for this document. Please re-upload the PDF so it can be processed correctly.",
    failedResponse: isArabic ? "فشل في الحصول على الرد." : "Failed to get response.",
  };

  const sendMessage = async (
    query: string,
    documentId: string,
    provider: "gemini" | "ollama" = "gemini",
  ) => {
    if (!query.trim()) return;

    setMessages((prev) => [...prev, createUserMessage(query)]);

    if (provider === "ollama") {
      await streamMessage(query, documentId);
    } else {
      await geminiMessage(query, documentId);
    }
  };

  const streamMessage = async (query: string, documentId: string) => {
    setIsLoading(true);
    setLoadingStatus(statusText.searching);

    const statusTimer = setTimeout(
      () => setLoadingStatus(statusText.generating),
      5000,
    );

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(SSE_STREAM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query,
          documentId,
          provider: "ollama",
          language: lang,
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
              createAIMessage(data.error, true),
            ]);
            return;
          }
        }
      }

      setMessages((prev) => [...prev, createAIMessage(fullText)]);
    } catch (error: any) {
      console.error("Stream error:", error);
      setMessages((prev) => [
        ...prev,
        createAIMessage(
          error.message || errorTexts.general,
          true,
        ),
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
    setLoadingStatus(statusText.searching);

    const statusTimer = setTimeout(
      () => setLoadingStatus(statusText.generating),
      5000,
    );
    const slowTimer = setTimeout(
      () => setLoadingStatus(statusText.almostThere),
      18000,
    );

    try {
      const response = await api.post(
        "/chat",
        { query, documentId, provider: "gemini", language: lang },
        { timeout: REQUEST_TIMEOUT_MS },
      );

      clearTimeout(statusTimer);
      clearTimeout(slowTimer);

      setMessages((prev) => [
        ...prev,
        createAIMessage(response.data.data.answer),
      ]);
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

      let errorText = errorTexts.general;
      if (isTimeout) {
        errorText = errorTexts.timeout;
      } else if (isNoDoc) {
        errorText = errorTexts.noContent;
      } else if (error.response?.data?.message) {
        errorText = error.response.data.message;
      }

      setMessages((prev) => [...prev, createAIMessage(errorText, true)]);
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
        setMessages([createWelcomeMessage(isArabic)]);
      }
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
      setMessages([createWelcomeMessage(isArabic)]);
    } finally {
      setIsFetchingHistory(false);
    }
  };

  const clearMessages = () => setMessages([]);
  const setInitialMessages = (msgs: Message[]) => setMessages(msgs);

  const sendFreeMessage = async (
    query: string,
    provider: "gemini" | "ollama" = "gemini",
  ) => {
    if (!query.trim()) return;

    setMessages((prev) => [...prev, createUserMessage(query)]);

    if (provider === "ollama") {
      await freeStreamMessage(query);
    } else {
      await freeGeminiMessage(query);
    }
  };

  const freeGeminiMessage = async (query: string) => {
    setIsLoading(true);
    setLoadingStatus(statusText.thinking);
    try {
      const response = await api.post(
        "/chat/free",
        { query, provider: "gemini", language: lang },
        { timeout: REQUEST_TIMEOUT_MS },
      );
      setMessages((prev) => [
        ...prev,
        createAIMessage(response.data.data.answer),
      ]);
    } catch (error: any) {
      console.error("Free chat error:", error);
      setMessages((prev) => [
        ...prev,
        createAIMessage(
          error.response?.data?.message ||
            error.message ||
            errorTexts.general,
          true,
        ),
      ]);
    } finally {
      setIsLoading(false);
      setLoadingStatus("");
    }
  };

  const freeStreamMessage = async (query: string) => {
    setIsLoading(true);
    setLoadingStatus(statusText.thinking);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${api.defaults.baseURL}/chat/free/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query, provider: "ollama", language: lang }),
        },
      );

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.message || `Request failed (${response.status})`);
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
              createAIMessage(data.error, true),
            ]);
            return;
          }
        }
      }

      setMessages((prev) => [...prev, createAIMessage(fullText)]);
    } catch (error: any) {
      console.error("Free stream error:", error);
      setMessages((prev) => [
        ...prev,
        createAIMessage(
          error.message || errorTexts.failedResponse,
          true,
        ),
      ]);
    } finally {
      setStreamingText("");
      setIsLoading(false);
      setLoadingStatus("");
    }
  };

  return {
    messages,
    isLoading,
    isFetchingHistory,
    loadingStatus,
    streamingText,
    sendMessage,
    sendFreeMessage,
    fetchHistory,
    clearMessages,
    setInitialMessages,
  };
};
