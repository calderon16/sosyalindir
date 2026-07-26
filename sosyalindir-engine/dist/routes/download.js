"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const ytdlp_js_1 = require("../services/ytdlp.js");
const rateLimit_js_1 = require("../middleware/rateLimit.js");
const router = (0, express_1.Router)();
/**
 * Hedef CDN URL'ine göre uygun Referer, User-Agent ve HTTP header'larını oluşturur
 */
function buildCdnHeaders(targetUrl) {
    const lowercaseUrl = targetUrl.toLowerCase();
    let userAgent = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";
    let referer = "https://www.google.com/";
    if (lowercaseUrl.includes("tiktokcdn.com") || lowercaseUrl.includes("tiktok.com")) {
        referer = "https://www.tiktok.com/";
        userAgent = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";
    }
    else if (lowercaseUrl.includes("cdninstagram.com") || lowercaseUrl.includes("fbcdn.net") || lowercaseUrl.includes("instagram.com")) {
        referer = "https://www.instagram.com/";
        userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
    }
    else if (lowercaseUrl.includes("facebook.com") || lowercaseUrl.includes("fb.watch")) {
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
router.get("/", rateLimit_js_1.downloadBandwidthLimiter, async (req, res) => {
    const fileId = req.query.fileId;
    const formatUrl = (req.query.formatUrl || req.query.url);
    const filename = req.query.filename || "sosyalindir-video.mp4";
    const resolvedTimestamp = req.query.t ? parseInt(req.query.t, 10) : 0;
    const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");
    if (resolvedTimestamp > 0) {
        const timeDiffSeconds = ((Date.now() - resolvedTimestamp) / 1000).toFixed(2);
        console.log(`[Download Proxy] /resolve ve /download arasındaki zaman farkı: ${timeDiffSeconds} saniye`);
    }
    // 1. Durum: Yerel birleştirilmiş (temp merged) dosya indirmesi
    if (fileId) {
        // Path Traversal Koruması: fileId sadece alfanumerik, alt çizgi ve tire içerebilir
        if (typeof fileId !== "string" || !/^[a-zA-Z0-9_-]+$/.test(fileId)) {
            res.status(400).json({ error: "Geçersiz dosya kimliği formatı." });
            return;
        }
        const tempPath = (0, ytdlp_js_1.getTempFilePath)(fileId);
        if (!tempPath) {
            res.status(444).json({ error: "İstenen medya süresi dolmuş veya bulunamadı." });
            return;
        }
        try {
            const stats = fs_1.default.statSync(tempPath);
            res.setHeader("Content-Type", "video/mp4");
            res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
            res.setHeader("Content-Length", String(stats.size));
            const stream = fs_1.default.createReadStream(tempPath);
            stream.pipe(res);
            return;
        }
        catch (err) {
            const error = err;
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
        const cdnResponse = await (0, axios_1.default)({
            method: "GET",
            url: formatUrl,
            headers,
            responseType: "stream",
            timeout: 30000,
            validateStatus: (status) => status >= 200 && status < 300,
        });
        const contentType = String(cdnResponse.headers["content-type"] || "video/mp4");
        const contentLength = cdnResponse.headers["content-length"] ? String(cdnResponse.headers["content-length"]) : undefined;
        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
        if (contentLength) {
            res.setHeader("Content-Length", contentLength);
        }
        cdnResponse.data.pipe(res);
    }
    catch (err) {
        console.error("[Download Proxy Error]:", err.message || err);
        if (!res.headersSent) {
            const status = err.response?.status || 500;
            let cdnResponseBody = "";
            if (err.response?.data) {
                try {
                    if (Buffer.isBuffer(err.response.data)) {
                        cdnResponseBody = err.response.data.toString("utf-8");
                    }
                    else if (typeof err.response.data === "string") {
                        cdnResponseBody = err.response.data;
                    }
                    else {
                        cdnResponseBody = JSON.stringify(err.response.data);
                    }
                }
                catch {
                    cdnResponseBody = "Yanıt okunamadı";
                }
            }
            console.error(`[CDN Error Detail]: HTTP ${status} - ${cdnResponseBody.substring(0, 300)}`);
            res.status(status).json({
                error: `Medya dosyası indirilemedi: ${err.message}`,
                status,
                cdnResponse: cdnResponseBody.substring(0, 500),
            });
        }
    }
});
exports.default = router;
