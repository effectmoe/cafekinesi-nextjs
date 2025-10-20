import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/Providers";
import VisualEditing from "@/app/components/VisualEditing";
import InAppBrowserNotice from "@/components/InAppBrowserNotice";
import UnregisterServiceWorker from "@/components/UnregisterServiceWorker";
import { draftMode } from 'next/headers';
import "./globals.css";
import "@/styles/accessibility.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cafe Kinesi",
  description: "Welcome to Cafe Kinesi",
  manifest: '/api/manifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'カフェキネシ',
  },
  icons: {
    icon: [
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
      { url: '/logo.png', type: 'image/png' }
    ],
    apple: [
      { url: '/pwa-apple-touch.png', type: 'image/png' }
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: '#8B7355',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const draft = await draftMode();
  const isEnabled = draft.isEnabled;

  return (
    <html lang="ja">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <UnregisterServiceWorker />
          <InAppBrowserNotice />
          <a href="#main-content" className="skip-to-content">
            メインコンテンツへスキップ
          </a>
          <main id="main-content" role="main">
            {children}
          </main>
          {isEnabled && <VisualEditing />}
        </Providers>
      </body>
    </html>
  );
}
// Force rebuild at 2025-01-22 14:00 - Clear cache for blog design updates
// Force redeploy #午後
