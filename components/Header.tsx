import React from "react";
import Link from "next/link";
import { Download, ShieldCheck, Zap } from "lucide-react";

/**
 * Minimalist, reklam kirliliği içermeyen temiz Header bileşeni
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-900/80 border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Site Logosu */}
        <Link href="/" className="flex items-center gap-2 group transition-transform active:scale-95">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Download className="w-5 h-5 text-emerald-400 transition-transform group-hover:-translate-y-0.5" />
            </div>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Sosyal<span className="text-emerald-400">Indir</span>
          </span>
        </Link>

        {/* Minimal Bilgi Rozeti & Hızlı Linkler */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            <Zap className="w-3.5 h-3.5 fill-emerald-400/20" />
            <span>Orijinal Kalite & Filigransız</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-400 bg-slate-800/60 border border-slate-700/50">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>%100 Ücretsiz</span>
          </div>
        </div>
      </div>
    </header>
  );
}
