import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rothar Workshop | Taller de Bicicletas",
  description: "Taller de bicicletas especializado en mantenimiento, reparaciones y personalización. También encuentras partes y accesorios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-[#084C4C] text-[#E6DAB9]" suppressHydrationWarning>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}