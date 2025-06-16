"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Session {
  id: string;
  token: string;
  phone: string;
  state: string;
  orderId?: string;
  createdAt: string;
  updatedAt: string;
}

interface SessionContextType {
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  isLoading: true,
  error: null,
  refreshSession: async () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const fetchSession = async (token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sessions/${token}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch session");
      }
      const data = await response.json();
      setSession(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch session");
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    if (session?.token) {
      await fetchSession(session.token);
    }
  };

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      fetchSession(token);
    } else {
      setIsLoading(false);
      setError("No session token provided");
    }
  }, [searchParams]);

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
