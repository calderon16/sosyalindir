"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ytdlp_js_1 = require("../services/ytdlp.js");
const router = (0, express_1.Router)();
/**
 * İzin verilen sosyal medya alan adları ve platform tespiti
 */
function validateAndDetectPlatform(urlStr) {
    try {
        const parsedUrl = new URL(urlStr);
        const host = parsedUrl.hostname.toLowerCase();
        const pathname = parsedUrl.pathname.toLowerCase();
        // Instagram
        if (host.includes("instagram.com")) {
            return { isValid: true, platform: "instagram" };
        }
        // TikTok
        if (host.includes("tiktok.com")) {
            return { isValid: true, platform: "tiktok" };
        }
        // YouTube Shorts
        if ((host.includes("youtube.com") && pathname.includes("/shorts")) || host.includes("youtu.be")) {
            return { isValid: true, platform: "youtube" };
        }
        // Facebook Reels
        if (host.includes("facebook.com") || host.includes("fb.watch")) {
            return { isValid: true, platform: "facebook" };
        }
        return { isValid: false, platform: "unknown" };
    }
    catch {
        return { isValid: false, platform: "unknown" };
    }
}
/**
 * GET /resolve?url=...
 * Video linkinden metadata ve direkt indirme URL'ini çözer.
 */
router.get("/resolve", async (req, res) => {
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
        res.status(422).json({
            error: error.message || "Video bilgileri çözümlenemedi.",
        });
    }
});
exports.default = router;
