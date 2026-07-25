import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import os from "os";

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
 * ffprobe kullanarak video dosyasının video codec'ini detaylı ve güvenli tespit eder
 */
async function checkVideoCodec(filePath: string): Promise<string> {
  try {
    const { stdout, stderr } = await execFileAsync("ffprobe", [
      "-v", "error",
      "-select_streams", "v:0",
      "-show_entries", "stream=codec_name",
      "-of", "json",
      filePath
    ]);

    console.log(`[ffprobe raw stdout]: ${stdout.trim()}`);
    if (stderr && stderr.trim()) {
      console.log(`[ffprobe raw stderr]: ${stderr.trim()}`);
    }

    const parsed = JSON.parse(stdout);
    const codecName = parsed?.streams?.[0]?.codec_name?.toLowerCase() || "";
    return codecName;
  } catch (err: any) {
    console.error(`[ffprobe error]:`, err.message || err);
    return "unknown";
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

    const { stdout } = await execFileAsync(
      "yt-dlp",
      [
        "-j",
        "--no-warnings",
        "--no-playlist",
        "--skip-download",
        "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "--referer", platform === "tiktok" ? "https://www.tiktok.com/" : platform === "instagram" ? "https://www.instagram.com/" : "https://www.facebook.com/",
        videoUrl,
      ],
      {
        maxBuffer: 15 * 1024 * 1024,
        timeout: 25000,
      }
    );

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
    const outputPath = path.join(TEMP_DIR, outputFilename);

    const isTikTok = platform === "tiktok" || videoUrl.includes("tiktok.com");

    console.log(`[ytdlp service] İndirme (stream copy) başlatılıyor: ${outputPath}`);

    // H.264 (avc1/h264) formatlarını öncelikli indir
    await execFileAsync(
      "yt-dlp",
      [
        "-f", "bestvideo[vcodec*='avc1']+bestaudio/bestvideo[vcodec*='h264']+bestaudio/bestvideo+bestaudio/best",
        "--merge-output-format", "mp4",
        "--postprocessor-args", "ffmpeg:-c copy",
        "--no-warnings",
        "--no-playlist",
        "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "--referer", isTikTok ? "https://www.tiktok.com/" : "https://www.google.com/",
        "-o", outputPath,
        videoUrl,
      ],
      { timeout: 40000 }
    );

    // İndirilen dosyanın codec'ini ffprobe ile doğrula
    const detectedCodec = await checkVideoCodec(outputPath);
    console.log(`[ytdlp service] ffprobe ile tespit edilen video codec: '${detectedCodec}'`);

    const isHevc = detectedCodec.includes("hevc") || detectedCodec.includes("h265") || detectedCodec.includes("hev1") || detectedCodec.includes("hvc1");

    // HEVC (H.265) veya H.264 dışındaki uyumsuz codec'ler için ffmpeg transcode tetikle
    if (isHevc) {
      console.log(`[ytdlp service] HEVC (${detectedCodec}) tespit edildi! Evrensel cihaz uyumluluğu için H.264 (libx264) transcoding BAŞLATILDI...`);
      const transcodePath = path.join(TEMP_DIR, `${fileId}_h264.mp4`);
      const transcodeStart = Date.now();

      const transcodeResult = await execFileAsync("ffmpeg", [
        "-y",
        "-i", outputPath,
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "18",
        "-c:a", "copy",
        transcodePath
      ], { timeout: 45000 });

      if (transcodeResult.stderr) {
        console.log(`[ffmpeg transcode stderr]: ${transcodeResult.stderr.substring(0, 300)}`);
      }

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
    const downloadPath = `/download?fileId=${fileId}&filename=${encodeURIComponent(title.substring(0, 30))}.mp4`;

    const localFormat: VideoFormatOption = {
      formatId: "merged_best",
      ext: "mp4",
      resolution: "1080p HD",
      url: downloadPath,
      filesize: stats?.size,
      isWatermarkless: true,
      hasAudio: true,
      vcodec: isHevc ? "h264_transcoded" : detectedCodec,
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
    const error = err as { message?: string; stderr?: string };
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
export function getTempFilePath(fileId: string): string | null {
  const safeFileId = path.basename(fileId);
  const filePath = path.join(TEMP_DIR, `${safeFileId}.mp4`);
  if (fs.existsSync(filePath)) {
    return filePath;
  }
  return null;
}
