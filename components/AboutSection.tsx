import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Heart, Terminal, MessageSquare, ArrowRight, ShieldCheck, Globe } from "lucide-react";

/**
 * AboutSection Bileşeni
 * Page UI "About Section" bileşen deseninden esinlenilmiştir.
 * Şeffaf, samimi ve teknik güven sunan "Neden SosyalIndir'i Yaptık?" bölümü.
 */
export function AboutSection() {
  const t = useTranslations("About");

  return (
    <section className="w-full max-w-3xl mx-auto mt-16 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-6 text-left shadow-xl">
      
      {/* Üst Başlık & Rozet */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
          <Heart className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t("badge")}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t("heading")}
        </h2>
      </div>

      {/* Samimi Anlatım Paragrafı */}
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
        {t("paragraph")}
      </p>

      {/* Teknik Şeffaflık Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/60 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>{t("card1Title")}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t("card1Desc")}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/60 space-y-2">
          <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs">
            <Globe className="w-4 h-4" />
            <span>{t("card2Title")}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t("card2Desc")}
          </p>
        </div>
      </div>

      {/* İletişim Alt Çubuğu */}
      <div className="pt-2 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Terminal className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{t("contactPrompt")}</span>
        </div>

        <Link
          href="/iletisim"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 font-medium text-white transition-colors flex-shrink-0"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t("contactBtn")}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>

    </section>
  );
}
