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
 * FFmpeg / yt-dlp stderr çıktısından banner ve progress metinlerini temizler,
 * GERÇEK hata mesajını (son anlamlı satırı) ayıklar.
 */
function extractCleanErrorMessage(err) {
    const errorObj = err;
    const rawStderr = errorObj.stderr || errorObj.message || "";
    if (!rawStderr.trim()) {
        return "Bilinmeyen medya işleme hatası";
    }
    // Stderr satırlarını böl, FFmpeg banner'larını ve progress (frame=, speed=) satırlarını filtrele
    const lines = rawStderr
        .split("\n")
        .map(line => line.trim())
        .filter(line => {
        if (!line)
            return false;
        const lower = line.toLowerCase();
        // FFmpeg & System Banner Filtresi
        if (lower.startsWith("ffmpeg version") || lower.startsWith("built with gcc") || lower.startsWith("configuration:"))
            return false;
        if (lower.startsWith("libavutil") || lower.startsWith("libavcodec") || lower.startsWith("libavformat"))
            return false;
        if (lower.startsWith("libavdevice") || lower.startsWith("libavfilter") || lower.startsWith("libswscale"))
            return false;
        if (lower.startsWith("libswresample") || lower.startsWith("libpostproc") || lower.startsWith("copyright (c)"))
            return false;
        // FFmpeg Progress & Metadata Spam Filtresi
        if (lower.includes("frame=") || lower.includes("fps=") || lower.includes("size=") || lower.includes("bitrate=") || lower.includes("speed="))
            return false;
        if (lower.includes("vendor_id") || lower.startsWith("stream #") || lower.startsWith("metadata:") || lower.startsWith("encoder:") || lower.startsWith("duration:"))
            return false;
        return true;
    });
    if (lines.length > 0) {
        // Son 2 anlamlı satırı birleştir (gerçek hata en sondadır)
        return lines.slice(-2).join(" | ");
    }
    if (errorObj.signal || errorObj.code === "ETIMEDOUT") {
        return "İşlem zaman aşımına veya sunucu kaynak sınırına uğradı.";
    }
    return "Bilinmeyen medya dönüştürme hatası";
}
/**
 * ffprobe kullanarak video dosyasının video codec'ini detaylı ve güvenli tespit eder
 */
async function checkVideoCodec(filePath) {
    try {
        const { stdout } = await execFileAsync("ffprobe", [
            "-v", "error",
            "-select_streams", "v:0",
            "-show_entries", "stream=codec_name",
            "-of", "json",
            filePath
        ], { maxBuffer: 10 * 1024 * 1024, timeout: 15000 });
        const parsed = JSON.parse(stdout);
        return parsed?.streams?.[0]?.codec_name?.toLowerCase() || "";
    }
    catch {
        return "unknown";
    }
}
/**
 * FFmpeg transcode komutunu çalıştırır.
 * Progress spam'ını engellemek için -loglevel error ve -nostats kullanılır.
 * Yüksek maxBuffer (50MB) ve timeout (120sn) ayarlanmıştır.
 */
async function runFfmpegTranscode(inputPath, outputPath) {
    console.log(`[ffmpeg] Transcode başlatıldı: ${inputPath} -> ${outputPath}`);
    try {
        await execFileAsync("ffmpeg", [
            "-y",
            "-loglevel", "error",
            "-nostats",
            "-i", inputPath,
            "-map", "0:v:0", // Açık stream seçimi: ilk video akışı
            "-map", "0:a:0?", // Açık stream seçimi: ilk ses akışı (varsa)
            "-c:v", "libx264",
            "-preset", "ultrafast",
            "-crf", "22",
            "-pix_fmt", "yuv420p", // Mobil uyumluluk (Android/iOS native player)
            "-c:a", "aac", // Ses codec'ini de AAC'ye dönüştür (mobil uyum)
            "-b:a", "128k",
            "-movflags", "+faststart", // moov atom'u dosya başına taşı (mobil streaming)
            outputPath
        ], {
            timeout: 120000, // 2 dakika zaman aşımı
            maxBuffer: 50 * 1024 * 1024, // 50MB tampon bellek
        });
        console.log(`[ffmpeg] Transcode başarıyla (exitCode 0) tamamlandı.`);
    }
    catch (err) {
        console.error(`[ffmpeg process exit info]: code=${err.code}, signal=${err.signal}, killed=${err.killed}, stderr=${err.stderr || err.message}`);
        if (err.killed || err.signal === "SIGTERM" || err.signal === "SIGKILL" || err.code === "ETIMEDOUT") {
            const cleanDetail = extractCleanErrorMessage(err);
            throw new Error(`Video dönüştürme zaman aşıldı/kesildi (${err.signal || err.code}): ${cleanDetail}`);
        }
        const cleanErr = extractCleanErrorMessage(err);
        console.error(`[ffmpeg] Transcode başarısız oldu: ${cleanErr}`);
        throw new Error(`FFmpeg video dönüştürme hatası: ${cleanErr}`);
    }
}
/**
 * yt-dlp binary'sini child_process ile çağırarak video metadatasını ve sesli formatları çözer.
 * H.264 (AVC1) codec'lerini önceliklendirir, HEVC/H.265 durumlarında H.264'e transcode eder.
 *
 * @param videoUrl Çözümlenecek sosyal medya bağlantısı
 * @param platform Platform kimliği
 */
