"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveVideoWithYtDlp = resolveVideoWithYtDlp;
const child_process_1 = require("child_process");
const util_1 = require("util");
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
/**
 * yt-dlp binary'sini child_process ile çağırarak video metadatasını çözer.
 *
 * @param videoUrl Çözümlenecek sosyal medya bağlantısı
 */
async function resolveVideoWithYtDlp(videoUrl, platform) {
    try {
        // yt-dlp -j --no-warnings --no-playlist <URL>
        const { stdout } = await execFileAsync("yt-dlp", [
            "-j",
            "--no-warnings",
            "--no-playlist",
            "--skip-download",
            videoUrl,
        ], {
            maxBuffer: 15 * 1024 * 1024, // 15MB buffer
            timeout: 25000, // 25 saniye zaman aşımı
        });
        if (!stdout || !stdout.trim()) {
            throw new Error("yt-dlp boş yanıt döndürdü.");
        }
        const data = JSON.parse(stdout.trim());
        // Temel metadata alanlarını çıkar
        const id = data.id || "unknown";
        const title = data.title || data.description || "Sosyal Medya Videosu";
        const author = data.uploader || data.channel || data.uploader_id || "Bilinmeyen Yayıncı";
        const thumbnail = data.thumbnail || (Array.isArray(data.thumbnails) && data.thumbnails.length > 0 ? data.thumbnails[data.thumbnails.length - 1].url : "");
        const duration = data.duration || 0;
        const formats = [];
        // TikTok özel format / filigran kontrolü
        if (Array.isArray(data.formats) && data.formats.length > 0) {
            for (const fmt of data.formats) {
                if (!fmt.url)
                    continue;
                const isWatermarkless = fmt.format_note?.toLowerCase().includes("no watermark") ||
                    fmt.format_id?.toLowerCase().includes("nowatermark") ||
                    !fmt.format_note?.toLowerCase().includes("watermark");
                const resolution = fmt.resolution || (fmt.width && fmt.height ? `${fmt.width}x${fmt.height}` : "HD");
                formats.push({
                    formatId: fmt.format_id || "default",
                    ext: fmt.ext || "mp4",
                    resolution,
                    url: fmt.url,
                    filesize: fmt.filesize || fmt.filesize_approx,
                    isWatermarkless,
                });
            }
        }
        // Doğrudan ana indirme URL'ini tespit et (en yüksek kaliteli mp4 veya doğrudan url)
        const downloadUrl = data.url || (formats.length > 0 ? formats[formats.length - 1].url : "");
        if (!downloadUrl) {
            throw new Error("Video için indirme adresi çözülemedi.");
        }
        return {
            id,
            title,
            author,
            thumbnail,
            duration,
            platform,
            downloadUrl,
            formats: formats.slice(-5), // En alakalı 5 format seçeneği
        };
    }
    catch (err) {
        const error = err;
        const detail = error.stderr || error.message || "Bilinmeyen yt-dlp hatası";
        if (detail.includes("Private video") || detail.includes("login")) {
            throw new Error("Bu video gizli ya da erişime kapalı.");
        }
        if (detail.includes("Video unavailable") || detail.includes("Not Found")) {
            throw new Error("Video bulunamadı veya silinmiş olabilir.");
        }
        throw new Error(`Video çözümlenemedi: ${detail.split("\n")[0]}`);
    }
}
