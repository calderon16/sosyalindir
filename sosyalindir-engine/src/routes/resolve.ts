import { Request, Response, Router } from "express";
import { resolveVideoWithYtDlp } from "../services/ytdlp.js";
import { resolveYouTubeWithSaverApi } from "../services/saverApiService.js";

const router = Router();

// SSRF Korumalı — İzin Verilen Tam Alan Adları ve Alt Alan Adları Listesi
const ALLOWED_PLATFORM_DOMAINS: Record<string, string[]> = {
  instagram: ["instagram.com", "instagr.am"],
  tiktok: ["tiktok.com", "vmtiktok.com"],
  youtube: ["youtube.com", "youtu.be"],
  facebook: ["facebook.com", "fb.watch", "fb.com", "fb.gg"],
};

/**
 * SSRF Korumalı Alan Adı Doğrulaması ve Platform Tespiti.
 * Substring veya wildcard açıklarına izin vermeyen sıkı URL hostname kontrolü yapar.
 */
function validateAndDetectPlatform(urlStr: string): { isValid: boolean; platform: string } {
  if (!urlStr || typeof urlStr !== "string") {
    return { isValid: false, platform: "unknown" };
  }

  let parsed: URL;
  try {
    parsed = new URL(urlStr.trim());
    // Sadece http ve https protokollerine izin ver (file://, gopher://, internal IP engeli)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { isValid: false, platform: "unknown" };
    }
  } catch {
    return { isValid: false, platform: "unknown" };
  }

  const hostname = parsed.hostname.toLowerCase();

  for (const [platform, domains] of Object.entries(ALLOWED_PLATFORM_DOMAINS)) {
    for (const domain of domains) {
      if (hostname === domain || hostname.endsWith("." + domain)) {
        // YouTube durumunda Shorts veya youtu.be kontrolü
        if (platform === "youtube") {
          // SaverAPI entegrasyonu sonrası: tüm YouTube URL'leri (Shorts, normal video, youtu.be) desteklenir
          return { isValid: true, platform: "youtube" };
        }
        return { isValid: true, platform };
      }
    }
  }

  return { isValid: false, platform: "unknown" };
}

/**
 * GET /resolve?url=...
 * Video linkinden metadata ve direkt indirme URL'ini çözer.
 */
router.get("/", async (req: Request, res: Response): Promise<void> => {
  const urlParam = req.query.url;

  if (!urlParam || typeof urlParam !== "string") {
    res.status(400).json({ error: "Geçerli bir 'url' sorgu parametresi gereklidir." });
    return;
  }

  const cleanUrl = urlParam.trim();
  const { isValid, platform } = validateAndDetectPlatform(cleanUrl);

  if (!isValid) {
    res.status(400).json({
      error: "Desteklenmeyen platform. Yalnızca Instagram, TikTok, YouTube ve Facebook Reels bağlantıları kabul edilir.",
    });
    return;
  }

  try {
    let result;

    if (platform === "youtube") {
      // YouTube: SaverAPI (saverapi.net) üzerinden çözümlenir
      result = await resolveYouTubeWithSaverApi(cleanUrl);
    } else {
      // Instagram, TikTok, Facebook: yt-dlp motoru — değişmeden devam eder
      result = await resolveVideoWithYtDlp(cleanUrl, platform);
    }

    res.json({
      status: "success",
      data: result,
    });
  } catch (err: unknown) {
    const error = err as Error;
    const errorMsg = error.message || "Video bilgileri çözümlenemedi.";

    if (errorMsg.includes("URI malformed") || errorMsg.includes("URIError")) {
      res.status(400).json({
        error: "Geçersiz bağlantı formatı, lütfen linki kontrol edip tekrar yapıştırın.",
      });
      return;
    }

    res.status(422).json({
      error: errorMsg,
    });
  }
});

export default router;
