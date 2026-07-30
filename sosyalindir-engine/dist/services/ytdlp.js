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
const https_1 = __importDefault(require("https"));
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
class Mutex {
    queue = [];
    locked = false;
    async acquire() {
        return new Promise(resolve => {
            if (!this.locked) {
                this.locked = true;
                resolve(this.release.bind(this));
            }
            else {
                this.queue.push(() => resolve(this.release.bind(this)));
            }
        });
    }
    release() {
        if (this.queue.length > 0) {
            const next = this.queue.shift();
            if (next)
                next();
        }
        else {
            this.locked = false;
        }
    }
}
const transcodeMutex = new Mutex();
// Geçici birleştirilmiş/indirilmiş dosyaların saklanacağı dizin
const TEMP_DIR = path_1.default.join(os_1.default.tmpdir(), "sosyalindir_temp_media");
if (!fs_1.default.existsSync(TEMP_DIR)) {
    fs_1.default.mkdirSync(TEMP_DIR, { recursive: true });
}
const COOKIES_PATH = path_1.default.join(TEMP_DIR, "cookies.txt");
const FB_COOKIES_PATH = path_1.default.join(TEMP_DIR, "fb_cookies.txt");
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
 * Otomatik Instagram Misafir Çerezi (Guest Session) Oluşturucu.
 * Kullanıcı müdahalesi gerektirmeden Instagram sunucularından dinamik misafir çerezlerini çeker.
 */
async function ensureAutoGuestCookies() {
    if (process.env.INSTAGRAM_COOKIES)
        return; // Manuel çerez varsa dokunma
    try {
        const setCookies = await new Promise((resolve) => {
            const req = https_1.default.get("https://www.instagram.com/", {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9"
                },
                timeout: 8000
            }, (res) => {
                resolve(res.headers["set-cookie"] || []);
            });
            req.on("error", () => resolve([]));
        });
        if (setCookies.length > 0) {
            const cookieLines = [
                "# Netscape HTTP Cookie File",
                "# http://curl.haxx.se/rfc/cookie_spec.html",
                "# Auto-generated guest cookies",
                ""
            ];
            for (const cookieHeader of setCookies) {
                const parts = cookieHeader.split(";")[0].split("=");
                if (parts.length >= 2) {
                    const name = parts[0].trim();
                    const value = parts.slice(1).join("=").trim();
                    if (name && value) {
                        cookieLines.push(`.instagram.com\tTRUE\t/\tFALSE\t${Math.floor(Date.now() / 1000) + 864000}\t${name}\t${value}`);
                    }
                }
            }
            fs_1.default.writeFileSync(COOKIES_PATH, cookieLines.join("\n"), "utf-8");
            console.log(`[ytdlp service] Otomatik Instagram misafir çerezleri yenilendi (${setCookies.length} adet).`);
        }
    }
    catch {
        // Otomatik çerez alma hatasını yut
    }
}
/**
 * Otomatik Facebook Misafir Çerezi (Guest Session) Oluşturucu.
 * Facebook'un genel sayfasına anonim bir istek atarak datr/sb/fr çerezlerini yakalar ve
 * yt-dlp'nin kullanabileceği Netscape formatında fb_cookies.txt dosyasına yazar.
 * Bu mekanizma, Railway'in paylaşımlı IP'sinin Meta engelini kısmen bypass eder.
 */
