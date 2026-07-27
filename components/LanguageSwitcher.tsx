"use client";

import React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = (newLocale: "tr" | "en") => {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center p-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-semibold backdrop-blur-md">
      <Globe className="w-3.5 h-3.5 ml-2 mr-1 text-slate-400" />
      <button
        onClick={() => toggleLanguage("tr")}
        className={`px-2 py-0.5 rounded-full transition-all duration-200 ${
          locale === "tr"
            ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
            : "text-slate-400 hover:text-white"
        }`}
        aria-label="Türkçe Dil Seçeneği"
      >
        TR
      </button>
      <button
        onClick={() => toggleLanguage("en")}
        className={`px-2 py-0.5 rounded-full transition-all duration-200 ${
          locale === "en"
            ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
            : "text-slate-400 hover:text-white"
        }`}
        aria-label="English Language Option"
      >
        EN
      </button>
    </div>
  );
}
