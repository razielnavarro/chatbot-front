"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { config } from "@/lib/config";

interface Session {
  id: number;
  token: string;
  phone: string;
  state: string;
  orderId: number | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

interface SessionContextType {
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  refreshSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getSessionFromUrl = () => {
    if (typeof window === "undefined") return null;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("token");
  };

  const fetchSession = async (token: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${config.apiUrl}/api/sessions/${token}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Session not found or expired");
        }
        throw new Error("Failed to fetch session");
      }

      const sessionData = await response.json();
      setSession(sessionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = () => {
    const token = getSessionFromUrl();
    if (token) {
      fetchSession(token);
    } else {
      setIsLoading(false);
      setSession(null);
    }
  };

  useEffect(() => {
    const token = getSessionFromUrl();
    if (token) {
      fetchSession(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <SessionContext.Provider
      value={{ session, isLoading, error, refreshSession }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
