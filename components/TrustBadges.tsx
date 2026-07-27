import React from "react";
import { useTranslations } from "next-intl";

/**
 * TrustBadges Bileşeni
 * Page UI "Leading Pill" tasarım deseninden esinlenilmiştir.
 * Koyu temamıza uygun, cam efektli (backdrop-blur) ve degrade kenarlıklı güven rozetleri.
 */
// Maximum 3 badges to avoid badge clutter which decreases user trust
export function TrustBadges() {
  const t = useTranslations("TrustBadges");

  const badges = [
    { icon: "🔒", text: t("noPassword") },
    { icon: "🗑️", text: t("noDataRetention") },
    { icon: "⚡", text: t("hundredPercentFree") },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-2 animate-fadeIn">
      {badges.map((badge, idx) => (
        <div
          key={idx}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-200 bg-slate-900/60 border border-slate-800/80 shadow-sm backdrop-blur-md hover:border-emerald-500/30 hover:bg-slate-900/80 transition-all duration-200"
        >
          <span className="text-sm select-none" aria-hidden="true">
            {badge.icon}
          </span>
          <span className="tracking-tight">{badge.text}</span>
        </div>
      ))}
    </div>
  );
}
