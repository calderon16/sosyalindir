import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://sosyalindirapp.com"),
  title: "SosyalIndir — Instagram, TikTok & Facebook Video İndirici",
  description: "Instagram Reels, TikTok ve Facebook Reels videolarını filigransız, hızlı ve %100 ücretsiz orijinal kalitede indirin. (YouTube Shorts çok yakında!)",
  keywords: ["video indir", "instagram reels indir", "tiktok video indir", "facebook reels indir", "filigransız tiktok", "youtube shorts indir"],
  openGraph: {
    title: "SosyalIndir — Ücretsiz & Hızlı Sosyal Medya Video İndirici",
    description: "Instagram Reels, TikTok ve Facebook Reels videolarını filigransız ve orijinal kalitede indirin. (YouTube Shorts çok yakında!)",
    url: "https://sosyalindirapp.com",
    siteName: "SosyalIndir",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-MGT75R0FVY";

  return (
    <html lang="tr" className="dark">
      <head>
        {adsenseClientId && (
          <Script
            id="google-adsense"
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950`}>
        <Header />
        <main className="flex-1 flex flex-col justify-center">{children}</main>
        <Footer />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
