import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/src/contexts/SessionContext";

export const metadata: Metadata = {
  title: "Restaurant Menu",
  description: "Order your favorite food online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
