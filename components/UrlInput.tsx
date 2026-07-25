"use client";

import React, { useState } from "react";
import { detectPlatform, PlatformType } from "@/lib/platformDetect";
import { PlatformBadge } from "@/components/PlatformBadge";
import { Download, Loader2, Clipboard, X, ArrowRight, AlertCircle, Sparkles } from "lucide-react";

interface UrlInputProps {
  onResolve?: (url: string) => void;
  isLoading?: boolean;
}

/**
 * Girdi metnini temizler: Sıfır genişlikli boşlukları, gizli unicode karakterleri ve boşlukları siler.
 */
function cleanUrlInput(text: string): string {
  if (!text) return "";
  return text.trim().replace(/[\u200B-\u200D\uFEFF]/g, "");
}

export function UrlInput({ onResolve, isLoading = false }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [detectedPlatform, setDetectedPlatform] = useState<PlatformType>("unknown");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const val = cleanUrlInput(rawVal);
    setUrl(rawVal);
    setDetectedPlatform(detectPlatform(val));
  };

  const handleClear = () => {
    setUrl("");
    setDetectedPlatform("unknown");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cleaned = cleanUrlInput(text);
      if (cleaned) {
        setUrl(cleaned);
        setDetectedPlatform(detectPlatform(cleaned));
      }
    } catch (err) {
      console.error("Panodan yapıştırma başarısız:", err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = cleanUrlInput(url);
    if (!cleaned || isLoading || detectedPlatform === "youtube") return;
    
    if (onResolve) {
      onResolve(cleaned);
    }
  };

  const isYouTube = detectedPlatform === "youtube";

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
              placeholder="Instagram, TikTok veya Facebook Reels linkini yapıştırın..."
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
            disabled={!cleanUrlInput(url) || isLoading || isYouTube}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 active:scale-95 disabled:opacity-60 disabled:pointer-events-none transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 min-w-[170px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Hazırlanıyor...</span>
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

      {/* Yüklenme Süresinde Kullanıcı Bilgilendirme Notu */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-xs text-emerald-400/90 animate-pulse pt-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Video yüksek kalite ve evrensel cihaz uyumluluğu için hazırlanıyor...</span>
        </div>
      )}

      {/* Algılanan Platform Rozeti */}
      {detectedPlatform !== "unknown" && !isLoading && (
        <div className="flex items-center justify-between px-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Algılanan Platform:</span>
            <PlatformBadge platform={detectedPlatform} />
          </div>

          <span className="text-slate-500 hidden sm:inline">
            Otomatik bağlantı doğrulaması aktif
          </span>
        </div>
      )}

      {/* YouTube Shorts Geçici Uyarı Banner'ı */}
      {isYouTube && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm animate-fadeIn">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">YouTube Shorts Desteği Yakında 🚧</span>
            <span>
              YouTube bot koruması nedeniyle Shorts indirme özelliği şu anda geliştirme aşamasındadır. Şimdilik <strong>Instagram Reels</strong>, <strong>TikTok</strong> ve <strong>Facebook Reels</strong> videolarını sorunsuz indirebilirsiniz.
            </span>
          </div>
        </div>
      )}
    </form>
  );
}
