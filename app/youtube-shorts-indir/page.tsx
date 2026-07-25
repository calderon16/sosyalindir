import type { Metadata } from "next";
import Link from "next/link";
import { PlatformLandingClient } from "@/components/PlatformLandingClient";
import { Youtube, HelpCircle, CheckCircle, Instagram, Video, Facebook, ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "YouTube Shorts İndir (Çok Yakında) — HD & 1080p Video İndirici | SosyalIndir",
  description: "YouTube Shorts videolarını yüksek çözünürlükte indirme altyapımız güncelleniyor. Çok yakında hizmetinizde!",
  keywords: ["youtube shorts indir", "shorts video indir", "youtube kısa video indir", "shorts mp4 dönüştürücü", "hd youtube shorts"],
};

export default function YouTubeShortsPage() {
  return (
    <div className="w-full py-12 md:py-16 px-4 sm:px-6 max-w-4xl mx-auto space-y-16">
      
      {/* Hero Alanı */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20">
          <Clock className="w-3.5 h-3.5" />
          <span>YouTube Shorts Desteği — Çok Yakında!</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          YouTube Shorts İndirici <br />
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
            Çok Yakında Hizmetinizde!
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          YouTube Shorts indirme altyapımız bot koruması güncellemeleri nedeniyle yenilenmektedir. Şimdilik Instagram, TikTok ve Facebook Reels videolarınızı indirebilirsiniz.
        </p>

        {/* Yakında Uyarısı Kutusu */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm max-w-2xl mx-auto space-y-2">
          <p className="font-semibold flex items-center justify-center gap-2">
            <span>🚧 Geliştirme Aşamasında</span>
          </p>
          <p className="text-xs text-amber-200/80">
            YouTube Shorts videoları için en yüksek hızda ve kesintisiz indirme altyapısını hazırlıyoruz. Çok yakında tüm Shorts videolarını ücretsiz indirebileceksiniz!
          </p>
        </div>

        <div className="pt-4">
          <PlatformLandingClient defaultPlatformName="YouTube Shorts" />
        </div>
      </div>

      {/* Adım Adım Rehber */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-red-500" />
          <span>Nasıl YouTube Shorts Videosu İndirilir? (Çok Yakında)</span>
        </h2>

        <ol className="space-y-4 text-sm sm:text-base text-slate-300">
          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong className="text-white">Shorts Bağlantısını Alın:</strong> YouTube uygulamasında Shorts izlerken sağdaki <strong>"Paylaş"</strong> butonuna tıklayın ve <strong>"Bağlantıyı Kopyala"</strong> seçeneğini seçin.
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong className="text-white">SosyalIndir'e Yapıştırın:</strong> Kopyaladığınız linki yukarıdaki arama alanına yapıştırın.
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              3
            </span>
            <div>
              <strong className="text-white">Anında Kaydedin:</strong> <strong>"İndir"</strong> butonuna basarak videoyu orijinal ses ve görüntü kalitesiyle cihazınıza indirin.
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
            <h3 className="font-semibold text-white text-sm">YouTube Shorts desteği ne zaman açılacak?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ekibimiz yeni indirme altyapısı üzerinde çalışmaktadır. Çok kısa bir süre içinde YouTube Shorts indirme hizmeti tekrar aktifleşecektir.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white text-sm">Şu an hangi platformlar aktif?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instagram Reels, TikTok (filigransız) ve Facebook Reels videolarını %100 sorunsuz ve yüksek hızda indirebilirsiniz.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white text-sm">İndirme işlemi ücretli mi olacak?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hayır! YouTube Shorts dahil tüm video indirme servislerimiz tamamen ücretsiz kalmaya devam edecektir.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white text-sm">İndirdiğim Shorts videolarını paylaşabilir miyim?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              YouTube videoları telif haklarına tabidir. İndirdiğiniz videoları kendi sosyal medya hesaplarınızda paylaşırken orijinal kanal sahibini belirtmenizi öneririz.
            </p>
          </div>
        </div>
      </div>

      {/* İç Linkleme (Aktif Platformlar) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
        <h3 className="text-sm font-semibold text-slate-300">Şu an aktif olan video indiricilerimiz:</h3>
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
