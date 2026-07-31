"use client";

import React, { useEffect, useRef, useState } from "react";

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
 * Eğer reklam yüklenmezse (hesap onaysız vb.) tamamen görünmez kalır (0 height).
 */
export function AdSlot({ slotId, format = "auto", className = "" }: AdSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
  const [mounted, setMounted] = useState(false);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const insRef = useRef<HTMLModElement>(null);

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

  useEffect(() => {
    if (!mounted || !insRef.current) return;

    // AdSense'in <ins> etiketine eklediği data-ad-status niteliğini dinle
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-ad-status") {
          const status = insRef.current?.getAttribute("data-ad-status");
          if (status === "filled") {
            setIsAdLoaded(true);
          } else if (status === "unfilled") {
            setIsAdLoaded(false);
          }
        }
      });
    });

    observer.observe(insRef.current, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, [mounted]);

  if (!mounted) return null;

  // Local/Dev ortamında clientId yoksa test modudur, hep göster.
  const showWrapper = !clientId || isAdLoaded;

  return (
    <div 
      className={`w-full max-w-3xl mx-auto transition-all duration-700 ease-in-out overflow-hidden ${
        showWrapper 
          ? `p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm opacity-100 ${className}` 
          : "max-h-0 opacity-0 m-0 p-0 border-0"
      }`}
    >
      {/* Sağ Üst Reklam Etiketi */}
      {showWrapper && (
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/50 text-[10px] uppercase font-semibold tracking-wider text-slate-400">
          <span className="inline-flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
            Sponsorlu / Reklam
          </span>
          <span className="text-slate-400 font-normal">SosyalIndir AdSense</span>
        </div>
      )}

      {/* AdSense HTML Birimi */}
      <div className={`flex items-center justify-center overflow-hidden ${showWrapper ? "min-h-[90px]" : "h-auto"}`}>
        {clientId ? (
          <ins
            ref={insRef}
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
