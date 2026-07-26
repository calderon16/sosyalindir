"use client";

import React from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { PlatformType } from "@/lib/platformDetect";
import { PlatformBadge } from "@/components/PlatformBadge";
import { Download, Sparkles, RefreshCw, CheckCircle2, Clock, Film } from "lucide-react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export interface VideoFormatOption {
  formatId: string;
  ext: string;
  resolution: string;
  url: string;
  filesize?: number;
  isWatermarkless?: boolean;
  hasAudio?: boolean;
}

export interface VideoMetaData {
  id?: string;
  title?: string;
  author?: string;
  thumbnail?: string;
  duration?: number;
  platform?: PlatformType;
  downloadUrl?: string;
  formats?: VideoFormatOption[];
  fileId?: string;
}

interface VideoPreviewCardProps {
  data: VideoMetaData;
  onReset?: () => void;
}

/**
 * Dosya boyutunu MB/KB olarak biçimlendirir
 */
function formatBytes(bytes?: number): string {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `(${mb.toFixed(1)} MB)`;
  const kb = bytes / 1024;
  return `(${kb.toFixed(0)} KB)`;
}

/**
 * Saniyeyi Dakika:Saniye biçimine dönüştürür
 */
function formatDuration(seconds?: number): string {
  if (!seconds) return "";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

/**
 * Backend engine indirme bağlantısını akıllı şekilde (lokal temp fileId vs. uzaktan CDN formatUrl) oluşturur
 */
function getDownloadStreamUrl(rawUrl?: string, title: string = "video"): string {
  if (!rawUrl) return "";

  const engineBaseUrl = (process.env.NEXT_PUBLIC_DOWNLOADER_ENGINE_URL || "http://localhost:4000").replace(/\/$/, "");
  const safeTitle = title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `sosyalindir_${safeTitle}.mp4`;

  // 1. Eğer URL halihazırda backend'in kendi /download?fileId=... adresi ise
  if (rawUrl.startsWith("/download?") || rawUrl.startsWith("/download/")) {
    return `${engineBaseUrl}${rawUrl}`;
  }

  // 2. Eğer URL tam bağımsız bir http(s) indirme linki ise
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return `${engineBaseUrl}/download?formatUrl=${encodeURIComponent(rawUrl)}&filename=${encodeURIComponent(filename)}`;
  }

  // 3. Göreli / varsayılan yol
  return `${engineBaseUrl}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
}

/**
 * Çözümlenen video detaylarını ve format bazlı indirme butonlarını gösteren kart bileşeni
 */
export function VideoPreviewCard({ data, onReset }: VideoPreviewCardProps) {
  const {
    title = "Sosyal Medya Videosu",
    author = "Bilinmeyen Yayıncı",
    thumbnail,
    platform = "unknown",
    downloadUrl,
    duration,
    formats = [],
  } = data;

  const trackDownloadEvent = (qualityLabel: string) => {
    try {
      sendGAEvent("event", "download_click", {
        platform: platform || "unknown",
        quality: qualityLabel,
      });
    } catch {
      // Ignore GA errors
    }

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      try {
        window.gtag("event", "download_click", {
          platform: platform || "unknown",
          quality: qualityLabel,
        });
      } catch {
        // Ignore fallback errors
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6 animate-fadeIn text-left">
      {/* Üst Kısım: Platform Rozeti ve Yeni Link Butonu */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <PlatformBadge platform={platform} />
          {duration ? (
            <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3" />
              {formatDuration(duration)}
            </span>
          ) : null}
        </div>

        {onReset && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Yeni Link İndir</span>
          </button>
        )}
      </div>

      {/* İçerik: Görsel Önizleme ve Detaylar */}
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {/* Önizleme Görseli */}
        <div className="relative w-full sm:w-44 aspect-[9/16] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 flex items-center justify-center">
          {thumbnail ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-4">
              <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-50" />
              <span className="text-xs text-slate-500">Video Hazır</span>
            </div>
          )}
        </div>

        {/* Detaylar ve Kalite Seçenekleri */}
        <div className="flex-1 space-y-4 w-full">
          <div>
            <h3 className="text-base font-semibold text-white line-clamp-2 leading-snug">
              {title}
            </h3>
            <p className="text-xs text-emerald-400 mt-1 font-medium">@{author}</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Orijinal Yüksek Kalite & Sesli</span>
            </div>
            {platform === "tiktok" && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Filigransız HD İndirme Desteği</span>
              </div>
            )}
          </div>

          {/* Dinamik Format ve Kalite İndirme Butonları */}
          <div className="pt-2 space-y-2">
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              İndirme Seçenekleri:
            </span>

            {formats && formats.length > 0 ? (
              formats.map((fmt, idx) => {
                const streamUrl = getDownloadStreamUrl(fmt.url, title);
                const isWatermarkless = fmt.isWatermarkless || platform === "tiktok";
                const label = platform === "tiktok" && isWatermarkless
                  ? "Filigransız İndir (HD)"
                  : `${fmt.resolution || "HD"} İndir`;

                return (
                  <a
                    key={idx}
                    href={streamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    onClick={() => trackDownloadEvent(fmt.resolution || label)}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-between gap-2 border ${
                      idx === formats.length - 1
                        ? "text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 border-emerald-400 shadow-md shadow-emerald-500/10"
                        : "text-white bg-slate-800/80 hover:bg-slate-800 border-slate-700/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4 text-slate-400" />
                      <span>{label}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {fmt.filesize ? <span className="opacity-75">{formatBytes(fmt.filesize)}</span> : null}
                      <Download className="w-4 h-4" />
                    </div>
                  </a>
                );
              })
            ) : downloadUrl ? (
              <a
                href={getDownloadStreamUrl(downloadUrl, title)}
                target="_blank"
                rel="noopener noreferrer"
                download
                onClick={() => trackDownloadEvent("HD MP4")}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Videoyu İndir (MP4)</span>
              </a>
            ) : (
              <div className="text-xs text-slate-400 italic">
                İndirme seçeneği bulunamadı.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
