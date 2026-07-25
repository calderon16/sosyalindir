"use client";

import React, { useState } from "react";
import { UrlInput } from "@/components/UrlInput";
import { VideoPreviewCard, VideoMetaData } from "@/components/VideoPreviewCard";
import { AdSlot } from "@/components/AdSlot";
import { AlertCircle } from "lucide-react";

interface PlatformLandingClientProps {
  placeholder?: string;
  defaultPlatformName?: string;
}

/**
 * Landing sayfaları için etkileşimli URL indirme ve sonuç kartı gösterim bileşeni
 */
export function PlatformLandingClient({
  defaultPlatformName = "sosyal medya",
}: PlatformLandingClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<VideoMetaData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResolveUrl = async (url: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setResultData(null);

    try {
      const res = await fetch("/api/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.error || "Bu bağlantı şu anda işlenemiyor, linki kontrol edip tekrar dener misin?"
        );
      }

      setResultData(json.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Bu bağlantı şu anda işlenemiyor, linki kontrol edip tekrar dener misin?");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResultData(null);
    setErrorMessage(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* URL Girdi Alanı */}
      <UrlInput onResolve={handleResolveUrl} isLoading={isLoading} />

      {/* Reklam Birimi 1 */}
      <AdSlot slotId="1000000003" className="my-4" />

      {/* Hata Mesajı */}
      {errorMessage && (
        <div className="max-w-md mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2 text-left animate-fadeIn">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Çözümlenen Sonuç Kartı */}
      {resultData && (
        <div className="space-y-6">
          <VideoPreviewCard data={resultData} onReset={handleReset} />
          {/* Reklam Birimi 2 */}
          <AdSlot slotId="1000000004" className="mt-6" />
        </div>
      )}
    </div>
  );
}
