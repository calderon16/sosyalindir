"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ytdlp_js_1 = require("../services/ytdlp.js");
const saverApiService_js_1 = require("../services/saverApiService.js");
const router = (0, express_1.Router)();
// SSRF Korumalı — İzin Verilen Tam Alan Adları ve Alt Alan Adları Listesi
const ALLOWED_PLATFORM_DOMAINS = {
    instagram: ["instagram.com", "instagr.am"],
    tiktok: ["tiktok.com", "vmtiktok.com"],
    youtube: ["youtube.com", "youtu.be"],
    facebook: ["facebook.com", "fb.watch", "fb.com", "fb.gg"],
};
/**
 * SSRF Korumalı Alan Adı Doğrulaması ve Platform Tespiti.
 * Substring veya wildcard açıklarına izin vermeyen sıkı URL hostname kontrolü yapar.
 */
function validateAndDetectPlatform(urlStr) {
    if (!urlStr || typeof urlStr !== "string") {
        return { isValid: false, platform: "unknown" };
    }
    let parsed;
    try {
        parsed = new URL(urlStr.trim());
        // Sadece http ve https protokollerine izin ver (file://, gopher://, internal IP engeli)
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            return { isValid: false, platform: "unknown" };
        }
    }
    catch {
        return { isValid: false, platform: "unknown" };
    }
    const hostname = parsed.hostname.toLowerCase();
    for (const [platform, domains] of Object.entries(ALLOWED_PLATFORM_DOMAINS)) {
        for (const domain of domains) {
            if (hostname === domain || hostname.endsWith("." + domain)) {
                // YouTube durumunda Shorts veya youtu.be kontrolü
                if (platform === "youtube") {
                    // SaverAPI entegrasyonu sonrası: tüm YouTube URL'leri (Shorts, normal video, youtu.be) desteklenir
                    return { isValid: true, platform: "youtube" };
                }
                return { isValid: true, platform };
            }
        }
    }
    return { isValid: false, platform: "unknown" };
}
/**
 * GET /resolve?url=...
 * Video linkinden metadata ve direkt indirme URL'ini çözer.
 */
router.get("/", async (req, res) => {
    const urlParam = req.query.url;
    if (!urlParam || typeof urlParam !== "string") {
        res.status(400).json({ error: "Geçerli bir 'url' sorgu parametresi gereklidir." });
        return;
    }
    const cleanUrl = urlParam.trim();
    const { isValid, platform } = validateAndDetectPlatform(cleanUrl);
    if (!isValid) {
        res.status(400).json({
            error: "Desteklenmeyen platform. Yalnızca Instagram, TikTok, YouTube ve Facebook Reels bağlantıları kabul edilir.",
        });
        return;
    }
    try {
        let result;
        if (platform === "youtube") {
            // YouTube: SaverAPI (saverapi.net) üzerinden çözümlenir
            result = await (0, saverApiService_js_1.resolveYouTubeWithSaverApi)(cleanUrl);
        }
        else {
            // Instagram, TikTok, Facebook: yt-dlp motoru — değişmeden devam eder
            result = await (0, ytdlp_js_1.resolveVideoWithYtDlp)(cleanUrl, platform);
        }
        res.json({
            status: "success",
            data: result,
        });
    }
    catch (err) {
        const error = err;
        const errorMsg = error.message || "Video bilgileri çözümlenemedi.";
        if (errorMsg.includes("URI malformed") || errorMsg.includes("URIError")) {
            res.status(400).json({
                error: "Geçersiz bağlantı formatı, lütfen linki kontrol edip tekrar yapıştırın.",
            });
            return;
        }
        res.status(422).json({
            error: errorMsg,
        });
    }
});
exports.default = router;
