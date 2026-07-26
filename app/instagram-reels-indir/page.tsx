import type { Metadata } from "next";
import Link from "next/link";
import { PlatformLandingClient } from "@/components/PlatformLandingClient";
import { Instagram, HelpCircle, CheckCircle, Video, Youtube, Facebook, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Instagram Reels İndir — Ücretsiz & Orijinal HD Video İndirici | SosyalIndir",
  description: "Instagram Reels ve videolarını hiçbir ücret ödemeden, kayıt olmadan orijinal HD kalitede telefonunuza veya bilgisayarınıza indirin.",
  keywords: ["instagram reels indir", "instagram video indir", "reels mp4 indir", "hd instagram indir", "instagram video kaydet"],
};

export default function InstagramReelsPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Giriş yapmam ya da şifre vermem gerekiyor mu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hayır! SosyalIndir sizden asla Instagram şifrenizi veya hesap bilgilerinizi istemez. Yalnızca herkese açık bağlantıları işleriz."
        }
      },
      {
        "@type": "Question",
        "name": "Gizli hesapların Reels videolarını indirebilir miyim?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Gizli (özel) hesapların içerikleri telif ve gizlilik ilkeleri gereği yalnızca izin verilen takipçilere özeldir. Bu nedenle yalnızca herkese açık hesapların videoları desteklenir."
        }
      },
      {
        "@type": "Question",
        "name": "Videolar sesli ve yüksek kalitede mi iniyor?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Evet, aracımız videoyu doğrudan Instagram sunucularındaki orijinal HD çözünürlüğü ve orijinal ses formatıyla indirir."
        }
      },
      {
        "@type": "Question",
        "name": "İndirdiğim videoyu kendi hesabımda paylaşabilir miyim?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Kendi kişisel arşiviniz için indirmekte özgürsünüz. Ancak başkasına ait videoları ticari amaçla veya telif sahibinin izni olmadan yeniden yayınlamak telif ihlaline yol açabilir. Etiket vererek paylaşmanızı öneririz."
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
        "name": "Instagram Reels Video İndirme",
        "item": "https://sosyalindirapp.com/instagram-reels-indir"
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-pink-400 bg-pink-500/10 border border-pink-500/20">
          <Instagram className="w-3.5 h-3.5" />
          <span>Instagram Reels İndirici</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Instagram Reels Videolarını <br />
          <span className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
            Orijinal HD Kalitede İndirin
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Beğendiğiniz Reels videolarını ses ve görüntü kalitesi düşmeden saniyeler içinde cihazınıza kaydedin. Giriş yapmanız veya uygulama yüklemeniz gerekmez.
        </p>

        <div className="pt-4">
          <PlatformLandingClient defaultPlatformName="Instagram Reels" />
        </div>
      </div>

      {/* Adım Adım Rehber */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-pink-500" />
          <span>Nasıl Instagram Reels Videosu İndirilir?</span>
        </h2>

        <ol className="space-y-4 text-sm sm:text-base text-slate-300">
          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong className="text-white">Bağlantıyı Kopyalayın:</strong> Instagram uygulamasını açın, indirmek istediğiniz Reels videosunun sağ altındaki <strong>"Paylaş"</strong> ikonuna veya üç noktaya dokunup <strong>"Bağlantıyı Kopyala"</strong> seçeneğini seçin.
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong className="text-white">SosyalIndir'e Yapıştırın:</strong> Kopyaladığınız Reels bağlantısını yukarıdaki arama kutusuna yapıştırın.
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              3
            </span>
            <div>
              <strong className="text-white">Videoyu İndirin:</strong> <strong>"İndir"</strong> butonuna tıklayın ve hazırlanan MP4 video dosyasını telefonunuza veya bilgisayarınıza kaydedin.
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
            <h3 className="font-semibold text-white text-sm">Giriş yapmam ya da şifre vermem gerekiyor mu?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hayır! SosyalIndir sizden asla Instagram şifrenizi veya hesap bilgilerinizi istemez. YalnızcaHerkese açık bağlantıları işleriz.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white text-sm">Gizli hesapların Reels videolarını indirebilir miyim?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gizli (özel) hesapların içerikleri telif ve gizlilik ilkeleri gereği yalnızca izin verilen takipçilere özeldir. Bu nedenle yalnızca herkese açık hesapların videoları desteklenir.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white text-sm">Videolar sesli ve yüksek kalitede mi iniyor?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evet, aracımız videoyu doğrudan Instagram sunucularındaki orijinal HD çözünürlüğü ve orijinal ses formatıyla indirir.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white text-sm">İndirdiğim videoyu kendi hesabımda paylaşabilir miyim?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kendi kişisel arşiviniz için indirmekte özgürsünüz. Ancak başkasına ait videoları ticari amaçla veya telif sahibinin izni olmadan yeniden yayınlamak telif ihlaline yol açabilir. Etiket vererek paylaşmanızı öneririz.
            </p>
          </div>
        </div>
      </div>

      {/* İç Linkleme (Diğer Platformlar) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
        <h3 className="text-sm font-semibold text-slate-300">Diğer platformlar için video indiricilerimiz:</h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
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
