import React from "react";
import { Link } from "@/i18n/routing";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Footer Bileşeni
 */
export function Footer() {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Üst Kısım: Logo ve Linkler */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <Link href="/" className="flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-400" />
              <span className="text-lg font-bold text-white">
                Sosyal<span className="text-emerald-400">Indir</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-md">
              {t("desc")}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-400">
            <Link href="/kullanim-kosullari" className="hover:text-emerald-400 transition-colors">
              {t("terms")}
            </Link>
            <span className="text-slate-800">•</span>
            <Link href="/gizlilik-politikasi" className="hover:text-emerald-400 transition-colors">
              {t("privacy")}
            </Link>
            <span className="text-slate-800">•</span>
            <Link href="/telif-bildirimi" className="hover:text-emerald-400 transition-colors">
              {t("dmca")}
            </Link>
            <span className="text-slate-800">•</span>
            <Link href="/iletisim" className="hover:text-emerald-400 transition-colors">
              {t("contact")}
            </Link>
          </div>
        </div>

        {/* Alt Kısım: Copyright & Disclaimer */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-slate-500">
            {t("copyright", { year: currentYear })}
          </p>
          <p className="text-[11px] text-slate-500 max-w-lg">
            {t("disclaimer")}
          </p>
        </div>

      </div>
    </footer>
  );
}
