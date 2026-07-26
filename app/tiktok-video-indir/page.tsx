import type { Metadata } from "next";
import Link from "next/link";
import { PlatformLandingClient } from "@/components/PlatformLandingClient";
import { Video, HelpCircle, CheckCircle, Instagram, Youtube, Facebook, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "TikTok Video İndir — Filigransız & Logosuz MP4 İndirici | SosyalIndir",
  description: "TikTok videolarını filigran (watermark) ve logo olmadan en yüksek çözünürlükte ücretsiz indirin. Kayıtsız, hızlı ve %100 filigransız.",
  keywords: ["tiktok video indir", "tiktok filigransız indir", "tiktok logosuz indir", "tiktok mp4 indir", "tiktok filigran kaldırma"],
};

export default function TikTokVideoPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Videolar gerçekten logosuz mu iniyor?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Evet! Gelişmiş indirme altyapımız TikTok sunucularındaki filigran uygulanmamış ham veriyi tespit ederek videoyu ek bir logo olmadan sunar."
        }
      },
      {
        "@type": "Question",
        "name": "İndirme işlemi ücretli mi ya da sınır var mı?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SosyalIndir tamamen ücretsizdir. Günlük veya aylık hiçbir indirme sınırı olmadan istediğiniz kadar TikTok videosunu indirebilirsiniz."
        }
      },
      {
        "@type": "Question",
        "name": "Mobil cihazlarda (iPhone & Android) çalışır mı?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Evet, tüm mobil tarayıcılarda (Safari, Chrome) sorunsuz çalışır. İndirilen videolar cihazınızın galerisine veya İndirilenler klasörüne kaydedilir."
        }
      },
      {
        "@type": "Question",
        "name": "İndirdiğim TikTok videolarını kendi kanalımda yayınlayabilir miyim?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Videoların telif hakları içerik üreticisine aittir. İzinsiz veya kaynak göstermeden paylaşılan içerikler telif sorunlarına yol açabilir. Videoları paylaşırken orijinal sahibine atıfta bulunmanızı tavsiye ederiz."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ana Sayfa",
        "item": "https://sosyalindirapp.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "TikTok Video İndirme",
        "item": "https://sosyalindirapp.com/tiktok-video-indir"
      }
    ]
  };

  return (
    <div className="w-full py-12 md:py-16 px-4 sm:px-6 max-w-4xl mx-auto space-y-16">
      {/* Structural Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Hero Alanı */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Filigransız TikTok İndirici</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          TikTok Videolarını <br />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-pink-500 bg-clip-text text-transparent">
            Filigransız & Logosuz İndirin
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          TikTok videolarının üzerindeki hareketli logosu olmadan orijinal netliğinde kaydetmek artık çok kolay. Linki yapıştırın ve anında filigransız MP4 olarak indirin.
        </p>

        <div className="pt-4">
          <PlatformLandingClient defaultPlatformName="TikTok Video" />
        </div>
      </div>

      {/* Adım Adım Rehber */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-cyan-400" />
          <span>Nasıl Filigransız TikTok Videosu İndirilir?</span>
        </h2>

        <ol className="space-y-4 text-sm sm:text-base text-slate-300">
          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong className="text-white">TikTok Linkini Kopyalayın:</strong> TikTok uygulamasında veya web sitesinde indirmek istediğiniz videoyu açın. <strong>"Paylaş"</strong> (ok ikonu) butonuna dokunup <strong>"Bağlantıyı Kopyala"</strong> seçeneğine tıklayın.
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong className="text-white">Kutuya Yapıştırın:</strong> Kopyaladığınız TikTok bağlantısını yukarıdaki alana yapıştırın.
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              3
            </span>
            <div>
              <strong className="text-white">Filigransız İndirin:</strong> <strong>"Filigransız İndir (HD)"</strong> butonuna tıklayarak logonun bulunmadığı temiz videoyu saniyeler içinde kaydedin.
            </div>
          </li>
        </ol>
      </div>

      {/* Sıkça Sorulan Sorular (SSS) */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-emerald-400" />
          <span>Sıkça Sorulan Sorular</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white text-sm">Videolar gerçekten logosuz mu iniyor?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evet! Gelişmiş indirme altyapımız TikTok sunucularındaki filigran uygulanmamış ham veriyi tespit ederek videoyu ek bir logo olmadan sunar.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white text-sm">İndirme işlemi ücretli mi ya da sınır var mı?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              SosyalIndir tamamen ücretsizdir. Günlük veya aylık hiçbir indirme sınırı olmadan istediğiniz kadar TikTok videosunu indirebilirsiniz.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white text-sm">Mobil cihazlarda (iPhone & Android) çalışır mı?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evet, tüm mobil tarayıcılarda (Safari, Chrome) sorunsuz çalışır. İndirilen videolar cihazınızın galerisine veya İndirilenler klasörüne kaydedilir.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white text-sm">İndirdiğim TikTok videolarını kendi kanalımda yayınlayabilir miyim?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Videoların telif hakları içerik üreticisine aittir. İzinsiz veya kaynak göstermeden paylaşılan içerikler telif sorunlarına yol açabilir. Videoları paylaşırken orijinal sahibine atıfta bulunmanızı tavsiye ederiz.
            </p>
          </div>
        </div>
      </div>

      {/* İç Linkleme (Diğer Platformlar) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
        <h3 className="text-sm font-semibold text-slate-300">Diğer platformlar için video indiricilerimiz:</h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/instagram-reels-indir"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            <span>Instagram Reels İndir</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </Link>

          <Link
            href="/youtube-shorts-indir"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors"
          >
            <Youtube className="w-3.5 h-3.5 text-red-400" />
            <span>YouTube Shorts İndir</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </Link>

          <Link
            href="/facebook-reels-indir"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors"
          >
            <Facebook className="w-3.5 h-3.5 text-blue-400" />
            <span>Facebook Reels İndir</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </Link>
        </div>
      </div>

    </div>
  );
}
