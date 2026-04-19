import type { Metadata } from "next";
import { Bebas_Neue, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
});

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
    <html lang="es" className={`${bebas.variable} ${sourceSans.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#084C4C] text-[#E6DAB9] font-sans">
        {children}
      </body>
    </html>
  );
}