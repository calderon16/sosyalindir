import { execFile } from "child_process";
import { promisify } from "util";
import https from "https";
import http from "http";
import { ResolvedVideoInfo, VideoFormatOption } from "./ytdlp.js";

const execFileAsync = promisify(execFile);

/**
 * SaverAPI + yt-dlp Hibrit YouTube Çözümleyici
 *
 * Strateji:
 *   1. yt-dlp -j ile YouTube video metadata + format listesini al (dosya indirmeden)
 *   2. En iyi video+ses stream URL'sini seç (H.264, sesli, tercihen 720p)
 *   3. SaverAPI /api/youtube-info-v2 ile daha zengin metadata overlay yap (isteğe bağlı)
 *
 * Bu yaklaşım:
 *   - Railway'de ffmpeg merge gerektirmiyor (dosya indirme yok)
 *   - YouTube CDN URL'si direkt /download proxy üzerinden stream edilir
 *   - SaverAPI metadata ile başlık/thumbnail zenginleştirilir
 */

// ─── SaverAPI youtube-info-v2 yanıt tipi ──────────────────────────────────

interface SaverApiV2Response {
  ok?: boolean;
  video_id?: string;
  title?: string;
  author?: string;
  thumbnail?: string;
  duration?: number;
  thumbnails?: { low?: string; max?: string };
  formats?: Array<{ type: string; format: string; filesize?: number }>;
  error?: boolean | string;
  message?: string;
}

// ─── Yardımcı: HTTPS GET ─────────────────────────────────────────────────────

function httpsGet(url: string, headers: Record<string, string> = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const parsedUrl = new URL(url);

    const req = (protocol as typeof https).request(
      {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: "GET",
        headers: {
          "User-Agent": "SosyalIndir-Engine/1.0",
          "Accept": "application/json",
          ...headers,
        },
        timeout: 15000,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk: Buffer) => (data += chunk.toString()));
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}`));
          } else {
            resolve(data);
          }
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
    req.end();
  });
}

// ─── SaverAPI metadata (isteğe bağlı) ─────────────────────────────────────

async function fetchSaverApiMeta(
  videoUrl: string,
  apiKey: string
): Promise<{ title?: string; author?: string; thumbnail?: string; duration?: number } | null> {
  try {
    const authHeaders = {
      "Authorization": `Bearer ${apiKey}`,
      "x-api-key": apiKey,
    };
    const url = `https://saverapi.net/api/youtube-info-v2?url=${encodeURIComponent(videoUrl)}`;
    const raw = await httpsGet(url, authHeaders);
    const parsed: SaverApiV2Response = JSON.parse(raw);

    if (parsed.ok && parsed.title) {
      const thumbnail =
        parsed.thumbnails?.max ||
        parsed.thumbnails?.low ||
        parsed.thumbnail ||
        (parsed.video_id ? `https://i.ytimg.com/vi/${parsed.video_id}/maxresdefault.jpg` : "");

      console.log(`[SaverAPI] Metadata alındı: "${parsed.title}" (${parsed.duration}s)`);
      return {
        title: parsed.title,
        author: parsed.author,
        thumbnail,
        duration: parsed.duration,
      };
    }
  } catch (e) {
    console.warn(`[SaverAPI] Metadata overlay başarısız (önemsiz): ${(e as Error).message?.substring(0, 60)}`);
  }
  return null;
}

// ─── yt-dlp ile YouTube JSON metadata al ─────────────────────────────────────

interface YtDlpFormat {
  format_id: string;
  ext: string;
  url: string;
  height?: number;
  width?: number;
  vcodec?: string;
  acodec?: string;
  filesize?: number;
  filesize_approx?: number;
  tbr?: number;
  format_note?: string;
  dynamic_range?: string;
}

interface YtDlpJson {
  id: string;
  title?: string;
  uploader?: string;
  channel?: string;
  uploader_id?: string;
  thumbnail?: string;
  thumbnails?: Array<{ url: string; width?: number; height?: number }>;
  duration?: number;
  formats?: YtDlpFormat[];
  // Tekil format (en iyi seçim) da gelebilir
  url?: string;
  ext?: string;
  vcodec?: string;
  acodec?: string;
  format_id?: string;
  height?: number;
  filesize?: number;
  filesize_approx?: number;
}

function selectBestFormats(formats: YtDlpFormat[]): VideoFormatOption[] {
  // Hedef: Ses + Video birleşik stream URL içeren mp4/H.264 formatlar
  // YouTube CDN'de `acodec !== 'none'` olan formatlar ses içeriyor demektir
  const candidates = formats.filter(
    (f) =>
      f.url &&
      f.acodec &&
      f.acodec !== "none" &&
      f.vcodec &&
      f.vcodec !== "none" &&
      !f.url.includes("manifest") &&
      f.ext !== "webm"
  );

  // Çözünürlüğe göre sırala (büyükten küçüğe)
  candidates.sort((a, b) => (b.height || 0) - (a.height || 0));

  // En fazla 3 format sun (1080p, 720p, 360p gibi)
  const selected = candidates.slice(0, 3);

  // Eğer birleşik format yoksa ses+video ayrı streamler var demektir (DASH)
  // Bu durumda tek formatlı birleşik listeyi seç
  if (selected.length === 0) {
    // Sadece video (sesli değil) olanları da deneyelim
    const videoOnly = formats.filter(
      (f) => f.url && f.vcodec && f.vcodec !== "none" && !f.url.includes("manifest") && f.ext !== "webm"
    );
    videoOnly.sort((a, b) => (b.height || 0) - (a.height || 0));
    const best = videoOnly.slice(0, 1);

    return best.map((f) => ({
      formatId: f.format_id,
      ext: f.ext || "mp4",
      resolution: f.height ? `${f.height}p` : "HD",
      url: f.url,
      filesize: f.filesize || f.filesize_approx,
      isWatermarkless: true,
      hasAudio: f.acodec !== "none",
      vcodec: f.vcodec,
    }));
  }

  return selected.map((f) => ({
    formatId: f.format_id,
    ext: f.ext || "mp4",
    resolution: f.height ? `${f.height}p` : (f.format_note || "HD"),
    url: f.url,
    filesize: f.filesize || f.filesize_approx,
    isWatermarkless: true,
    hasAudio: true,
    vcodec: f.vcodec,
  }));
}

