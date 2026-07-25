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

// CORS Konfigürasyonu (sosyalindirapp.com, Vercel domainleri ve localhost izinli)
const allowedOrigins = [
  FRONTEND_URL,
  "https://sosyalindirapp.com",
  "https://www.sosyalindirapp.com",
  "https://sosyalindir.vercel.app",
  "https://sosyalindir-tau.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.includes("sosyalindirapp.com") ||
        origin.includes("vercel.app") ||
        origin.includes("localhost") ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

// Genel Rate Limiter Middleware
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

// Route Tanımlamaları
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
    console.error("[Unhandled Error]:", err);
    res.status(500).json({
      error: "Sunucu içi beklenmeyen bir hata oluştu.",
      message: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 SosyalIndir Engine 0.0.0.0:${PORT} adresinde aktif.`);
  console.log(`🔒 İzin verilen Frontend URL: ${FRONTEND_URL}`);
});
