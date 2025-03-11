import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "SysDiagramAI - Diagramas de Arquitectura Inteligentes",
  description: "Genera diagramas de arquitectura y modelos de datos usando inteligencia artificial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="light">
      <body
        className={`${inter.className} min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
