declare global {
  interface ImportMeta {
    env: Record<string, string>;
  }
}

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

export const SSE_STREAM_URL = `${API_BASE_URL}/chat/stream`;
