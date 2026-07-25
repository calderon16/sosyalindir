import React from "react";
import Link from "next/link";
import { Download } from "lucide-react";

/**
 * Temiz, yasal linkleri içeren Footer bileşeni
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Üst Kısım: Logo ve Yasal Bağlantılar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Sol: Logo ve Açıklama */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <Link href="/" className="flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-400" />
              <span className="text-lg font-bold text-white">
                Sosyal<span className="text-emerald-400">Indir</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-md">
              Instagram, TikTok, YouTube Shorts ve Facebook Reels videolarını filigransız ve orijinal kalitede anında indirin.
            </p>
          </div>

          {/* Sağ: Hukuki Bağlantılar */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-400">
            <Link href="/kullanim-kosullari" className="hover:text-emerald-400 transition-colors">
              Kullanım Koşulları
            </Link>
            <span className="text-slate-800">•</span>
            <Link href="/gizlilik-politikasi" className="hover:text-emerald-400 transition-colors">
              Gizlilik Politikası
            </Link>
            <span className="text-slate-800">•</span>
            <Link href="/telif-bildirimi" className="hover:text-emerald-400 transition-colors">
              Telif Bildirimi (DMCA)
            </Link>
            <span className="text-slate-800">•</span>
            <Link href="/iletisim" className="hover:text-emerald-400 transition-colors">
              İletişim
            </Link>
          </div>

        </div>

        {/* Alt Kısım: Telif Uyarısı ve Telifsiz Notu */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} SosyalIndir. Tüm hakları saklıdır.
          </p>
          <p className="text-[11px] text-slate-500 max-w-lg">
            SosyalIndir hiçbir sosyal medya platformu ile bağlantılı değildir. İndirilen içeriklerin telif sorumluluğu kullanıcıya aittir.
          </p>
        </div>

      </div>
    </footer>
  );
}
