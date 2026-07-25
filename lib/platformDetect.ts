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
 * Desteklenen platformlara ait regex desenleri
 */
const PATTERNS: Record<Exclude<PlatformType, "unknown">, RegExp> = {
  // Instagram: instagram.com/reel/..., instagram.com/p/..., instagram.com/reels/...
  instagram: /https?:\/\/(www\.)?instagram\.com\/(reel|reels|p|tv|share)\/[\w.-]+/i,
  
  // TikTok: tiktok.com/@user/video/..., vm.tiktok.com/..., vt.tiktok.com/...
  tiktok: /https?:\/\/(www\.|vm\.|vt\.|t\.)?tiktok\.com\/(@[\w.-]+\/video\/\d+|[\w.-]+)/i,
  
  // YouTube Shorts: youtube.com/shorts/..., youtu.be/...
  youtube: /https?:\/\/(www\.)?(youtube\.com\/shorts\/[\w-]+|youtu\.be\/[\w-]+)/i,
  
  // Facebook Reels / Video: facebook.com/reel/..., facebook.com/watch/..., fb.watch/...
  facebook: /https?:\/\/(www\.|web\.|m\.|fb\.)?(facebook\.com\/(reel|reels|watch|share\/r|.+?\/videos)\/[\w.-]+|fb\.watch\/[\w.-]+)/i,
};

/**
 * Verilen bir URL string'inin hangi sosyal medya platformuna ait olduğunu döndürür.
 * 
 * @param url Kullanıcının yapıştırdığı URL metni
 * @returns "instagram" | "tiktok" | "youtube" | "facebook" | "unknown"
 */
export function detectPlatform(url: string): PlatformType {
  if (!url || typeof url !== "string") {
    return "unknown";
  }

  const trimmedUrl = url.trim();

  if (PATTERNS.instagram.test(trimmedUrl)) {
    return "instagram";
  }
  if (PATTERNS.tiktok.test(trimmedUrl)) {
    return "tiktok";
  }
  if (PATTERNS.youtube.test(trimmedUrl)) {
    return "youtube";
  }
  if (PATTERNS.facebook.test(trimmedUrl)) {
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
    name: "YouTube Shorts",
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
