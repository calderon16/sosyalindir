import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SosyalIndir — Instagram, TikTok, Shorts & Facebook Video İndirici",
  description: "Instagram Reels, TikTok, YouTube Shorts ve Facebook Reels videolarını filigransız, hızlı ve %100 ücretsiz orijinal kalitede indirin.",
  keywords: ["video indir", "instagram reels indir", "tiktok video indir", "youtube shorts indir", "facebook reels indir", "filigransız tiktok"],
  openGraph: {
    title: "SosyalIndir — Ücretsiz & Hızlı Sosyal Medya Video İndirici",
    description: "Instagram, TikTok, YouTube Shorts ve Facebook Reels videolarını filigransız ve orijinal kalitede indirin.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;

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
      </body>
    </html>
  );
}
