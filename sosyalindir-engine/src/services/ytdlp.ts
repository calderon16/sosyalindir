import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import os from "os";
import https from "https";

const execFileAsync = promisify(execFile);

export interface VideoFormatOption {
  formatId: string;
  ext: string;
  resolution: string;
  url: string;
  filesize?: number;
  isWatermarkless?: boolean;
  hasAudio?: boolean;
  vcodec?: string;
}

export interface ResolvedVideoInfo {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  duration?: number;
  platform: string;
  downloadUrl: string;
  formats: VideoFormatOption[];
  fileId?: string;
}

// Geçici birleştirilmiş/indirilmiş dosyaların saklanacağı dizin
const TEMP_DIR = path.join(os.tmpdir(), "sosyalindir_temp_media");
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const COOKIES_PATH = path.join(TEMP_DIR, "cookies.txt");

// 10 dakikadan eski geçici dosyaları otomatik temizle
setInterval(() => {
  try {
    const files = fs.readdirSync(TEMP_DIR);
    const now = Date.now();
    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);
      const stats = fs.statSync(filePath);
      if (now - stats.mtimeMs > 10 * 60 * 1000) {
        fs.unlinkSync(filePath);
      }
    }
  } catch {
    // Temizlik hatalarını yut
  }
}, 5 * 60 * 1000);

/**
 * Otomatik Instagram Misafir Çerezi (Guest Session) Oluşturucu.
 * Kullanıcı müdahalesi gerektirmeden Instagram sunucularından dinamik misafir çerezlerini çeker.
 */
