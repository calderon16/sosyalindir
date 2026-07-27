import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { PlatformLandingClient } from "@/components/PlatformLandingClient";
import { Facebook, CheckCircle, Instagram, Video, ArrowRight } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isEn = locale === "en";
  const baseUrl = "https://sosyalindirapp.com";
  const path = "/facebook-reels-indir";

  return {
    title: isEn
      ? "Facebook Reels Downloader — Fast Original HD Quality | SosyalIndir"
      : "Facebook Reels İndir — Orijinal HD Kalitede Hızlı İndirici | SosyalIndir",
    description: isEn
      ? "Save Facebook Reels and post videos fast in original resolution."
      : "Facebook Reels ve gönderi videolarını orijinal netliğinde hızlıca kaydedin.",
    keywords: isEn
      ? ["download facebook reels", "facebook video downloader", "fb reels mp4"]
      : ["facebook reels indir", "facebook video indir", "fb reels kaydet"],
    alternates: {
      canonical: isEn ? `${baseUrl}/en${path}` : `${baseUrl}${path}`,
      languages: {
        tr: `${baseUrl}${path}`,
        en: `${baseUrl}/en${path}`,
        "x-default": `${baseUrl}${path}`,
      },
    },
  };
}

export default function FacebookReelsPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const isEn = locale === "en";

  return (
    <div className="w-full py-12 md:py-16 px-4 sm:px-6 max-w-4xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20">
          <Facebook className="w-3.5 h-3.5" />
          <span>{isEn ? "Facebook Reels Downloader" : "Facebook Reels İndirici"}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          {isEn ? "Download Facebook Reels" : "Facebook Reels Videolarını"} <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            {isEn ? "in Original HD Quality" : "Orijinal HD Kalitede İndirin"}
          </span>
        </h1>

        <div className="pt-4">
          <PlatformLandingClient defaultPlatformName="Facebook Reels" />
        </div>
      </div>
    </div>
  );
}


export function generateStaticParams() {
  return [{ locale: 'tr' }, { locale: 'en' }];
}
