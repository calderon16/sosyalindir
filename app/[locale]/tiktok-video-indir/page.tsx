import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { PlatformLandingClient } from "@/components/PlatformLandingClient";
import { Video, HelpCircle, CheckCircle, Instagram, Youtube, Facebook, ArrowRight } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isEn = locale === "en";
  const baseUrl = "https://sosyalindirapp.com";
  const path = "/tiktok-video-indir";

  return {
    title: isEn
      ? "TikTok Video Downloader — No Watermark & Original Quality | SosyalIndir"
      : "TikTok Video İndir — Filigransız & Logosuz MP4 İndirici | SosyalIndir",
    description: isEn
      ? "Download TikTok videos without watermark or logos in original HD quality for free."
      : "TikTok videolarını filigransız ve logosuz olarak hiçbir ücret ödemeden orijinal HD MP4 formatında bilgisayarınıza veya telefonunuza indirin.",
    keywords: isEn
      ? ["download tiktok video", "no watermark tiktok", "tiktok mp4 downloader", "free tiktok download"]
      : ["tiktok video indir", "filigransız tiktok indir", "logosuz tiktok video", "tiktok mp4 indir"],
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

export default function TikTokVideoPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const isEn = locale === "en";
  const baseUrl = "https://sosyalindirapp.com";
  const path = "/tiktok-video-indir";
  const currentUrl = isEn ? `${baseUrl}/en${path}` : `${baseUrl}${path}`;

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": isEn ? "TikTok Video Downloader — SosyalIndir" : "TikTok Video İndirici — SosyalIndir",
        "url": currentUrl,
        "description": isEn
          ? "Download TikTok videos without watermark or logos in original HD quality for free."
          : "TikTok videolarını filigransız ve logosuz olarak hiçbir ücret ödemeden orijinal HD MP4 formatında bilgisayarınıza veya telefonunuza indirin.",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "TRY"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": isEn ? "Are TikTok videos saved without watermarks?" : "TikTok videoları filigransız (logosuz) mu indiriliyor?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": isEn
                ? "Yes! SosyalIndir strips video logos and watermarks to give you a clean MP4 file."
                : "Evet! SosyalIndir videodaki filigran ve logo katmanını temizleyerek temiz MP4 olarak sunar."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": isEn ? "Home" : "Ana Sayfa",
            "item": isEn ? `${baseUrl}/en` : baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": isEn ? "TikTok Video Download" : "TikTok Video İndirme",
            "item": currentUrl
          }
        ]
      }
    ]
  };

  return (
    <div className="w-full py-12 md:py-16 px-4 sm:px-6 max-w-4xl mx-auto space-y-16">
      {/* Structural Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      
      {/* Hero Alanı */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
          <Video className="w-3.5 h-3.5" />
          <span>{isEn ? "No-Watermark TikTok Downloader" : "Filigransız TikTok İndirici"}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          {isEn ? "Download TikTok Videos" : "TikTok Videolarını"} <br />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            {isEn ? "Without Watermark & Logos" : "Filigransız ve Logosuz İndirin"}
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          {isEn
            ? "Save TikTok videos in crisp MP4 resolution without any watermark overlays or quality loss. Completely free and fast."
            : "Beğendiğiniz TikTok videolarını amblem ve logo olmadan, orijinal netliğinde cihazınıza kaydedin. Tamamen ücretsiz ve sınırsız."}
        </p>

        <div className="pt-4">
          <PlatformLandingClient defaultPlatformName="TikTok" />
        </div>
      </div>

      {/* Adım Adım Rehber */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-cyan-400" />
          <span>{isEn ? "How to Download TikTok Videos Without Watermark?" : "Filigransız TikTok Videosu Nasıl İndirilir?"}</span>
        </h2>

        <ol className="space-y-4 text-sm sm:text-base text-slate-300">
          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong className="text-white">{isEn ? "Copy Link:" : "Bağlantıyı Kopyalayın:"}</strong> {isEn ? "Open TikTok app, tap Share on the video and choose Copy Link." : "TikTok uygulamasında indirmek istediğiniz videodaki 'Paylaş' butonuna dokunup 'Bağlantıyı Kopyala' seçeneğini seçin."}
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong className="text-white">{isEn ? "Paste on SosyalIndir:" : "SosyalIndir'e Yapıştırın:"}</strong> {isEn ? "Paste the link into the box above." : "Bağlantıyı yukarıdaki kutuya yapıştırın."}
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              3
            </span>
            <div>
              <strong className="text-white">{isEn ? "Download MP4:" : "MP4 İndirin:"}</strong> {isEn ? "Click Download to save clean MP4 to your device." : "İndir butonuna tıklayarak logosuz videoyu hemen kaydedin."}
            </div>
          </li>
        </ol>
      </div>

      {/* İç Linkleme */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
        <h3 className="text-sm font-semibold text-slate-300">
          {isEn ? "Other video downloaders:" : "Diğer platform indiricileri:"}
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/instagram-reels-indir"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            <span>{isEn ? "Instagram Reels Downloader" : "Instagram Reels İndir"}</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </Link>

          <Link
            href="/facebook-reels-indir"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors"
          >
            <Facebook className="w-3.5 h-3.5 text-blue-400" />
            <span>{isEn ? "Facebook Reels Downloader" : "Facebook Reels İndir"}</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </Link>
        </div>
      </div>

    </div>
  );
}


export function generateStaticParams() {
  return [{ locale: 'tr' }, { locale: 'en' }];
}
