/**
 * SosyalIndir — Platform Algılama Yardımcısı (Platform Detector)
 * 
 * Verilen URL metninin Instagram, TikTok, YouTube Shorts veya Facebook Reels
 * bağlantısı olup olmadığını regex pattern'leri ile tespit eder.
 */

export type PlatformType = "instagram" | "tiktok" | "youtube" | "facebook" | "unknown";

export interface PlatformConfig {
  id: PlatformType;
  name: string;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
}

/**
 * Desteklenen platformlara ait genişletilmiş, gerçek dünya uyumlu regex desenleri.
 * (http/https protokol takısı isteğe bağlıdır; query parametreleri ve mobil kısa linkler desteklenir)
 */
const PATTERNS: Record<Exclude<PlatformType, "unknown">, RegExp> = {
  // Instagram: instagram.com/reel/..., instagram.com/reels/..., instagram.com/p/..., instagram.com/share/..., m.instagram.com
  instagram: /^(https?:\/\/)?(www\.|m\.)?instagram\.com\/(reel|reels|p|tv|share)\/[^/\s]+/i,
  
  // TikTok: tiktok.com/@user/video/..., vm.tiktok.com/..., vt.tiktok.com/..., tiktok.com/t/..., m.tiktok.com/v/...
  tiktok: /^(https?:\/\/)?(www\.|vm\.|vt\.|t\.|m\.)?tiktok\.com\/(@[\w.-]+\/video\/\d+|t\/[\w.-]+|v\/\d+|[\w.-]+)/i,
  
  // YouTube: youtube.com/watch?v=..., youtube.com/shorts/..., youtu.be/..., m.youtube.com
  youtube: /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch|shorts\/|embed\/|v\/|live\/)|youtu\.be\/)[^\s]*/i,
  
  // Facebook Reels & Video: facebook.com/reel/..., facebook.com/watch/..., fb.watch/..., facebook.com/share/r/...
  facebook: /^(https?:\/\/)?(www\.|web\.|m\.|fb\.)?(facebook\.com\/(reel|reels|watch|share\/r|.+?\/videos|\?v=)|fb\.watch\/)/i,
};

/**
 * Verilen bir URL string'inin hangi sosyal medya platformuna ait olduğunu döndürür.
 * Girdi içindeki boşluklar ve görünmez karakterler (Zero-Width Space vb.) temizlenir.
 * 
 * @param url Kullanıcının yapıştırdığı URL metni
 * @returns "instagram" | "tiktok" | "youtube" | "facebook" | "unknown"
 */
export function detectPlatform(url: string): PlatformType {
  if (!url || typeof url !== "string") {
    return "unknown";
  }

  // Görünmez karakterleri (Unicode Zero-Width) ve sağ-sol boşlukları temizle
  const cleanUrl = url.trim().replace(/[\u200B-\u200D\uFEFF]/g, "");

  if (!cleanUrl) {
    return "unknown";
  }

  if (PATTERNS.instagram.test(cleanUrl)) {
    return "instagram";
  }
  if (PATTERNS.tiktok.test(cleanUrl)) {
    return "tiktok";
  }
  if (PATTERNS.youtube.test(cleanUrl)) {
    return "youtube";
  }
  if (PATTERNS.facebook.test(cleanUrl)) {
    return "facebook";
  }

  return "unknown";
}

/**
 * Platform isimleri ve stil konfigürasyonu
 */
export const PLATFORM_INFO: Record<PlatformType, PlatformConfig> = {
  instagram: {
    id: "instagram",
    name: "Instagram Reels",
    colorClass: "from-pink-500 via-red-500 to-yellow-500",
    badgeBg: "bg-pink-500/10 border-pink-500/30",
    badgeText: "text-pink-600 dark:text-pink-400",
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok",
    colorClass: "from-cyan-400 to-pink-500",
    badgeBg: "bg-slate-900/10 dark:bg-white/10 border-slate-900/20 dark:border-white/20",
    badgeText: "text-slate-900 dark:text-white",
  },
  youtube: {
    id: "youtube",
    name: "YouTube",
    colorClass: "from-red-600 to-red-700",
    badgeBg: "bg-red-500/10 border-red-500/30",
    badgeText: "text-red-600 dark:text-red-400",
  },
  facebook: {
    id: "facebook",
    name: "Facebook Reels",
    colorClass: "from-blue-600 to-blue-700",
    badgeBg: "bg-blue-500/10 border-blue-500/30",
    badgeText: "text-blue-600 dark:text-blue-400",
  },
  unknown: {
    id: "unknown",
    name: "Bilinmeyen Link",
    colorClass: "from-gray-400 to-gray-600",
    badgeBg: "bg-gray-500/10 border-gray-500/30",
    badgeText: "text-gray-600 dark:text-gray-400",
  },
};
