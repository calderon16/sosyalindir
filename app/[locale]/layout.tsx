import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isEn = locale === "en";
  const baseUrl = "https://sosyalindirapp.com";
  const canonicalUrl = isEn ? `${baseUrl}/en` : baseUrl;

  return {
    metadataBase: new URL(baseUrl),
    title: isEn
      ? "SosyalIndir — Instagram, TikTok & Facebook Video Downloader"
      : "SosyalIndir — Instagram, TikTok & Facebook Video İndirici",
    description: isEn
      ? "Download Instagram Reels, TikTok, and Facebook Reels videos in high quality with no watermark for free."
      : "Instagram Reels, TikTok ve Facebook Reels videolarını filigransız, hızlı ve %100 ücretsiz orijinal kalitede indirin. (YouTube Shorts çok yakında!)",
    keywords: isEn
      ? ["video downloader", "download instagram reels", "download tiktok video", "download facebook reels", "no watermark tiktok"]
      : ["video indir", "instagram reels indir", "tiktok video indir", "facebook reels indir", "filigransız tiktok", "youtube shorts indir"],
    manifest: "/site.webmanifest",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        tr: baseUrl,
        en: `${baseUrl}/en`,
        "x-default": baseUrl,
      },
    },
    icons: {
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/icon.png" },
      ],
      shortcut: "/favicon.ico",
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      title: isEn
        ? "SosyalIndir — Free & Fast Social Media Video Downloader"
        : "SosyalIndir — Ücretsiz & Hızlı Sosyal Medya Video İndirici",
      description: isEn
        ? "Download Instagram Reels, TikTok, and Facebook Reels videos in high quality with no watermark for free."
        : "Instagram Reels, TikTok ve Facebook Reels videolarını filigransız ve orijinal kalitede indirin.",
      url: canonicalUrl,
      siteName: "SosyalIndir",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const adsenseClientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-MGT75R0FVY";

  return (
    <html lang={locale} className="dark">
      <head>
        {adsenseClientId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main className="flex-1 flex flex-col justify-center">{children}</main>
          <Footer />
          {gaId && <GoogleAnalytics gaId={gaId} />}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
