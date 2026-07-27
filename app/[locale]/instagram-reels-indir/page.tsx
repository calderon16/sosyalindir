import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { PlatformLandingClient } from "@/components/PlatformLandingClient";
import { Instagram, HelpCircle, CheckCircle, Video, Youtube, Facebook, ArrowRight } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isEn = locale === "en";
  const baseUrl = "https://sosyalindirapp.com";
  const path = "/instagram-reels-indir";

  return {
    title: isEn
      ? "Download Instagram Reels — Free Original HD Quality | SosyalIndir"
      : "Instagram Reels İndir — Ücretsiz & Orijinal HD Video İndirici | SosyalIndir",
    description: isEn
      ? "Download Instagram Reels and videos in original HD quality for free with no watermark or registration required."
      : "Instagram Reels ve videolarını hiçbir ücret ödemeden, kayıt olmadan orijinal HD kalitede telefonunuza veya bilgisayarınıza indirin.",
    keywords: isEn
      ? ["download instagram reels", "instagram video downloader", "reels mp4 download", "hd instagram downloader"]
      : ["instagram reels indir", "instagram video indir", "reels mp4 indir", "hd instagram indir", "instagram video kaydet"],
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

export default function InstagramReelsPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const isEn = locale === "en";
  const baseUrl = "https://sosyalindirapp.com";
  const path = "/instagram-reels-indir";
  const currentUrl = isEn ? `${baseUrl}/en${path}` : `${baseUrl}${path}`;

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": isEn ? "Instagram Reels Downloader — SosyalIndir" : "Instagram Reels İndirici — SosyalIndir",
        "url": currentUrl,
        "description": isEn
          ? "Download Instagram Reels and videos in original HD quality for free with no watermark."
          : "Instagram Reels ve videolarını hiçbir ücret ödemeden, kayıt olmadan orijinal HD kalitede telefonunuza veya bilgisayarınıza indirin.",
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
            "name": isEn ? "Do I need to log in or provide my password?" : "Giriş yapmam ya da şifre vermem gerekiyor mu?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": isEn
                ? "No! SosyalIndir never asks for your Instagram password or account details. We only process public links."
                : "Hayır! SosyalIndir sizden asla Instagram şifrenizi veya hesap bilgilerinizi istemez. Yalnızca herkese açık bağlantıları işleriz."
            }
          },
          {
            "@type": "Question",
            "name": isEn ? "Can I download Reels from private accounts?" : "Gizli hesapların Reels videolarını indirebilir miyim?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": isEn
                ? "Private account contents are restricted to approved followers due to privacy policies. Only videos from public accounts are supported."
                : "Gizli (özel) hesapların içerikleri telif ve gizlilik ilkeleri gereği yalnızca izin verilen takipçilere özeldir. Bu nedenle yalnızca herkese açık hesapların videoları desteklenir."
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
            "name": isEn ? "Instagram Reels Download" : "Instagram Reels Video İndirme",
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-pink-400 bg-pink-500/10 border border-pink-500/20">
          <Instagram className="w-3.5 h-3.5" />
          <span>{isEn ? "Instagram Reels Downloader" : "Instagram Reels İndirici"}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          {isEn ? "Download Instagram Reels" : "Instagram Reels Videolarını"} <br />
          <span className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
            {isEn ? "in Original HD Quality" : "Orijinal HD Kalitede İndirin"}
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          {isEn
            ? "Save your favorite Reels videos in seconds without losing audio or video quality. No login or app installation required."
            : "Beğendiğiniz Reels videolarını ses ve görüntü kalitesi düşmeden saniyeler içinde cihazınıza kaydedin. Giriş yapmanız veya uygulama yüklemeniz gerekmez."}
        </p>

        <div className="pt-4">
          <PlatformLandingClient defaultPlatformName="Instagram Reels" />
        </div>
      </div>

      {/* Adım Adım Rehber */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-pink-500" />
          <span>{isEn ? "How to Download Instagram Reels Videos?" : "Nasıl Instagram Reels Videosu İndirilir?"}</span>
        </h2>

        <ol className="space-y-4 text-sm sm:text-base text-slate-300">
          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong className="text-white">{isEn ? "Copy Link:" : "Bağlantıyı Kopyalayın:"}</strong> {isEn ? "Open Instagram, tap Share or the three dots on the video and select Copy Link." : "Instagram uygulamasını açın, indirmek istediğiniz Reels videosunun sağ altındaki 'Paylaş' ikonuna veya üç noktaya dokunup 'Bağlantıyı Kopyala' seçeneğini seçin."}
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong className="text-white">{isEn ? "Paste on SosyalIndir:" : "SosyalIndir'e Yapıştırın:"}</strong> {isEn ? "Paste the copied Reels link into the input box above." : "Kopyaladığınız Reels bağlantısını yukarıdaki arama kutusuna yapıştırın."}
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              3
            </span>
            <div>
              <strong className="text-white">{isEn ? "Download Video:" : "Videoyu İndirin:"}</strong> {isEn ? "Click Download and save the MP4 video directly to your phone or computer." : "İndir butonuna tıklayın ve hazırlanan MP4 video dosyasını telefonunuza veya bilgisayarınıza kaydedin."}
            </div>
          </li>
        </ol>
      </div>

      {/* Sıkça Sorulan Sorular (SSS) */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-emerald-400" />
          <span>{isEn ? "Frequently Asked Questions" : "Sıkça Sorulan Sorular"}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white text-sm">
              {isEn ? "Do I need to log in or provide my password?" : "Giriş yapmam ya da şifre vermem gerekiyor mu?"}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isEn ? "No! SosyalIndir never asks for your Instagram password. We only process public video links." : "Hayır! SosyalIndir sizden asla Instagram şifrenizi veya hesap bilgilerinizi istemez. Yalnızca herkese açık bağlantıları işleriz."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white text-sm">
              {isEn ? "Can I download Reels from private accounts?" : "Gizli hesapların Reels videolarını indirebilir miyim?"}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isEn ? "Private account contents are restricted due to privacy policies. Only public videos can be processed." : "Gizli (özel) hesapların içerikleri telif ve gizlilik ilkeleri gereği yalnızca izin verilen takipçilere özeldir."}
            </p>
          </div>
        </div>
      </div>

      {/* İç Linkleme */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
        <h3 className="text-sm font-semibold text-slate-300">
          {isEn ? "Video downloaders for other platforms:" : "Diğer platformlar için video indiricilerimiz:"}
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/tiktok-video-indir"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors"
          >
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isEn ? "TikTok Video Downloader" : "TikTok Video İndir"}</span>
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
