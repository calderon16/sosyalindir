import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { Youtube } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isEn = locale === "en";
  const baseUrl = "https://sosyalindirapp.com";
  const path = "/youtube-shorts-indir";

  return {
    title: isEn ? "YouTube Shorts Downloader — Coming Soon | SosyalIndir" : "YouTube Shorts İndir — Çok Yakında | SosyalIndir",
    description: isEn ? "YouTube Shorts video downloader is coming soon." : "YouTube Shorts video indirici yakında hizmetinizde olacaktır.",
    alternates: {
      canonical: isEn ? `${baseUrl}/en${path}` : `${baseUrl}${path}`,
      languages: { tr: `${baseUrl}${path}`, en: `${baseUrl}/en${path}`, "x-default": `${baseUrl}${path}` },
    },
  };
}

export default function YouTubeShortsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const isEn = locale === "en";

  return (
    <div className="w-full py-20 px-4 text-center max-w-xl mx-auto space-y-6">
      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto">
        <Youtube className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-white">{isEn ? "YouTube Shorts Downloader" : "YouTube Shorts İndirici"}</h1>
      <p className="text-slate-400 text-sm">{isEn ? "This service will be available very soon. Stay tuned!" : "Bu servisimiz çok yakında aktif hale gelecektir. Takipte kalın!"}</p>
      <Link href="/" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium text-white transition-colors">
        {isEn ? "Back to Home" : "Ana Sayfaya Dön"}
      </Link>
    </div>
  );
}


export function generateStaticParams() {
  return [{ locale: 'tr' }, { locale: 'en' }];
}
