import { Request, Response, Router } from "express";
import axios from "axios";

const router = Router();

/**
 * GET /download?formatUrl=...&filename=...
 * Verilen direkt medya URL'ini istemciye sunucuda saklamadan doğrudan stream (pipe) eder.
 */
router.get("/download", async (req: Request, res: Response): Promise<void> => {
  const formatUrl = (req.query.formatUrl || req.query.url) as string;
  const filename = (req.query.filename as string) || "sosyalindir-video.mp4";

  if (!formatUrl || typeof formatUrl !== "string") {
    res.status(400).json({ error: "Geçerli bir 'formatUrl' parametresi gereklidir." });
    return;
  }

  try {
    // Güvenli dosya adı sanitization
    const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");

    // Medya sunucusundan stream olarak veriyi al
    const response = await axios({
      method: "GET",
      url: formatUrl,
      responseType: "stream",
      timeout: 30000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    // İndirme header'larını ayarla
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

    // Doğrudan yanıt nesnesine aktar (pipe)
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
