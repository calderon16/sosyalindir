"use client";

import React, { useEffect } from "react";

interface AdSlotProps {
  slotId: string;
  format?: "auto" | "fluid" | "rectangle";
  className?: string;
}

// Window tipine adsbygoogle tanımı
declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

/**
 * Google AdSense etik reklam bileşeni
 * Sahte indirme butonu algısını önlemek için belirgin etiket ve ayrı çerçeve içerir.
 */
export function AdSlot({ slotId, format = "auto", className = "" }: AdSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (typeof window !== "undefined" && clientId) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("[AdSense push error]:", err);
    }
  }, [clientId, slotId]);

  if (!mounted) return null;

  return (
    <div className={`w-full max-w-3xl mx-auto my-6 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm text-center relative overflow-hidden ${className}`}>
      {/* Sağ Üst Reklam Etiketi */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/50 text-[10px] uppercase font-semibold tracking-wider text-slate-400">
        <span className="inline-flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
          Sponsorlu / Reklam
        </span>
        <span className="text-slate-400 font-normal">SosyalIndir AdSense</span>
      </div>

      {/* AdSense HTML Birimi */}
      <div className="min-h-[100px] flex items-center justify-center overflow-hidden">
        {clientId ? (
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%" }}
            data-ad-client={clientId}
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        ) : (
          <div className="py-6 text-xs text-slate-400 italic">
            [AdSense Reklam Alanı — Slot ID: {slotId}]
          </div>
        )}
      </div>
    </div>
  );
}
