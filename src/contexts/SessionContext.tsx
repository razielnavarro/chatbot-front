"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  Suspense,
} from "react";
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

function SessionProviderContent({ children }: { children: React.ReactNode }) {
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

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </div>
      }
    >
      <SessionProviderContent>{children}</SessionProviderContent>
    </Suspense>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
