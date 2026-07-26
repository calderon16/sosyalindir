"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ytdlp_js_1 = require("../services/ytdlp.js");
const router = (0, express_1.Router)();
/**
 * İzin verilen sosyal medya alan adları ve platform tespiti
 * String içerme kontrolü ile URL malformed hatalarını engeller.
 */
function validateAndDetectPlatform(urlStr) {
    if (!urlStr || typeof urlStr !== "string") {
        return { isValid: false, platform: "unknown" };
    }
    const lowerUrl = urlStr.toLowerCase().trim();
    // Instagram
    if (lowerUrl.includes("instagram.com")) {
        return { isValid: true, platform: "instagram" };
    }
    // TikTok
    if (lowerUrl.includes("tiktok.com")) {
        return { isValid: true, platform: "tiktok" };
    }
    // YouTube Shorts
    if (lowerUrl.includes("youtube.com/shorts") || lowerUrl.includes("youtu.be")) {
        return { isValid: true, platform: "youtube" };
    }
    // Facebook Reels & Medya
    if (lowerUrl.includes("facebook.com") || lowerUrl.includes("fb.watch") || lowerUrl.includes("fb.com")) {
        return { isValid: true, platform: "facebook" };
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
            error: "Desteklenmeyen platform. Yalnızca Instagram, TikTok, YouTube Shorts ve Facebook Reels bağlantıları kabul edilir.",
        });
        return;
    }
    try {
        const result = await (0, ytdlp_js_1.resolveVideoWithYtDlp)(cleanUrl, platform);
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
