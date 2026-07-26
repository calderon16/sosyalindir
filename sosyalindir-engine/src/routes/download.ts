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
router.get("/", async (req: Request, res: Response): Promise<void> => {
  const fileId = req.query.fileId as string;
  const formatUrl = (req.query.formatUrl || req.query.url) as string;
  const filename = (req.query.filename as string) || "sosyalindir-video.mp4";
  const resolvedTimestamp = req.query.t ? parseInt(req.query.t as string, 10) : 0;

  const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");

  if (resolvedTimestamp > 0) {
    const timeDiffSeconds = ((Date.now() - resolvedTimestamp) / 1000).toFixed(2);
    console.log(`[Download Proxy] /resolve ve /download arasındaki zaman farkı: ${timeDiffSeconds} saniye`);
  }

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

    console.log(`[Download Proxy] Target CDN URL: ${formatUrl}`);
    console.log(`[Download Proxy] Headers:`, JSON.stringify(headers, null, 2));

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
  } catch (err: any) {
    let cdnResponseBody = "";
    if (err.response && err.response.data) {
      try {
        if (typeof err.response.data.read === "function" || typeof err.response.data.on === "function") {
          const chunks: Buffer[] = [];
          for await (const chunk of err.response.data) {
            chunks.push(Buffer.from(chunk));
          }
          cdnResponseBody = Buffer.concat(chunks).toString("utf-8");
        } else if (Buffer.isBuffer(err.response.data)) {
          cdnResponseBody = err.response.data.toString("utf-8");
        } else if (typeof err.response.data === "object") {
          cdnResponseBody = JSON.stringify(err.response.data);
        } else {
          cdnResponseBody = String(err.response.data);
        }
      } catch {
        cdnResponseBody = "Hata gövdesi okunamadı";
      }
    }

    console.error(`[Download Router Error Status]: ${err.response?.status || "NO_STATUS"}`);
    console.error(`[Download Router Error CDN Body]: ${cdnResponseBody}`);

    if (!res.headersSent) {
      res.status(err.response?.status || 502).json({
        error: `Medya dosyası indirilemedi: ${err.message}`,
        status: err.response?.status,
        cdnResponse: cdnResponseBody,
      });
    }
  }
});

export default router;
