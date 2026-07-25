import type { Metadata } from "next";
import Link from "next/link";
import { PlatformLandingClient } from "@/components/PlatformLandingClient";
import { Youtube, HelpCircle, CheckCircle, Instagram, Video, Facebook, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "YouTube Shorts İndir — HD & 1080p Video İndirici | SosyalIndir",
  description: "YouTube Shorts videolarını yüksek çözünürlükte (HD / 1080p) ve ses kalitesi bozulmadan bilgisayarınıza veya telefonunuza ücretsiz indirin.",
  keywords: ["youtube shorts indir", "shorts video indir", "youtube kısa video indir", "shorts mp4 dönüştürücü", "hd youtube shorts"],
};

export default function YouTubeShortsPage() {
  return (
    <div className="w-full py-12 md:py-16 px-4 sm:px-6 max-w-4xl mx-auto space-y-16">
      
      {/* Hero Alanı */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20">
          <Youtube className="w-3.5 h-3.5" />
          <span>YouTube Shorts İndirici</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          YouTube Shorts Videolarını <br />
          <span className="bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">
            1080p HD Kalitede İndirin
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Sevdiğiniz Shorts videolarını ve müziklerini dönüştürme bekleme süresi olmadan en yüksek kalitede MP4 formatında kaydedin.
        </p>

        <div className="pt-4">
          <PlatformLandingClient defaultPlatformName="YouTube Shorts" />
        </div>
      </div>

      {/* Adım Adım Rehber */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-red-500" />
          <span>Nasıl YouTube Shorts Videosu İndirilir?</span>
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
            <h3 className="font-semibold text-white text-sm">Videolar hangi çözünürlükte iniyor?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              İçerik üreticisinin YouTube'a yüklediği en yüksek çözünürlük (720p, 1080p Full HD) ne ise video doğrudan o orijinal kalitede sunulur.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white text-sm">Kullanım için üyelik veya program gerekli mi?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kesinlikle hayır! Herhangi bir yazılım yüklemenize veya üye olmanıza gerek kalmadan doğrudan web tarayıcınız üzerinden ücretsiz kullanabilirsiniz.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white text-sm">YouTube Shorts videolarında ses kayması olur mu?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hayır, indirme altyapımız videoyu re-encode (yeniden işleme) yapmadan orijinal akışı üzerinden sunduğu için ses ve görüntü senkronizasyonu tam korunur.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white text-sm">İndirdiğim Shorts videolarını başka platformlarda paylaşabilir miyim?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              YouTube videoları telif haklarına tabidir. İndirdiğiniz videoları kendi sosyal medya hesaplarınızda paylaşırken orijinal kanal sahibini belirtmenizi veya ticari amaçla kullanmamanızı öneririz.
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
