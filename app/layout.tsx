import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { ADS_ENABLED, ADSENSE_CLIENT } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: "Guess XI: World Cup",
  description: "Guess the World Cup player from the shirt and clues.",
  applicationName: "Guess XI: World Cup",
  manifest: "/manifest.json",
  other: {
    "google-adsense-account": "ca-pub-2518560260230499"
  },
  appleWebApp: {
    capable: true,
    title: "Guess XI WC",
    statusBarStyle: "black-translucent"
  }
};

export const viewport: Viewport = {
  themeColor: "#0b6b3a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {ADS_ENABLED && ADSENSE_CLIENT ? (
          <Script
            async
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            strategy="afterInteractive"
          />
        ) : null}
        {children}
      </body>
    </html>
  );
}