async function ensureAutoGuestCookies(): Promise<void> {
  if (process.env.INSTAGRAM_COOKIES) return; // Manuel çerez varsa dokunma

  try {
    const setCookies = await new Promise<string[]>((resolve) => {
      const req = https.get("https://www.instagram.com/", {
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

      fs.writeFileSync(COOKIES_PATH, cookieLines.join("\n"), "utf-8");
      console.log(`[ytdlp service] Otomatik Instagram misafir çerezleri yenilendi (${setCookies.length} adet).`);
    }
  } catch {
    // Otomatik çerez alma hatasını yut
  }
}

/**
 * Gerekli durumlarda ortama eklenen proxy veya çerez parametrelerini hazırlar
 */
function buildYtdlpExtraArgs(platform: string): string[] {
  const extraArgs: string[] = [];

  // Proxy desteği (Railway veya yerel ortam değişkeninden okur)
  const proxyUrl = process.env.PROXY_URL || process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
  if (proxyUrl) {
    extraArgs.push("--proxy", proxyUrl);
  }

  // Cookies dosyası desteği (Ortam değişkeninden veya otomatik oluşturulan cookies.txt'den okur)
  if (process.env.INSTAGRAM_COOKIES) {
    try {
      const content = Buffer.from(process.env.INSTAGRAM_COOKIES, "base64").toString("utf-8");
      fs.writeFileSync(COOKIES_PATH, content, "utf-8");
    } catch {
      fs.writeFileSync(COOKIES_PATH, process.env.INSTAGRAM_COOKIES, "utf-8");
    }
  }

  if (fs.existsSync(COOKIES_PATH)) {
    extraArgs.push("--cookies", COOKIES_PATH);
  }

  // Meta (Instagram / Facebook) bot/IP kısıtlamalarını aşan mobil başlıklar
  if (platform === "instagram") {
    extraArgs.push(
      "--add-header", "X-IG-App-ID: 936619743392459",
      "--add-header", "Sec-Fetch-Mode: navigate",
      "--add-header", "Accept-Language: en-US,en;q=0.9"
    );
  }

  return extraArgs;
}

/**
 * FFmpeg / yt-dlp stderr çıktısından banner ve progress metinlerini temizler,
 * GERÇEK hata mesajını (son anlamlı satırı) ayıklar.
 */
function extractCleanErrorMessage(err: unknown): string {
  const errorObj = err as { message?: string; stderr?: string; signal?: string; code?: string };
  const rawStderr = errorObj.stderr || errorObj.message || "";

  if (!rawStderr.trim()) {
    return "Bilinmeyen medya işleme hatası";
  }

  // Stderr satırlarını böl, FFmpeg banner'larını ve progress (frame=, speed=) satırlarını filtrele
  const lines = rawStderr
    .split("\n")
    .map(line => line.trim())
    .filter(line => {
      if (!line) return false;
      const lower = line.toLowerCase();

      // FFmpeg & System Banner Filtresi
      if (lower.startsWith("ffmpeg version") || lower.startsWith("built with gcc") || lower.startsWith("configuration:")) return false;
      if (lower.startsWith("libavutil") || lower.startsWith("libavcodec") || lower.startsWith("libavformat")) return false;
      if (lower.startsWith("libavdevice") || lower.startsWith("libavfilter") || lower.startsWith("libswscale")) return false;
      if (lower.startsWith("libswresample") || lower.startsWith("libpostproc") || lower.startsWith("copyright (c)")) return false;

      // FFmpeg Progress & Metadata Spam Filtresi
      if (lower.includes("frame=") || lower.includes("fps=") || lower.includes("size=") || lower.includes("bitrate=") || lower.includes("speed=")) return false;
      if (lower.includes("vendor_id") || lower.startsWith("stream #") || lower.startsWith("metadata:") || lower.startsWith("encoder:") || lower.startsWith("duration:")) return false;

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
async function checkVideoCodec(filePath: string): Promise<string> {
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
  } catch {
    return "unknown";
  }
}

/**
 * FFmpeg transcode komutunu çalıştırır (Video süresine göre dinamik zaman aşımı ve CRF 26 ile).
 * Progress spam'ını engellemek için -loglevel error ve -nostats kullanılır.
 */
async function runFfmpegTranscode(inputPath: string, outputPath: string, durationSec?: number): Promise<void> {
  const duration = durationSec && durationSec > 0 ? durationSec : 30;
  // Dinamik timeout: Video süresi * 3.5 saniye (Minimum 60sn, Maksimum 240sn / 4 dk)
  const timeoutMs = Math.min(240000, Math.max(60000, Math.ceil(duration * 3500)));

  console.log(`[ffmpeg] Transcode başlatıldı (Video Süresi: ${duration}s, Timeout: ${timeoutMs / 1000}s, CRF: 26): ${inputPath} -> ${outputPath}`);
  try {
    await execFileAsync("ffmpeg", [
      "-y",
      "-loglevel", "error",
      "-nostats",
      "-i", inputPath,
      "-map", "0:v:0",       // Açık stream seçimi: ilk video akışı
      "-map", "0:a:0?",      // Açık stream seçimi: ilk ses akışı (varsa)
      "-c:v", "libx264",
      "-preset", "ultrafast",
      "-crf", "26",           // Hızlı ve hafif kodlama (düşük CPU & bellek kullanımı)
      "-pix_fmt", "yuv420p",  // Mobil uyumluluk (Android/iOS native player)
      "-c:a", "aac",         // Ses codec'ini de AAC'ye dönüştür (mobil uyum)
      "-b:a", "128k",
      "-movflags", "+faststart",  // moov atom'u dosya başına taşı (mobil streaming)
      outputPath
    ], {
      timeout: timeoutMs,
      maxBuffer: 50 * 1024 * 1024, // 50MB tampon bellek
    });

    console.log(`[ffmpeg] Transcode başarıyla (exitCode 0) tamamlandı.`);
  } catch (err: any) {
    console.error(`[ffmpeg process exit info]: code=${err.code}, signal=${err.signal}, killed=${err.killed}, stderr=${err.stderr || err.message}`);

    if (err.killed || err.signal === "SIGTERM" || err.signal === "SIGKILL" || err.code === "ETIMEDOUT") {
      throw new Error("Video işlenirken zaman aşımına uğradı, farklı bir video deneyin veya birkaç dakika sonra tekrar deneyin.");
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
export async function resolveVideoWithYtDlp(videoUrl: string, platform: string): Promise<ResolvedVideoInfo> {
  try {
    const startTime = Date.now();
    console.log(`[ytdlp service] Resolve başlatılıyor (${platform}): ${videoUrl}`);

    // Instagram için otomatik misafir çerezi garantile
    if (platform === "instagram") {
      await ensureAutoGuestCookies();
    }

    let extraArgs = buildYtdlpExtraArgs(platform);

    let stdoutData = "";
    try {
      const { stdout } = await execFileAsync(
        "yt-dlp",
        [
          "-j",
          "--no-warnings",
          "--no-playlist",
          "--skip-download",
          "--user-agent", platform === "instagram" ? "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "--referer", platform === "tiktok" ? "https://www.tiktok.com/" : platform === "instagram" ? "https://www.instagram.com/" : "https://www.facebook.com/",
          ...extraArgs,
          videoUrl,
        ],
        {
          maxBuffer: 50 * 1024 * 1024,
          timeout: 30000,
        }
      );
      stdoutData = stdout;
    } catch (firstErr: any) {
      // Instagram boş yanıt verirse otomatik misafir çerezlerini yenile ve 1 kez tekrar dene
      if (platform === "instagram" && extractCleanErrorMessage(firstErr).toLowerCase().includes("empty media response")) {
        console.log(`[ytdlp service] Instagram boş yanıt verdi, otomatik misafir çerezi yenilenip tekrar deneniyor...`);
        await ensureAutoGuestCookies();
        extraArgs = buildYtdlpExtraArgs(platform);

        const { stdout } = await execFileAsync(
          "yt-dlp",
          [
            "-j",
            "--no-warnings",
            "--no-playlist",
            "--skip-download",
            "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "--referer", "https://www.instagram.com/",
            ...extraArgs,
            videoUrl,
          ],
          {
            maxBuffer: 50 * 1024 * 1024,
            timeout: 30000,
          }
        );
        stdoutData = stdout;
      } else {
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
    const outputPath = path.join(TEMP_DIR, outputFilename);

    const isTikTok = platform === "tiktok" || videoUrl.includes("tiktok.com");

    console.log(`[ytdlp service] İndirme (stream copy) başlatılıyor: ${outputPath}`);

    // H.264 (avc1/h264) formatlarını öncelikli indir
    await execFileAsync(
      "yt-dlp",
      [
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
      ],
      {
        maxBuffer: 50 * 1024 * 1024,
        timeout: 120000,
      }
    );

    // İndirilen ham dosyanın bütünlüğünü kontrol et
    if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size < 1000) {
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
      const transcodePath = path.join(TEMP_DIR, `${fileId}_h264.mp4`);
      const transcodeStart = Date.now();

      await runFfmpegTranscode(outputPath, transcodePath, duration);

      const transcodeDuration = Date.now() - transcodeStart;
      console.log(`[ytdlp service] H.264 transcode BAŞARIYLA tamamlandı (Süre: ${transcodeDuration}ms)`);

      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      fs.renameSync(transcodePath, outputPath);
    } else {
      console.log(`[ytdlp service] Video zaten H.264/AVC (${detectedCodec}) uyumlu, ffmpeg transcode adımı ATLANDI.`);
    }

    const elapsed = Date.now() - startTime;
    console.log(`[ytdlp service] Medya hazırlığı tamamlandı (Toplam Süre: ${elapsed}ms): ${outputPath}`);

    const stats = fs.existsSync(outputPath) ? fs.statSync(outputPath) : null;
    const safeTitle = (title || "video").substring(0, 30).replace(/[^a-zA-Z0-9_-]/g, "_");
    const downloadPath = `/download?fileId=${fileId}&filename=${encodeURIComponent(safeTitle)}.mp4`;

    const localFormat: VideoFormatOption = {
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
  } catch (err: unknown) {
    const cleanDetail = extractCleanErrorMessage(err);
    const lowerDetail = cleanDetail.toLowerCase();
    
    if (lowerDetail.includes("uri malformed") || lowerDetail.includes("urierror")) {
      throw new Error("Geçersiz bağlantı formatı, lütfen linki kontrol edip tekrar yapıştırın.");
    }
    if (
      lowerDetail.includes("isn't available to everyone") ||
      lowerDetail.includes("empty media response") ||
      lowerDetail.includes("ip address is blocked") ||
      lowerDetail.includes("login") ||
      lowerDetail.includes("rate limit")
    ) {
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
export function getTempFilePath(fileId: string): string | null {
  const safeFileId = path.basename(fileId);
  const filePath = path.join(TEMP_DIR, `${safeFileId}.mp4`);
  if (fs.existsSync(filePath)) {
    return filePath;
  }
  return null;
}
