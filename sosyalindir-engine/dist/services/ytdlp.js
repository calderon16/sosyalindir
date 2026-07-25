"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveVideoWithYtDlp = resolveVideoWithYtDlp;
exports.getTempFilePath = getTempFilePath;
const child_process_1 = require("child_process");
const util_1 = require("util");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
// Geçici birleştirilmiş/indirilmiş dosyaların saklanacağı dizin
const TEMP_DIR = path_1.default.join(os_1.default.tmpdir(), "sosyalindir_temp_media");
if (!fs_1.default.existsSync(TEMP_DIR)) {
    fs_1.default.mkdirSync(TEMP_DIR, { recursive: true });
}
// 10 dakikadan eski geçici dosyaları otomatik temizle
setInterval(() => {
    try {
        const files = fs_1.default.readdirSync(TEMP_DIR);
        const now = Date.now();
        for (const file of files) {
            const filePath = path_1.default.join(TEMP_DIR, file);
            const stats = fs_1.default.statSync(filePath);
            if (now - stats.mtimeMs > 10 * 60 * 1000) {
                fs_1.default.unlinkSync(filePath);
            }
        }
    }
    catch {
        // Temizlik hatalarını yut
    }
}, 5 * 60 * 1000);
/**
 * yt-dlp binary'sini child_process ile çağırarak video metadatasını ve sesli formatları çözer.
 * TikTok veya CDN kilitli platformlar için yt-dlp ile doğrudan yerel indirme (stream copy) gerçekleştirir.
 *
 * @param videoUrl Çözümlenecek sosyal medya bağlantısı
 * @param platform Platform kimliği
 */
async function resolveVideoWithYtDlp(videoUrl, platform) {
    try {
        const startTime = Date.now();
        const { stdout } = await execFileAsync("yt-dlp", [
            "-j",
            "--no-warnings",
            "--no-playlist",
            "--skip-download",
            "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "--referer", platform === "tiktok" ? "https://www.tiktok.com/" : platform === "instagram" ? "https://www.instagram.com/" : "https://www.facebook.com/",
            videoUrl,
        ], {
            maxBuffer: 15 * 1024 * 1024,
            timeout: 25000,
        });
        if (!stdout || !stdout.trim()) {
            throw new Error("yt-dlp boş yanıt döndürdü.");
        }
        const data = JSON.parse(stdout.trim());
        // Temel metadata alanları
        const id = data.id || "unknown";
        const title = data.title || data.description || "Sosyal Medya Videosu";
        const author = data.uploader || data.channel || data.uploader_id || "Bilinmeyen Yayıncı";
        const thumbnail = data.thumbnail || (Array.isArray(data.thumbnails) && data.thumbnails.length > 0 ? data.thumbnails[data.thumbnails.length - 1].url : "");
        const duration = data.duration || 0;
        const rawFormats = Array.isArray(data.formats) ? data.formats : [];
        // Filtre: Yalnızca hem ses (acodec !== 'none') hem de görüntü (vcodec !== 'none') içeren "combined" formatlar
        const combinedFormats = rawFormats.filter((fmt) => {
            if (!fmt.url)
                return false;
            if (fmt.ext === "mhtml" || fmt.format_id?.includes("storyboard"))
                return false;
            const hasAudio = fmt.acodec && fmt.acodec !== "none";
            const hasVideo = fmt.vcodec && fmt.vcodec !== "none";
            return hasAudio && hasVideo;
        });
        // TikTok CDN linkleri IP kilitli/imzalı olduğundan doğrudan yt-dlp ile yerel indirme yapılır
        const isTikTok = platform === "tiktok" || videoUrl.includes("tiktok.com");
        if (combinedFormats.length > 0 && !isTikTok) {
            // Instagram / Facebook için hazır ses+görüntü birleşik formatlar
            const parsedFormats = [];
            for (const fmt of combinedFormats) {
                const isWatermarkless = fmt.format_note?.toLowerCase().includes("no watermark") ||
                    fmt.format_id?.toLowerCase().includes("nowatermark") ||
                    !fmt.format_note?.toLowerCase().includes("watermark");
                const resolution = fmt.resolution || (fmt.width && fmt.height ? `${fmt.width}x${fmt.height}` : "HD");
                parsedFormats.push({
                    formatId: fmt.format_id || "default",
                    ext: fmt.ext || "mp4",
                    resolution,
                    url: fmt.url,
                    filesize: fmt.filesize || fmt.filesize_approx,
                    isWatermarkless,
                    hasAudio: true,
                });
            }
            const bestCombined = parsedFormats[parsedFormats.length - 1];
            return {
                id,
                title,
                author,
                thumbnail,
                duration,
                platform,
                downloadUrl: bestCombined.url,
                formats: parsedFormats.slice(-5),
            };
        }
        else {
            // TikTok veya ayrı akışlı videolar -> yt-dlp ile sunucuda güvenli indirme (stream copy - sıfır kalite kaybı)
            console.log(`[ytdlp service] Sunucuda güvenli indirme (stream copy) başlatılıyor: ${videoUrl}`);
            const fileId = `${id}_${Date.now()}`;
            const outputFilename = `${fileId}.mp4`;
            const outputPath = path_1.default.join(TEMP_DIR, outputFilename);
            await execFileAsync("yt-dlp", [
                "-f", "bestvideo+bestaudio/best",
                "--merge-output-format", "mp4",
                "--postprocessor-args", "ffmpeg:-c copy",
                "--no-warnings",
                "--no-playlist",
                "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                "--referer", isTikTok ? "https://www.tiktok.com/" : "https://www.google.com/",
                "-o", outputPath,
                videoUrl,
            ], { timeout: 35000 });
            const elapsed = Date.now() - startTime;
            console.log(`[ytdlp service] Güvenli yerel indirme tamamlandı (${elapsed}ms): ${outputPath}`);
            const stats = fs_1.default.existsSync(outputPath) ? fs_1.default.statSync(outputPath) : null;
            const downloadPath = `/download?fileId=${fileId}&filename=${encodeURIComponent(title.substring(0, 30))}.mp4`;
            const localFormat = {
                formatId: "merged_best",
                ext: "mp4",
                resolution: "1080p HD",
                url: downloadPath,
                filesize: stats?.size,
                isWatermarkless: true,
                hasAudio: true,
            };
            return {
                id,
                title,
                author,
                thumbnail,
                duration,
                platform,
                downloadUrl: downloadPath,
                formats: [localFormat],
                fileId,
            };
        }
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
/**
 * Geçici olarak oluşturulmuş birleştirilmiş/indirilmiş dosya yolunu döndürür
 */
function getTempFilePath(fileId) {
    const safeFileId = path_1.default.basename(fileId);
    const filePath = path_1.default.join(TEMP_DIR, `${safeFileId}.mp4`);
    if (fs_1.default.existsSync(filePath)) {
        return filePath;
    }
    return null;
}