async function resolveVideoWithYtDlp(videoUrl, platform) {
    try {
        const startTime = Date.now();
        console.log(`[ytdlp service] Resolve başlatılıyor (${platform}): ${videoUrl}`);
        const { stdout } = await execFileAsync("yt-dlp", [
            "-j",
            "--no-warnings",
            "--no-playlist",
            "--skip-download",
            "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "--referer", platform === "tiktok" ? "https://www.tiktok.com/" : platform === "instagram" ? "https://www.instagram.com/" : "https://www.facebook.com/",
            videoUrl,
        ], {
            maxBuffer: 50 * 1024 * 1024,
            timeout: 30000,
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
        const fileId = `${id}_${Date.now()}`;
        const outputFilename = `${fileId}.mp4`;
        const outputPath = path_1.default.join(TEMP_DIR, outputFilename);
        const isTikTok = platform === "tiktok" || videoUrl.includes("tiktok.com");
        console.log(`[ytdlp service] İndirme (stream copy) başlatılıyor: ${outputPath}`);
        // H.264 (avc1/h264) formatlarını öncelikli indir
        await execFileAsync("yt-dlp", [
            "-f", "bestvideo[vcodec*='avc1']+bestaudio/bestvideo[vcodec*='h264']+bestaudio/bestvideo+bestaudio/best",
            "--merge-output-format", "mp4",
            "--postprocessor-args", "ffmpeg:-movflags +faststart",
            "--no-warnings",
            "--no-playlist",
            "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "--referer", isTikTok ? "https://www.tiktok.com/" : "https://www.google.com/",
            "-o", outputPath,
            videoUrl,
        ], {
            maxBuffer: 50 * 1024 * 1024,
            timeout: 120000,
        });
        // İndirilen dosyanın codec'ini ffprobe ile doğrula
        const detectedCodec = await checkVideoCodec(outputPath);
        console.log(`[ytdlp service] ffprobe ile tespit edilen video codec: '${detectedCodec}'`);
        // H.264 (avc1/h264) uyumlu mu? Değilse (HEVC, AV1, VP9 vb.) transcode et
        const isH264 = detectedCodec.includes("h264") || detectedCodec.includes("avc");
        const needsTranscode = !isH264 && detectedCodec !== "" && detectedCodec !== "unknown";
        if (needsTranscode) {
            console.log(`[ytdlp service] Mobil-uyumsuz codec (${detectedCodec}) tespit edildi! H.264 (libx264) transcoding BAŞLATILDI...`);
            const transcodePath = path_1.default.join(TEMP_DIR, `${fileId}_h264.mp4`);
            const transcodeStart = Date.now();
            await runFfmpegTranscode(outputPath, transcodePath);
            const transcodeDuration = Date.now() - transcodeStart;
            console.log(`[ytdlp service] H.264 transcode BAŞARIYLA tamamlandı (Süre: ${transcodeDuration}ms)`);
            if (fs_1.default.existsSync(outputPath)) {
                fs_1.default.unlinkSync(outputPath);
            }
            fs_1.default.renameSync(transcodePath, outputPath);
        }
        else {
            console.log(`[ytdlp service] Video zaten H.264/AVC (${detectedCodec}) uyumlu, ffmpeg transcode adımı ATLANDI.`);
        }
        const elapsed = Date.now() - startTime;
        console.log(`[ytdlp service] Medya hazırlığı tamamlandı (Toplam Süre: ${elapsed}ms): ${outputPath}`);
        const stats = fs_1.default.existsSync(outputPath) ? fs_1.default.statSync(outputPath) : null;
        const safeTitle = (title || "video").substring(0, 30).replace(/[^a-zA-Z0-9_-]/g, "_");
        const downloadPath = `/download?fileId=${fileId}&filename=${encodeURIComponent(safeTitle)}.mp4`;
        const localFormat = {
            formatId: "merged_best",
            ext: "mp4",
            resolution: "1080p HD",
            url: downloadPath,
            filesize: stats?.size,
            isWatermarkless: true,
            hasAudio: true,
            vcodec: needsTranscode ? "h264_transcoded" : detectedCodec,
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
    catch (err) {
        const cleanDetail = extractCleanErrorMessage(err);
        if (cleanDetail.includes("URI malformed") || cleanDetail.includes("URIError")) {
            throw new Error("Geçersiz bağlantı formatı, lütfen linki kontrol edip tekrar yapıştırın.");
        }
        if (cleanDetail.includes("Private video") || cleanDetail.includes("login")) {
            throw new Error("Bu video gizli ya da erişime kapalı.");
        }
        if (cleanDetail.includes("Video unavailable") || cleanDetail.includes("Not Found")) {
            throw new Error("Video bulunamadı veya silinmiş olabilir.");
        }
        throw new Error(`Video çözümlenemedi: ${cleanDetail}`);
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
