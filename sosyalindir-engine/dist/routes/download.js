"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
/**
 * GET /download?formatUrl=...&filename=...
 * Verilen direkt medya URL'ini istemciye sunucuda saklamadan doğrudan stream (pipe) eder.
 */
router.get("/download", async (req, res) => {
    const formatUrl = (req.query.formatUrl || req.query.url);
    const filename = req.query.filename || "sosyalindir-video.mp4";
    if (!formatUrl || typeof formatUrl !== "string") {
        res.status(400).json({ error: "Geçerli bir 'formatUrl' parametresi gereklidir." });
        return;
    }
    try {
        // Güvenli dosya adı sanitization
        const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");
        // Medya sunucusundan stream olarak veriyi al
        const response = await (0, axios_1.default)({
            method: "GET",
            url: formatUrl,
            responseType: "stream",
            timeout: 30000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
        });
        // İndirme header'larını ayarla
        const contentType = response.headers["content-type"];
        if (contentType) {
            res.setHeader("Content-Type", String(contentType));
        }
        else {
            res.setHeader("Content-Type", "video/mp4");
        }
        res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
        const contentLength = response.headers["content-length"];
        if (contentLength) {
            res.setHeader("Content-Length", String(contentLength));
        }
        // Doğrudan yanıt nesnesine aktar (pipe)
        response.data.pipe(res);
    }
    catch (err) {
        const error = err;
        if (!res.headersSent) {
            res.status(502).json({
                error: `Medya dosyası indirilemedi: ${error.message}`,
            });
        }
    }
});
exports.default = router;
