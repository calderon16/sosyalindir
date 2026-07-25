"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const rateLimit_js_1 = require("./middleware/rateLimit.js");
const resolve_js_1 = __importDefault(require("./routes/resolve.js"));
const download_js_1 = __importDefault(require("./routes/download.js"));
// Ortam değişkenlerini yükle
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || "4000", 10);
const HOST = "0.0.0.0";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
// JSON ve URL encoded gövde ayrıştırıcılar
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// CORS Konfigürasyonu (FRONTEND_URL, Vercel domainleri ve sunucu isteklerine izin ver)
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin ||
            origin === FRONTEND_URL ||
            origin.includes("vercel.app") ||
            origin.includes("localhost") ||
            process.env.NODE_ENV !== "production") {
            callback(null, true);
        }
        else {
            callback(new Error("CORS politikasınca engellendi."));
        }
    },
    credentials: true,
}));
// IP bazlı Rate Limiter middleware
app.use(rateLimit_js_1.limiter);
// Sağlık kontrolü (Health Check)
app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        service: "sosyalindir-engine",
        timestamp: new Date().toISOString(),
    });
});
// Endpoint'ler
app.use(resolve_js_1.default);
app.use(download_js_1.default);
// Bulunamayan Rotalar (404)
app.use((_req, res) => {
    res.status(404).json({ error: "Aranan endpoint bulunamadı." });
});
// Genel Hata Yakalama Middleware (500)
app.use((err, _req, res, _next) => {
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
