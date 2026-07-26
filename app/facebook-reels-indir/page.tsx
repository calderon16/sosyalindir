import type { Metadata } from "next";
import Link from "next/link";
import { PlatformLandingClient } from "@/components/PlatformLandingClient";
import { Facebook, HelpCircle, CheckCircle, Instagram, Video, Youtube, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Facebook Reels İndir — Orijinal HD Kalitede Hızlı İndirici | SosyalIndir",
  description: "Facebook Reels ve kısa videolarını doğrudan MP4 formatında HD kalitede ücretsiz indirin. Reklamsız, kayıtsız ve güvenli video indirme.",
  keywords: ["facebook reels indir", "facebook video indir", "fb reels mp4 indir", "facebook video kaydet", "fb video indirici"],
};

export default function FacebookReelsPage() {
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Hem HD hem SD kalite seçenekleri var mı?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Evet, Facebook sunucularının sağladığı kaliteye göre HD (Yüksek Çözünürlük) ve SD (Standart Çözünürlük) seçenekleri otomatik olarak sunulur."
            }
          },
          {
            "@type": "Question",
            "name": "Gizli gruplardaki veya kapalı profillerdeki videolar indirilebilir mi?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Güvenlik ve gizlilik politikaları gereği yalnızca herkese açık (Public) Facebook gönderileri ve Reels videoları desteklenir."
            }
          },
          {
            "@type": "Question",
            "name": "Facebook hesabımla giriş yapmam gerekiyor mu?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hayır! Hiçbir sosyal medya hesabınızı bağlamanız veya giriş yapmanız gerekmez. İşlem tamamen anonim olarak gerçekleşir."
            }
          },
          {
            "@type": "Question",
            "name": "İndirdiğim Facebook Reels videosunu yeniden yükleyebilir miyim?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "İndirdiğiniz videoları kendi arşiviniz için saklayabilirsiniz. Başkasına ait içerikleri telif izni olmadan yeniden yayınlamak platform kurallarını ihlal edebilir. Telif sahibinin iznini almanızı tavsiye ederiz."
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
            "name": "Ana Sayfa",
            "item": "https://sosyalindirapp.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Facebook Reels Video İndirme",
            "item": "https://sosyalindirapp.com/facebook-reels-indir"
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20">
          <Facebook className="w-3.5 h-3.5" />
          <span>Facebook Reels İndirici</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Facebook Reels Videolarını <br />
          <span className="bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Orijinal Kalitede İndirin
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Facebook akışında veya izle bölümünde karşılaştığınız harika Reels videolarını anında bilgisayarınıza veya mobil cihazınıza kaydedin.
        </p>

        <div className="pt-4">
          <PlatformLandingClient defaultPlatformName="Facebook Reels" />
        </div>
      </div>

      {/* Adım Adım Rehber */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-blue-500" />
          <span>Nasıl Facebook Reels Videosu İndirilir?</span>
        </h2>

        <ol className="space-y-4 text-sm sm:text-base text-slate-300">
          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong className="text-white">Facebook Bağlantısını Kopyalayın:</strong> Facebook uygulamasında Reels videosunun altındaki <strong>"Paylaş"</strong> butonuna dokunun ve <strong>"Bağlantıyı Kopyala"</strong> seçeneğini seçin.
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong className="text-white">SosyalIndir'e Yapıştırın:</strong> Bağlantıyı sayfanın üst tarafındaki arama kutusuna ekleyin.
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              3
            </span>
            <div>
              <strong className="text-white">Videoyu İndirin:</strong> <strong>"İndir"</strong> butonuna tıklayarak Reels videosunu yüksek kalitede cihazınıza kaydedin.
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
            <h3 className="font-semibold text-white text-sm">Hem HD hem SD kalite seçenekleri var mı?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evet, Facebook sunucularının sağladığı kaliteye göre HD (Yüksek Çözünürlük) ve SD (Standart Çözünürlük) seçenekleri otomatik olarak sunulur.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white text-sm">Gizli gruplardaki veya kapalı profillerdeki videolar indirilebilir mi?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Güvenlik ve gizlilik politikaları gereği yalnızca herkese açık (Public) Facebook gönderileri ve Reels videoları desteklenir.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white text-sm">Facebook hesabımla giriş yapmam gerekiyor mu?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hayır! Hiçbir sosyal medya hesabınızı bağlamanız veya giriş yapmanız gerekmez. İşlem tamamen anonim olarak gerçekleşir.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white text-sm">İndirdiğim Facebook Reels videosunu yeniden yükleyebilir miyim?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              İndirdiğiniz videoları kendi arşiviniz için saklayabilirsiniz. Başkasına ait içerikleri telif izni olmadan yeniden yayınlamak platform kurallarını ihlal edebilir. Telif sahibinin iznini almanızı tavsiye ederiz.
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
            href="/tiktok-video-indir"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors"
          >
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            <span>TikTok Video İndir</span>
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
        </div>
      </div>

    </div>
  );
}
