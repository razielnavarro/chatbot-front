"use client";

import { SessionProvider } from "@/src/contexts/SessionContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
