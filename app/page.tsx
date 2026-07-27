"use client";

import React, { useState } from "react";
import { UrlInput } from "@/components/UrlInput";
import { VideoPreviewCard, VideoMetaData } from "@/components/VideoPreviewCard";
import { AdSlot } from "@/components/AdSlot";
import { TrustBadges } from "@/components/TrustBadges";
import { AboutSection } from "@/components/AboutSection";
import { Instagram, Youtube, Facebook, Video, ShieldCheck, Zap, Sparkles, AlertCircle } from "lucide-react";

/**
 * SosyalIndir Ana Sayfası
 */
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<VideoMetaData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Link indirme/çözümleme talebi
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

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "SosyalIndir",
        "url": "https://sosyalindirapp.com",
        "description": "Instagram Reels, TikTok ve Facebook Reels videolarını filigransız, hızlı ve %100 ücretsiz orijinal kalitede indirin.",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "TRY"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Ana Sayfa",
            "item": "https://sosyalindirapp.com"
          }
        ]
      }
    ]
  };

  return (
    <div className="w-full py-12 md:py-20 px-4 sm:px-6 flex flex-col items-center justify-center">
      {/* Structural Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      <div className="max-w-4xl mx-auto text-center space-y-6">
        
        {/* Üst Rozet */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sadece Yapıştır, Gerisini Biz Halledelim</span>
        </div>

        {/* Ana Başlık */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Sosyal Medya Videolarını <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Orijinal Kalitede İndirin
          </span>
        </h1>

        {/* Açıklama */}
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Kayıt olmadan, karmaşık adımlar ve sinir bozucu reklamlar olmadan videolarınızı saniyeler içinde cihazınıza kaydedin.
        </p>

        {/* Trust Badges (Page UI Leading Pill Deseni) - Hero Altında, Input Öncesinde */}
        <div className="pt-2">
          <TrustBadges />
        </div>

        {/* Büyük URL Input Bileşeni */}
        <div className="pt-2">
          <UrlInput onResolve={handleResolveUrl} isLoading={isLoading} />
        </div>

        {/* 1. Reklam Birimi (URL Input Altında) */}
        <AdSlot slotId="1000000001" className="my-6" />

        {/* Desteklenen Platformlar Alt Yazısı */}
        <div className="pt-2 flex flex-col items-center gap-3">
          <p className="text-xs font-medium text-slate-400 flex items-center justify-center gap-1.5 flex-wrap">
            <span>Instagram, TikTok ve Facebook Reels destekleniyor (YouTube Shorts yakında)</span>
          </p>

          <div className="flex items-center justify-center gap-4 text-slate-500 text-xs">
            <div className="flex items-center gap-1.5 hover:text-pink-400 transition-colors">
              <Instagram className="w-4 h-4" />
              <span>Reels</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
              <Video className="w-4 h-4" />
              <span>TikTok</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
              <Youtube className="w-4 h-4" />
              <span>Shorts (Yakında)</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
              <Facebook className="w-4 h-4" />
              <span>Facebook</span>
            </div>
          </div>
        </div>

        {/* Kullanıcı Dostu Hata Mesajı */}
        {errorMessage && (
          <div className="max-w-md mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2 text-left animate-fadeIn">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Çözümlenen Video Sonuç Kartı */}
        {resultData && (
          <div className="space-y-6">
            <VideoPreviewCard data={resultData} onReset={handleReset} />
            
            {/* 2. Reklam Birimi (Video Preview Kartının Altında) */}
            <AdSlot slotId="1000000002" className="mt-6" />
          </div>
        )}

        {/* Özellikler Özeti (Alt Kısım) */}
        <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
            <Zap className="w-6 h-6 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Anında İndirme</h3>
            <p className="text-xs text-slate-400">Bekleme süresi yok. Linki yapıştırın ve saniyeler içinde doğrudan indirin.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Filigransız TikTok</h3>
            <p className="text-xs text-slate-400">TikTok videolarını logo ve filigran olmadan orijinal netliğinde kaydedin.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Gizli & Güvenli</h3>
            <p className="text-xs text-slate-400">Sunucularımızda hiçbir videonuz saklanmaz, verileriniz tamamen güvendedir.</p>
          </div>
        </div>

        {/* About Section (Page UI About Section Deseni) - Alt Kısımda */}
        <AboutSection />

      </div>
    </div>
  );
}
