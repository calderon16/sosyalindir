import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

/**
 * IP bazlı genel istek sınırlayıcı (Rate Limiter)
 * Dakikada maksimum 20 isteğe izin verir.
 */
export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 dakika (60.000 ms)
  max: 20, // IP başına maksimum 20 istek
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Çok fazla istek gönderdiniz. Lütfen bir dakika bekledikten sonra tekrar deneyin.",
  },
  handler: (_req, res, _next, options) => {
    res.status(429).json(options.message);
  },
});

// NOTE: Bu bellek tabanlı sayaç tek instance Railway deployment'ları içindir.
// Yatay ölçeklenmede Redis tabanlı paylaşımlı bir store (örn. ioredis + rate-limiter-flexible) kullanılmalıdır.

interface IpDownloadStats {
  count: number;
  totalBytes: number;
  windowStart: number;
}

const downloadStatsMap = new Map<string, IpDownloadStats>();

// Limit Sabitleri: Saatte max 30 indirme VEYA 1 GB (1073741824 bytes) transfer
const ONE_HOUR_MS = 60 * 60 * 1000;
const MAX_HOURLY_DOWNLOADS = 30;
const MAX_HOURLY_BYTES = 1024 * 1024 * 1024; // 1 GB (1.073.741.824 Byte)

/**
 * Bellek sızıntısını önlemek için her 10 dakikada bir süresi dolmuş IP sayaçlarını temizle
 */
setInterval(() => {
  const now = Date.now();
  for (const [ip, stats] of downloadStatsMap.entries()) {
    if (now - stats.windowStart > ONE_HOUR_MS) {
      downloadStatsMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);

/**
 * /download endpoint'ine özel IP bazlı saatlik bant genişliği ve indirme sayısı sınırlayıcısı
 */
export function downloadBandwidthLimiter(req: Request, res: Response, next: NextFunction): void {
  const clientIp = (
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.ip ||
    "127.0.0.1"
  ).trim();

  const now = Date.now();
  let stats = downloadStatsMap.get(clientIp);

  if (!stats || now - stats.windowStart > ONE_HOUR_MS) {
    stats = { count: 0, totalBytes: 0, windowStart: now };
    downloadStatsMap.set(clientIp, stats);
  }

  // Limit kontrolü: Saatlik 30 indirme veya 1 GB aşılmışsa 429 dön
  if (stats.count >= MAX_HOURLY_DOWNLOADS || stats.totalBytes >= MAX_HOURLY_BYTES) {
    res.status(429).json({
      error: "Saatlik indirme limitine ulaştın, lütfen bir süre sonra tekrar dene.",
    });
    return;
  }

  // İndirme tamamlandığında aktarılan boyutu ve indirme sayısını kaydet
  res.on("finish", () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const contentLength = parseInt((res.getHeader("content-length") as string) || "0", 10);
      if (stats) {
        stats.count += 1;
        stats.totalBytes += contentLength;
      }
    }
  });

  next();
}