async function ensureFacebookGuestCookies(forceRefresh = false) {
    if (process.env.FACEBOOK_COOKIES)
        return; // Manuel çerez varsa dokunma
    // Daha önce çekilmiş çerez dosyası varsa ve zorla yenileme istenmiyorsa kullan
    if (!forceRefresh && fs_1.default.existsSync(FB_COOKIES_PATH)) {
        const age = Date.now() - fs_1.default.statSync(FB_COOKIES_PATH).mtimeMs;
        if (age < 30 * 60 * 1000)
            return; // 30 dakikadan yeni ise yeniden çekme
    }
    try {
        const setCookies = await new Promise((resolve) => {
            const req = https_1.default.get("https://www.facebook.com/", {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Sec-Fetch-Site": "none",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-User": "?1",
                    "Sec-Fetch-Dest": "document",
                    "Upgrade-Insecure-Requests": "1"
                },
                timeout: 10000
            }, (res) => {
                resolve(res.headers["set-cookie"] || []);
            });
            req.on("error", () => resolve([]));
            req.on("timeout", () => { req.destroy(); resolve([]); });
        });
        if (setCookies.length > 0) {
            const cookieLines = [
                "# Netscape HTTP Cookie File",
                "# http://curl.haxx.se/rfc/cookie_spec.html",
                "# Auto-generated Facebook guest cookies",
                ""
            ];
            for (const cookieHeader of setCookies) {
                const parts = cookieHeader.split(";")[0].split("=");
                if (parts.length >= 2) {
                    const name = parts[0].trim();
                    const value = parts.slice(1).join("=").trim();
                    if (name && value) {
                        // Facebook için hem .facebook.com hem facebook.com alt domain formatı
                        cookieLines.push(`.facebook.com\tTRUE\t/\tFALSE\t${Math.floor(Date.now() / 1000) + 864000}\t${name}\t${value}`);
                    }
                }
            }
            fs_1.default.writeFileSync(FB_COOKIES_PATH, cookieLines.join("\n"), "utf-8");
            console.log(`[ytdlp service] Otomatik Facebook misafir çerezleri yenilendi (${setCookies.length} adet).`);
        }
        else {
            console.log(`[ytdlp service] Facebook'tan çerez alınamadı (0 set-cookie başlığı).`);
        }
    }
    catch (e) {
        console.log(`[ytdlp service] Facebook otomatik çerez alma hatası: ${e}`);
    }
}
/**
 * Gerekli durumlarda ortama eklenen proxy veya çerez parametrelerini hazırlar
 */
function buildYtdlpExtraArgs(platform) {
    const extraArgs = [];
    // Proxy desteği (Railway veya yerel ortam değişkeninden okur)
    const proxyUrl = process.env.PROXY_URL || process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
    if (proxyUrl) {
        extraArgs.push("--proxy", proxyUrl);
    }
    if (platform === "facebook") {
        // Facebook: Manuel FACEBOOK_COOKIES env değişkeni varsa kullan, yoksa otomatik çekilen fb_cookies.txt
        if (process.env.FACEBOOK_COOKIES) {
            const fbEnv = process.env.FACEBOOK_COOKIES.trim();
            if (fbEnv.startsWith("# Netscape HTTP Cookie File") || fbEnv.startsWith(".facebook.com")) {
                fs_1.default.writeFileSync(FB_COOKIES_PATH, fbEnv, "utf-8");
            }
            else {
                try {
                    const content = Buffer.from(fbEnv, "base64").toString("utf-8");
                    fs_1.default.writeFileSync(FB_COOKIES_PATH, content, "utf-8");
                }
                catch {
                    fs_1.default.writeFileSync(FB_COOKIES_PATH, fbEnv, "utf-8");
                }
            }
        }
        if (fs_1.default.existsSync(FB_COOKIES_PATH)) {
            extraArgs.push("--cookies", FB_COOKIES_PATH);
        }
        // Facebook'a özel başlıklar: bot tespitini azaltır
        extraArgs.push("--add-header", "Sec-Fetch-Mode: navigate", "--add-header", "Sec-Fetch-Site: none", "--add-header", "Accept-Language: en-US,en;q=0.9");
    }
    else {
        // Instagram ve diğerleri: Mevcut INSTAGRAM_COOKIES veya otomatik çekilen cookies.txt
        if (process.env.INSTAGRAM_COOKIES) {
            const igEnv = process.env.INSTAGRAM_COOKIES.trim();
            if (igEnv.startsWith("# Netscape HTTP Cookie File") || igEnv.startsWith(".instagram.com")) {
                fs_1.default.writeFileSync(COOKIES_PATH, igEnv, "utf-8");
            }
            else {
                try {
                    const content = Buffer.from(igEnv, "base64").toString("utf-8");
                    fs_1.default.writeFileSync(COOKIES_PATH, content, "utf-8");
                }
                catch {
                    fs_1.default.writeFileSync(COOKIES_PATH, igEnv, "utf-8");
                }
            }
        }
        if (fs_1.default.existsSync(COOKIES_PATH)) {
            extraArgs.push("--cookies", COOKIES_PATH);
        }
        // Meta (Instagram) bot/IP kısıtlamalarını aşan özel başlıklar
        if (platform === "instagram") {
            extraArgs.push("--add-header", "X-IG-App-ID: 936619743392459", "--add-header", "Sec-Fetch-Mode: navigate", "--add-header", "Accept-Language: en-US,en;q=0.9");
        }
    }
    return extraArgs;
}
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
 * FFmpeg transcode komutunu çalıştırır (Video süresine göre dinamik zaman aşımı ve CRF 26 ile).
 * Progress spam'ını engellemek için -loglevel error ve -nostats kullanılır.
 */
