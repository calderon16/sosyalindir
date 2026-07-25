import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { limiter } from "./middleware/rateLimit.js";
import resolveRouter from "./routes/resolve.js";
import downloadRouter from "./routes/download.js";

// Ortam değişkenlerini yükle
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "4000", 10);
const HOST = "0.0.0.0";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Reverse proxy (Railway) için trust proxy ayarı
app.set("trust proxy", 1);

// JSON ve URL encoded gövde ayrıştırıcılar
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Konfigürasyonu (FRONTEND_URL, Vercel domainleri ve sunucu isteklerine izin ver)
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin === FRONTEND_URL ||
        origin.includes("vercel.app") ||
        origin.includes("localhost") ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        callback(new Error("CORS politikasınca engellendi."));
      }
    },
    credentials: true,
  })
);

// IP bazlı Rate Limiter middleware
app.use(limiter);

// Sağlık kontrolü (Health Check)
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "sosyalindir-engine",
    timestamp: new Date().toISOString(),
  });
});

// Endpoint'ler
app.use(resolveRouter);
app.use(downloadRouter);

// Bulunamayan Rotalar (404)
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Aranan endpoint bulunamadı." });
});

// Genel Hata Yakalama Middleware (500)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[SosyalIndir Engine Error]:", err.message);
  res.status(500).json({
    error: err.message || "Beklenmeyen bir sunucu hatası oluştu.",
  });
});

// Sunucuyu 0.0.0.0 üzerinde dinlemeye al
app.listen(PORT, HOST, () => {
  console.log(`🚀 SosyalIndir Engine ${HOST}:${PORT} adresinde aktif.`);
  console.log(`🔒 İzin verilen Frontend URL: ${FRONTEND_URL}`);
});
