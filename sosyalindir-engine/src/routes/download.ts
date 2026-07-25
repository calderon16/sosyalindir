import { Request, Response, Router } from "express";
import axios from "axios";
import fs from "fs";
import { getTempFilePath } from "../services/ytdlp.js";

const router = Router();

/**
 * Hedef CDN URL'ine göre uygun Referer, User-Agent ve HTTP header'larını oluşturur
 */
function buildCdnHeaders(targetUrl: string): Record<string, string> {
  const lowercaseUrl = targetUrl.toLowerCase();

  // Mobil Chrome / TikTok uyumlu varsayılan User-Agent
  let userAgent = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";
  let referer = "https://www.google.com/";

  if (lowercaseUrl.includes("tiktokcdn.com") || lowercaseUrl.includes("tiktok.com")) {
    referer = "https://www.tiktok.com/";
    userAgent = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";
  } else if (lowercaseUrl.includes("cdninstagram.com") || lowercaseUrl.includes("fbcdn.net") || lowercaseUrl.includes("instagram.com")) {
    referer = "https://www.instagram.com/";
    userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
  } else if (lowercaseUrl.includes("facebook.com") || lowercaseUrl.includes("fb.watch")) {
    referer = "https://www.facebook.com/";
    userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
  }

  return {
    "User-Agent": userAgent,
    "Referer": referer,
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9,tr;q=0.8",
  };
}

/**
 * GET /download?formatUrl=...&filename=... VEYA /download?fileId=...&filename=...
 * Medya dosyasını (uzaktan stream veya yerel birleştirilmiş dosya) istemciye sunar.
 */
router.get("/download", async (req: Request, res: Response): Promise<void> => {
  const fileId = req.query.fileId as string;
  const formatUrl = (req.query.formatUrl || req.query.url) as string;
  const filename = (req.query.filename as string) || "sosyalindir-video.mp4";

  const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");

  // 1. Durum: Yerel birleştirilmiş (temp merged) dosya indirmesi
  if (fileId) {
    const tempPath = getTempFilePath(fileId);
    if (!tempPath) {
      res.status(444).json({ error: "İstenen medya süresi dolmuş veya bulunamadı." });
      return;
    }

    try {
      const stats = fs.statSync(tempPath);
      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
      res.setHeader("Content-Length", String(stats.size));

      const stream = fs.createReadStream(tempPath);
      stream.pipe(res);
      return;
    } catch (err: unknown) {
      const error = err as Error;
      if (!res.headersSent) {
        res.status(500).json({ error: `Yerel dosya okunamadı: ${error.message}` });
      }
      return;
    }
  }

  // 2. Durum: Doğrudan uzaktan CDN URL'i (proxy streaming)
  if (!formatUrl || typeof formatUrl !== "string") {
    res.status(400).json({ error: "Geçerli bir 'formatUrl' veya 'fileId' parametresi gereklidir." });
    return;
  }

  try {
    const headers = buildCdnHeaders(formatUrl);

    const response = await axios({
      method: "GET",
      url: formatUrl,
      responseType: "stream",
      timeout: 35000,
      headers,
    });

    const contentType = response.headers["content-type"];
    if (contentType) {
      res.setHeader("Content-Type", String(contentType));
    } else {
      res.setHeader("Content-Type", "video/mp4");
    }

    res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);

    const contentLength = response.headers["content-length"];
    if (contentLength) {
      res.setHeader("Content-Length", String(contentLength));
    }

    response.data.pipe(res);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[Download Router Error]:", error.message);
    if (!res.headersSent) {
      res.status(502).json({
        error: `Medya dosyası indirilemedi: ${error.message}`,
      });
    }
  }
});

export default router;
