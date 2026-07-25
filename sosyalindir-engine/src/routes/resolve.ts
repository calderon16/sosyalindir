import { Request, Response, Router } from "express";
import { resolveVideoWithYtDlp } from "../services/ytdlp.js";

const router = Router();

/**
 * İzin verilen sosyal medya alan adları ve platform tespiti
 */
function validateAndDetectPlatform(urlStr: string): { isValid: boolean; platform: string } {
  try {
    const parsedUrl = new URL(urlStr);
    const host = parsedUrl.hostname.toLowerCase();
    const pathname = parsedUrl.pathname.toLowerCase();

    // Instagram
    if (host.includes("instagram.com")) {
      return { isValid: true, platform: "instagram" };
    }

    // TikTok
    if (host.includes("tiktok.com")) {
      return { isValid: true, platform: "tiktok" };
    }

    // YouTube Shorts
    if ((host.includes("youtube.com") && pathname.includes("/shorts")) || host.includes("youtu.be")) {
      return { isValid: true, platform: "youtube" };
    }

    // Facebook Reels
    if (host.includes("facebook.com") || host.includes("fb.watch")) {
      return { isValid: true, platform: "facebook" };
    }

    return { isValid: false, platform: "unknown" };
  } catch {
    return { isValid: false, platform: "unknown" };
  }
}

/**
 * GET /resolve?url=...
 * Video linkinden metadata ve direkt indirme URL'ini çözer.
 */
router.get("/resolve", async (req: Request, res: Response): Promise<void> => {
  const urlParam = req.query.url;

  if (!urlParam || typeof urlParam !== "string") {
    res.status(400).json({ error: "Geçerli bir 'url' sorgu parametresi gereklidir." });
    return;
  }

  const cleanUrl = urlParam.trim();
  const { isValid, platform } = validateAndDetectPlatform(cleanUrl);

  if (!isValid) {
    res.status(400).json({
      error: "Desteklenmeyen platform. Yalnızca Instagram, TikTok, YouTube Shorts ve Facebook Reels bağlantıları kabul edilir.",
    });
    return;
  }

  try {
    const result = await resolveVideoWithYtDlp(cleanUrl, platform);
    res.json({
      status: "success",
      data: result,
    });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(422).json({
      error: error.message || "Video bilgileri çözümlenemedi.",
    });
  }
});

export default router;
