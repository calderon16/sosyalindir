import rateLimit from "express-rate-limit";

/**
 * IP bazlı istek sınırlayıcı (Rate Limiter)
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
