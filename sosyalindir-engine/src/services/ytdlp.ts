import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export interface VideoFormatOption {
  formatId: string;
  ext: string;
  resolution: string;
  url: string;
  filesize?: number;
  isWatermarkless?: boolean;
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
}

/**
 * yt-dlp binary'sini child_process ile çağırarak video metadatasını çözer.
 * 
 * @param videoUrl Çözümlenecek sosyal medya bağlantısı
 */
export async function resolveVideoWithYtDlp(videoUrl: string, platform: string): Promise<ResolvedVideoInfo> {
  try {
    // yt-dlp -j --no-warnings --no-playlist <URL>
    const { stdout } = await execFileAsync(
      "yt-dlp",
      [
        "-j",
        "--no-warnings",
        "--no-playlist",
        "--skip-download",
        videoUrl,
      ],
      {
        maxBuffer: 15 * 1024 * 1024, // 15MB buffer
        timeout: 25000, // 25 saniye zaman aşımı
      }
    );

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

    const formats: VideoFormatOption[] = [];

    // TikTok özel format / filigran kontrolü
    if (Array.isArray(data.formats) && data.formats.length > 0) {
      for (const fmt of data.formats) {
        if (!fmt.url) continue;

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
