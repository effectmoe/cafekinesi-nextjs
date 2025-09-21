import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";
import "@/styles/accessibility.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cafe Kinesi",
  description: "Welcome to Cafe Kinesi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <a href="#main-content" className="skip-to-content">
            メインコンテンツへスキップ
          </a>
          <main id="main-content" role="main">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
// Force rebuild at 2025-01-22 - Clear Vercel cache