async function runFfmpegTranscode(inputPath, outputPath, durationSec) {
    const duration = durationSec && durationSec > 0 ? durationSec : 30;
    // Dinamik timeout: Video süresi * 3.5 saniye (Minimum 60sn, Maksimum 240sn / 4 dk)
    const timeoutMs = Math.min(240000, Math.max(60000, Math.ceil(duration * 3500)));
    console.log(`[ffmpeg] Transcode için kuyruğa girildi (Sıra bekleniyor)...: ${inputPath}`);
    const releaseLock = await transcodeMutex.acquire();
    try {
        console.log(`[ffmpeg] Transcode başlatıldı (Video Süresi: ${duration}s, Timeout: ${timeoutMs / 1000}s, CRF: 28): ${inputPath} -> ${outputPath}`);
        await execFileAsync("ffmpeg", [
            "-y",
            "-loglevel", "error",
            "-nostats",
            "-i", inputPath,
            "-map", "0:v:0", // Açık stream seçimi: ilk video akışı
            "-map", "0:a:0?", // Açık stream seçimi: ilk ses akışı (varsa)
            "-c:v", "libx264",
            "-preset", "ultrafast",
            "-crf", "28", // Hızlı ve hafif kodlama (düşük CPU & bellek kullanımı)
            "-pix_fmt", "yuv420p", // Mobil uyumluluk (Android/iOS native player)
            "-c:a", "aac", // Ses codec'ini de AAC'ye dönüştür (mobil uyum)
            "-b:a", "128k",
            "-movflags", "+faststart", // moov atom'u dosya başına taşı (mobil streaming)
            outputPath
        ], {
            timeout: timeoutMs,
            maxBuffer: 50 * 1024 * 1024, // 50MB tampon bellek
        });
        console.log(`[ffmpeg] Transcode başarıyla (exitCode 0) tamamlandı.`);
    }
    catch (err) {
        console.error(`[ffmpeg process exit info]: code=${err.code}, signal=${err.signal}, killed=${err.killed}, stderr=${err.stderr || err.message}`);
        if (err.killed || err.signal === "SIGTERM" || err.signal === "SIGKILL" || err.code === "ETIMEDOUT") {
            throw new Error("Video işlenirken zaman aşımına uğradı, farklı bir video deneyin veya birkaç dakika sonra tekrar deneyin.");
        }
        const cleanErr = extractCleanErrorMessage(err);
        console.error(`[ffmpeg] Transcode başarısız oldu: ${cleanErr}`);
        throw new Error(`FFmpeg video dönüştürme hatası: ${cleanErr}`);
    }
    finally {
        releaseLock();
    }
}
/**
 * Facebook URL'sini mobil versiyona çevirir (m.facebook.com).
 * Mobil sayfa, masaüstü sayfadan farklı (daha basit) bir yapı kullanır ve
 * yt-dlp'nin parse etmesi genellikle daha kolaydır.
 */
