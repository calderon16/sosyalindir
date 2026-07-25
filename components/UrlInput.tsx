"use client";

import React, { useState, useTransition } from "react";
import { detectPlatform, PlatformType } from "@/lib/platformDetect";
import { PlatformBadge } from "@/components/PlatformBadge";
import { ArrowRight, Clipboard, Loader2, X, Download } from "lucide-react";

interface UrlInputProps {
  onResolve?: (url: string) => void;
  isLoading?: boolean;
}

/**
 * Girdi içindeki boşlukları ve görünmez Unicode karakterlerini temizler
 */
function cleanUrlInput(val: string): string {
  return val.trim().replace(/[\u200B-\u200D\uFEFF]/g, "");
}

/**
 * Ana sayfa büyük URL girdi alanı ve canlı platform algılama bileşeni
 */
export function UrlInput({ onResolve, isLoading = false }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [detectedPlatform, setDetectedPlatform] = useState<PlatformType>("unknown");
  const [, startTransition] = useTransition();

  // Input değiştikçe canlı platform tespiti
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setUrl(rawVal);
    
    const cleaned = cleanUrlInput(rawVal);
    startTransition(() => {
      setDetectedPlatform(detectPlatform(cleaned));
    });
  };

  // Panodan yapıştırma
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        const cleaned = cleanUrlInput(text);
        setDetectedPlatform(detectPlatform(cleaned));
      }
    } catch {
      // Pano izni olmaması durumunda hata fırlatmayı engelle
    }
  };

  // Temizleme
  const handleClear = () => {
    setUrl("");
    setDetectedPlatform("unknown");
  };

  // Form gönderme
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = cleanUrlInput(url);
    if (!cleaned || isLoading) return;
    
    if (onResolve) {
      onResolve(cleaned);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-4">
      {/* Input Konteyneri */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition duration-500"></div>
        
        <div className="relative flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl focus-within:border-emerald-500/50 transition-colors">
          {/* Sol: Input Alanı */}
          <div className="relative flex-1 w-full flex items-center pl-4 pr-2 py-2">
            <input
              type="text"
              value={url}
              onChange={handleInputChange}
              placeholder="Instagram, TikTok, Shorts veya Facebook Reels linkini yapıştırın..."
              className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base outline-none pr-8 disabled:opacity-50"
              disabled={isLoading}
            />

            {/* Temizle veya Panodan Yapıştır Butonu */}
            <div className="absolute right-3 flex items-center gap-2">
              {url ? (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isLoading}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
                  title="Temizle"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePaste}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-emerald-400 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 disabled:opacity-50 transition-colors"
                  title="Panodan Yapıştır"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>Yapıştır</span>
                </button>
              )}
            </div>
          </div>

          {/* Sağ: İndir Butonu & Yüklenme Durumu */}
          <button
            type="submit"
            disabled={!cleanUrlInput(url) || isLoading}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 active:scale-95 disabled:opacity-60 disabled:pointer-events-none transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 min-w-[170px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Bilgiler alınıyor...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>İndir</span>
                <ArrowRight className="w-4 h-4 hidden sm:block" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Algılanan Platform Rozeti */}
      {detectedPlatform !== "unknown" && !isLoading && (
        <div className="flex items-center justify-center gap-2 animate-fadeIn">
          <span className="text-xs text-slate-400">Algılanan Platform:</span>
          <PlatformBadge platform={detectedPlatform} />
        </div>
      )}
    </form>
  );
}
