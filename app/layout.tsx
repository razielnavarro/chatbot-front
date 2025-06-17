import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/src/components/providers";

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