function toMobileFacebookUrl(url) {
    return url.replace(/https?:\/\/(www\.)?facebook\.com/, "https://m.facebook.com");
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
        // Platform'a özel otomatik misafir çerezi garantile
        if (platform === "instagram") {
            await ensureAutoGuestCookies();
        }
        else if (platform === "facebook") {
            await ensureFacebookGuestCookies();
        }
        let extraArgs = buildYtdlpExtraArgs(platform);
        const userAgent = platform === "instagram"
            ? "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
            : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
        const referer = platform === "tiktok"
            ? "https://www.tiktok.com/"
            : platform === "instagram"
                ? "https://www.instagram.com/"
                : "https://www.facebook.com/";
        let stdoutData = "";
        try {
            const ytdlpArgs = [
                "-j",
                "--no-warnings",
                "--no-playlist",
                "--skip-download",
                "--user-agent", userAgent,
                "--referer", referer,
                ...extraArgs,
            ];
            // Facebook için özel argümanlar
            // if (platform === "facebook") {
            //   ytdlpArgs.push("--impersonate", "chrome");
            // }
            ytdlpArgs.push(videoUrl);
            const { stdout } = await execFileAsync("yt-dlp", ytdlpArgs, {
                maxBuffer: 50 * 1024 * 1024,
                timeout: 30000,
            });
            stdoutData = stdout;
        }
        catch (firstErr) {
            const firstErrMsg = extractCleanErrorMessage(firstErr).toLowerCase();
            // Instagram boş yanıt verirse otomatik misafir çerezlerini yenile ve 1 kez tekrar dene
            if (platform === "instagram" && firstErrMsg.includes("empty media response")) {
                console.log(`[ytdlp service] Instagram boş yanıt verdi, otomatik misafir çerezi yenilenip tekrar deneniyor...`);
                await ensureAutoGuestCookies();
                extraArgs = buildYtdlpExtraArgs(platform);
                const { stdout } = await execFileAsync("yt-dlp", [
                    "-j",
                    "--no-warnings",
                    "--no-playlist",
                    "--skip-download",
                    "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                    "--referer", "https://www.instagram.com/",
                    ...extraArgs,
                    videoUrl,
                ], {
                    maxBuffer: 50 * 1024 * 1024,
                    timeout: 30000,
                });
                stdoutData = stdout;
            }
            else if (platform === "facebook" && (firstErrMsg.includes("cannot parse data") || firstErrMsg.includes("unsupported url") || firstErrMsg.includes("parse"))) {
                // Facebook parse hatası: Mobil URL + çerezleri zorla yenile + impersonate ile tekrar dene
                console.log(`[ytdlp service] Facebook parse hatası, mobil URL + çerez yenileme ile tekrar deneniyor...`);
                await ensureFacebookGuestCookies(true); // forceRefresh = true
                extraArgs = buildYtdlpExtraArgs(platform);
                const mobileUrl = toMobileFacebookUrl(videoUrl);
                console.log(`[ytdlp service] Mobil Facebook URL deneniyor: ${mobileUrl}`);
                const { stdout } = await execFileAsync("yt-dlp", [
                    "-j",
                    "--no-warnings",
                    "--no-playlist",
                    "--skip-download",
                    "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                    "--referer", "https://www.facebook.com/",
                    ...extraArgs,
                    mobileUrl,
                ], {
                    maxBuffer: 50 * 1024 * 1024,
                    timeout: 35000,
                });
                stdoutData = stdout;
            }
            else {
                throw firstErr;
            }
        }
        if (!stdoutData || !stdoutData.trim()) {
            throw new Error("yt-dlp boş yanıt döndürdü.");
        }
        const data = JSON.parse(stdoutData.trim());
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
            "-f", "bestvideo[vcodec^=avc1]+bestaudio/bestvideo[vcodec^=h264]+bestaudio/bestvideo[vcodec!=av1]+bestaudio/best",
            "--format-sort", "vcodec:h264,res,ext",
            "--merge-output-format", "mp4",
            "--postprocessor-args", "ffmpeg:-movflags +faststart",
            "--no-warnings",
            "--no-playlist",
            "--user-agent", platform === "instagram" ? "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "--referer", isTikTok ? "https://www.tiktok.com/" : "https://www.google.com/",
            ...extraArgs,
            "-o", outputPath,
            videoUrl,
        ], {
            maxBuffer: 50 * 1024 * 1024,
            timeout: 120000,
        });
        // İndirilen ham dosyanın bütünlüğünü kontrol et
        if (!fs_1.default.existsSync(outputPath) || fs_1.default.statSync(outputPath).size < 1000) {
            throw new Error("Video dosyası eksik veya kaynak sunucu kısıtlaması nedeniyle indirilemedi.");
        }
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
            await runFfmpegTranscode(outputPath, transcodePath, duration);
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
        const lowerDetail = cleanDetail.toLowerCase();
        if (lowerDetail.includes("uri malformed") || lowerDetail.includes("urierror")) {
            throw new Error("Geçersiz bağlantı formatı, lütfen linki kontrol edip tekrar yapıştırın.");
        }
        if (lowerDetail.includes("isn't available to everyone") ||
            lowerDetail.includes("empty media response") ||
            lowerDetail.includes("ip address is blocked") ||
            lowerDetail.includes("login") ||
            lowerDetail.includes("rate limit")) {
            throw new Error("Sosyal medya sunucusu bu içerik için geçici erişim kısıtlaması uyguluyor (Meta IP Kısıtlaması). Lütfen birkaç dakika sonra tekrar deneyiniz.");
        }
        if (lowerDetail.includes("private video")) {
            throw new Error("Bu video gizli ya da erişime kapalı.");
        }
        if (lowerDetail.includes("video unavailable") || lowerDetail.includes("not found")) {
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
