import { Request, Response, Router } from "express";
import axios from "axios";
import fs from "fs";
import { getTempFilePath } from "../services/ytdlp.js";

const router = Router();

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

  // 2. Durum: Doğrudan uzaktan URL (proxy streaming)
  if (!formatUrl || typeof formatUrl !== "string") {
    res.status(400).json({ error: "Geçerli bir 'formatUrl' veya 'fileId' parametresi gereklidir." });
    return;
  }

  try {
    const response = await axios({
      method: "GET",
      url: formatUrl,
      responseType: "stream",
      timeout: 30000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
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
    if (!res.headersSent) {
      res.status(502).json({
        error: `Medya dosyası indirilemedi: ${error.message}`,
      });
    }
  }
});

export default router;
