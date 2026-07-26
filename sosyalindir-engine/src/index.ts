import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import resolveRouter from "./routes/resolve";
import downloadRouter from "./routes/download";
import { limiter } from "./middleware/rateLimit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "https://sosyalindirapp.com";

// Express güvenli arkadaki proxy ip algılamasını aktif et
app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sıkılaştırılmış CORS Konfigürasyonu
const allowedOrigins = new Set([
  FRONTEND_URL.replace(/\/$/, ""),
  "https://sosyalindirapp.com",
  "https://www.sosyalindirapp.com",
  "http://localhost:3000",
]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Sunucular arası veya aynı kök istekler (!origin) ve izin verilen domainler
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS Blocked]: ${origin}`);
        callback(new Error("CORS politikasınca izin verilmeyen istek kuralı."));
      }
    },
    credentials: true,
  })
);

// Genel Rate Limiter Middleware (tüm endpoint'lere uygulanır)
app.use(limiter);

// Sağlık Kontrolü (Health Check) Endpoint'i
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "SosyalIndir Engine API",
    version: "1.0.0",
    frontendUrl: FRONTEND_URL,
    timestamp: new Date().toISOString(),
  });
});

// Route Tanımlamaları (/resolve ve /download)
app.use("/resolve", resolveRouter);
app.use("/download", downloadRouter);

// Hata Yakalama Middleware'i
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("[Unhandled Error]:", err.message || err);
    res.status(err.status || 500).json({
      error: err.message || "Sunucu içi beklenmeyen bir hata oluştu.",
    });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 SosyalIndir Engine 0.0.0.0:${PORT} adresinde aktif.`);
  console.log(`🔒 İzin verilen Frontend URL: ${FRONTEND_URL}`);
});
