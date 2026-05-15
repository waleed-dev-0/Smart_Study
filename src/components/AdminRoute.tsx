import React from 'react';
import { Navigate } from "react-router-dom";

function getTokenPayload(): { id: string; role: string } | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const payload = getTokenPayload();

  if (!payload) {
    return <Navigate to="/login" replace />;
  }

  if (payload.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