// ─── Ana dışa aktarılan fonksiyon ────────────────────────────────────────────

/**
 * YouTube video çözümleyici: yt-dlp -j ile stream URL al + SaverAPI metadata overlay.
 * Dosya indirme yapılmaz; YouTube CDN URL'si /download proxy üzerinden servis edilir.
 */
export async function resolveYouTubeWithSaverApi(
  videoUrl: string
): Promise<ResolvedVideoInfo> {
  const startTime = Date.now();
  console.log(`[YouTube Resolver] Başlatılıyor: ${videoUrl}`);

  // ── 1. yt-dlp -j ile JSON metadata + format URL'leri al ───────────────────
  let ytJson: YtDlpJson;
  try {
    const { stdout } = await execFileAsync(
      "yt-dlp",
      [
        "-j",
        "--no-warnings",
        "--no-playlist",
        "--skip-download",
        // Android VR client: kısıtlanmamış 360p/720p birleşik mp4 formatları verir
        "--extractor-args", "youtube:player_client=android_vr,web",
        "--user-agent", "com.google.android.apps.youtube.vr.oculus/1.56.21 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip",
        videoUrl,
      ],
      {
        maxBuffer: 50 * 1024 * 1024,
        timeout: 45000,
      }
    );
    ytJson = JSON.parse(stdout.trim());
  } catch (err: unknown) {
    const errorObj = err as { message?: string; stderr?: string };
    const msg = errorObj.stderr || errorObj.message || "yt-dlp hatası";

    console.error(`[YouTube Resolver Error]: ${msg}`);

    // Anlamlı hata mesajlarını çıkar
    const lowerMsg = msg.toLowerCase();
    if (lowerMsg.includes("private")) throw new Error("Bu video gizli ya da erişime kapalı.");
    if (lowerMsg.includes("unavailable") || lowerMsg.includes("not found"))
      throw new Error("Video bulunamadı veya kaldırılmış olabilir.");
    if (lowerMsg.includes("sign in") || lowerMsg.includes("login"))
      throw new Error("Bu video giriş gerektiriyor ve indirilemez.");

    throw new Error(`YouTube işleme hatası: ${msg.substring(0, 150)}`);
  }

  // ── 2. Metadata çıkar ─────────────────────────────────────────────────────
  const id = ytJson.id || "unknown";
  const title = ytJson.title || "YouTube Videosu";
  const author =
    ytJson.uploader || ytJson.channel || ytJson.uploader_id || "YouTube";
  const thumbnail =
    ytJson.thumbnail ||
    (Array.isArray(ytJson.thumbnails) && ytJson.thumbnails.length > 0
      ? ytJson.thumbnails[ytJson.thumbnails.length - 1].url
      : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
  const duration = ytJson.duration || 0;

  // ── 3. Format listesinden en iyi URL'leri seç ─────────────────────────────
  let formats: VideoFormatOption[] = [];

  if (Array.isArray(ytJson.formats) && ytJson.formats.length > 0) {
    formats = selectBestFormats(ytJson.formats);
  }

  // Format listesi hâlâ boş ama tekil URL var (yt-dlp en iyi formatı seçti)
  if (formats.length === 0 && ytJson.url) {
    formats.push({
      formatId: ytJson.format_id || "best",
      ext: ytJson.ext || "mp4",
      resolution: ytJson.height ? `${ytJson.height}p` : "HD",
      url: ytJson.url,
      filesize: ytJson.filesize || ytJson.filesize_approx,
      isWatermarkless: true,
      hasAudio: ytJson.acodec !== "none",
      vcodec: ytJson.vcodec,
    });
  }

  if (formats.length === 0) {
    throw new Error(
      "YouTube video için uygun bir indirme URL'si bulunamadı. Video kısıtlı veya bölgenizde kullanılamıyor olabilir."
    );
  }

  const downloadUrl = formats[0].url;

  // ── 4. SaverAPI metadata overlay (isteğe bağlı — daha zengin başlık/thumbnail) ──
  const apiKey = process.env.SAVERAPI_KEY;
  let finalTitle = title;
  let finalAuthor = author;
  let finalThumbnail = thumbnail;
  let finalDuration = duration;

  if (apiKey) {
    const meta = await fetchSaverApiMeta(videoUrl, apiKey);
    if (meta) {
      finalTitle = meta.title || title;
      finalAuthor = meta.author || author;
      finalThumbnail = meta.thumbnail || thumbnail;
      finalDuration = (meta.duration && meta.duration > 0) ? meta.duration : duration;
    }
  }

  const elapsed = Date.now() - startTime;
  console.log(
    `[YouTube Resolver] Tamamlandı (${elapsed}ms): "${finalTitle}" — ${formats.length} format | ` +
    `En iyi: ${formats[0].resolution}`
  );

  return {
    id,
    title: finalTitle,
    author: finalAuthor,
    thumbnail: finalThumbnail,
    duration: finalDuration,
    platform: "youtube",
    downloadUrl,
    formats,
    // fileId YOK — YouTube CDN URL'si direkt proxy ile stream edilir
  };
}
