import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luigi's Burger",
  description: "Ordena YA!",
  generator: "Luigi's Burger",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
