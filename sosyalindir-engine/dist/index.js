"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const resolve_1 = __importDefault(require("./routes/resolve"));
const download_1 = __importDefault(require("./routes/download"));
const rateLimit_1 = require("./middleware/rateLimit");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "https://sosyalindirapp.com";
// Express güvenli arkadaki proxy ip algılamasını aktif et
app.set("trust proxy", 1);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// CORS Konfigürasyonu (sosyalindirapp.com, Vercel domainleri ve localhost izinli)
const allowedOrigins = [
    FRONTEND_URL,
    "https://sosyalindirapp.com",
    "https://www.sosyalindirapp.com",
    "https://sosyalindir.vercel.app",
    "https://sosyalindir-tau.vercel.app",
    "http://localhost:3000",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin ||
            allowedOrigins.includes(origin) ||
            origin.includes("sosyalindirapp.com") ||
            origin.includes("vercel.app") ||
            origin.includes("localhost") ||
            process.env.NODE_ENV !== "production") {
            callback(null, true);
        }
        else {
            callback(null, true);
        }
    },
    credentials: true,
}));
// Genel Rate Limiter Middleware
app.use(rateLimit_1.limiter);
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
app.use("/resolve", resolve_1.default);
app.use("/download", download_1.default);
// Hata Yakalama Middleware'i
app.use((err, req, res, next) => {
    console.error("[Unhandled Error]:", err);
    res.status(500).json({
        error: "Sunucu içi beklenmeyen bir hata oluştu.",
        message: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});
app.listen(PORT, () => {
    console.log(`🚀 SosyalIndir Engine 0.0.0.0:${PORT} adresinde aktif.`);
    console.log(`🔒 İzin verilen Frontend URL: ${FRONTEND_URL}`);
});
