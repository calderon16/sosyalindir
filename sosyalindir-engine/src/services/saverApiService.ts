import https from "https";
import http from "http";
import { ResolvedVideoInfo, VideoFormatOption } from "./ytdlp.js";

/**
 * SaverAPI (saverapi.net) üzerinden YouTube video bilgisi alır.
 * API Key ortam değişkeninden okunur: SAVERAPI_KEY
 *
 * Kullanılan endpoint: GET https://saverapi.net/api/youtube-info?url=<VIDEO_URL>&apiKey=<KEY>
 * Maliyet: 1 kredi / istek
 *
 * youtube-info-v2 (2 kredi) daha zengin format listesi sunar; kredi tasarrufu için
 * önce youtube-info (1 kredi) denenir, başarısız olursa hata fırlatılır.
 */

// ─── SaverAPI yanıt tipleri ─────────────────────────────────────────────────

interface SaverApiYouTubeFormat {
  quality?: string;
  resolution?: string;
  url?: string;
  download_url?: string;
  ext?: string;
  type?: string;
  size?: number;
  filesize?: number;
  hasAudio?: boolean;
  vcodec?: string;
}

interface SaverApiYouTubeInfoResponse {
  // youtube-info (v1) alanları
  title?: string;
  thumbnail?: string;
  thumbnail_url?: string;
  duration?: number;
  author?: string;
  channel?: string;
  uploader?: string;
  id?: string;
  video_id?: string;
  formats?: SaverApiYouTubeFormat[];
  download_url?: string;
  url?: string;

  // Ortak hata alanları
  error?: string;
  message?: string;
  status?: number | string;
  success?: boolean;
}

// ─── Yardımcı: basit HTTPS GET ──────────────────────────────────────────────

function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const req = protocol.get(
      url,
      {
        headers: {
          "User-Agent": "SosyalIndir-Engine/1.0",
          "Accept": "application/json",
        },
        timeout: 20000,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk: Buffer) => (data += chunk.toString()));
        res.on("end", () => resolve(data));
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("SaverAPI isteği zaman aşımına uğradı (20s)."));
    });
  });
}

// ─── Ana fonksiyon ─────────────────────────────────────────────────────────

/**
 * SaverAPI'den YouTube video bilgisi çeker ve projenin beklediği
 * ResolvedVideoInfo formatına dönüştürür.
 *
 * @param videoUrl İndirilecek YouTube URL'si (Shorts dahil)
 * @returns ResolvedVideoInfo — projenin geri kalanı ile tamamen uyumlu
 */
export async function resolveYouTubeWithSaverApi(
  videoUrl: string
): Promise<ResolvedVideoInfo> {
  const apiKey = process.env.SAVERAPI_KEY;
  if (!apiKey) {
    throw new Error(
      "SAVERAPI_KEY ortam değişkeni tanımlı değil. Lütfen Railway panelinde bu değişkeni ekleyin."
    );
  }

  console.log(`[SaverAPI] YouTube resolve başlatılıyor: ${videoUrl}`);
  const startTime = Date.now();

  // ── 1. Önce youtube-info (1 kredi) dene ──────────────────────────────────
  const infoUrl =
    `https://saverapi.net/api/youtube-info` +
    `?url=${encodeURIComponent(videoUrl)}&apiKey=${encodeURIComponent(apiKey)}`;

  let rawBody: string;
  try {
    rawBody = await httpsGet(infoUrl);
  } catch (fetchErr: unknown) {
    const msg = (fetchErr as Error).message || String(fetchErr);
    console.error(`[SaverAPI] HTTP isteği başarısız: ${msg}`);
    throw new Error(
      `YouTube video bilgileri alınamadı: Sunucuya ulaşılamıyor (${msg})`
    );
  }

  // ── 2. JSON parse ─────────────────────────────────────────────────────────
  let parsed: SaverApiYouTubeInfoResponse;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    console.error(
      `[SaverAPI] JSON parse hatası. Ham yanıt (ilk 500 char): ${rawBody.substring(0, 500)}`
    );
    throw new Error(
      "YouTube API'den geçersiz yanıt alındı. Lütfen birkaç dakika sonra tekrar deneyin."
    );
  }

  // ── 3. Hata kontrolü ─────────────────────────────────────────────────────
  const isApiError =
    parsed.success === false ||
    parsed.error ||
    (parsed.status && String(parsed.status) !== "200" && String(parsed.status) !== "ok");

  if (isApiError) {
    const errMsg = parsed.error || parsed.message || "Bilinmeyen API hatası";
    console.error(`[SaverAPI] API hata yanıtı: ${errMsg}`);

    // Kullanıcıya uygun Türkçe mesaj
    if (errMsg.toLowerCase().includes("invalid") || errMsg.toLowerCase().includes("key")) {
      throw new Error("SaverAPI anahtarı geçersiz veya süresi dolmuş. Lütfen yöneticiyle iletişime geçin.");
    }
    if (errMsg.toLowerCase().includes("credit") || errMsg.toLowerCase().includes("balance")) {
      throw new Error("API kredi limiti aşıldı. YouTube indirme geçici olarak kullanılamıyor.");
    }
    if (errMsg.toLowerCase().includes("not found") || errMsg.toLowerCase().includes("unavailable")) {
      throw new Error("Video bulunamadı veya silinmiş olabilir.");
    }
    if (errMsg.toLowerCase().includes("private")) {
      throw new Error("Bu video gizli ya da erişime kapalı.");
    }
    throw new Error(`YouTube videosu işlenemedi: ${errMsg}`);
  }

  // ── 4. Veri çıkarma ──────────────────────────────────────────────────────
  const title = parsed.title || "YouTube Videosu";
  const thumbnail =
    parsed.thumbnail || parsed.thumbnail_url || "";
  const duration = typeof parsed.duration === "number" ? parsed.duration : 0;
  const author =
    parsed.author || parsed.channel || parsed.uploader || "YouTube";
  const id = parsed.id || parsed.video_id || `yt_${Date.now()}`;

  // İndirme URL'si: formats[] dizisinden en iyi video+ses formatı seç
  let downloadUrl = parsed.download_url || parsed.url || "";
  let selectedExt = "mp4";
  let selectedResolution = "HD";

  const formats: VideoFormatOption[] = [];

  if (Array.isArray(parsed.formats) && parsed.formats.length > 0) {
    // Önce video+ses içeren mp4 formatlarını filtrele, sonra en yükseğini al
    const videoFormats = parsed.formats.filter(
      (f) =>
        (f.url || f.download_url) &&
        (f.type !== "audio" && f.ext !== "mp3" && f.ext !== "webm")
    );

    // Çözünürlüğe göre sıralama: 1080 > 720 > 480 > 360
    const resolutionPriority = (f: SaverApiYouTubeFormat): number => {
      const res = (f.quality || f.resolution || "").toLowerCase();
      if (res.includes("1080")) return 4;
      if (res.includes("720")) return 3;
      if (res.includes("480")) return 2;
      if (res.includes("360")) return 1;
      return 0;
    };

    videoFormats.sort((a, b) => resolutionPriority(b) - resolutionPriority(a));

    for (const f of videoFormats) {
      const fUrl = f.url || f.download_url || "";
      if (!fUrl) continue;

      const fExt = f.ext || "mp4";
      const fRes = f.quality || f.resolution || "HD";

      formats.push({
        formatId: `saverapi_${fRes}`,
        ext: fExt,
        resolution: fRes,
        url: fUrl,
        filesize: f.size || f.filesize,
        isWatermarkless: true,
        hasAudio: f.hasAudio !== false,
        vcodec: f.vcodec || "h264",
      });
    }

    // En iyi formatı varsayılan olarak seç
    if (formats.length > 0) {
      downloadUrl = formats[0].url;
      selectedExt = formats[0].ext;
      selectedResolution = formats[0].resolution;
    }
  }

  // Formats listesi hâlâ boşsa ve tek bir indirme URL'si varsa onu ekle
  if (formats.length === 0 && downloadUrl) {
    formats.push({
      formatId: "saverapi_default",
      ext: selectedExt,
      resolution: selectedResolution,
      url: downloadUrl,
      isWatermarkless: true,
      hasAudio: true,
      vcodec: "h264",
    });
  }

  if (!downloadUrl) {
    throw new Error(
      "YouTube video indirme linki alınamadı. Video kısıtlı veya API yanıtı eksik olabilir."
    );
  }

  const elapsed = Date.now() - startTime;
  console.log(
    `[SaverAPI] YouTube resolve tamamlandı (${elapsed}ms): ${title} — ${formats.length} format`
  );

  // ── 5. Mevcut proje şemasına uyumlu response oluştur ─────────────────────
  return {
    id,
    title,
    author,
    thumbnail,
    duration,
    platform: "youtube",
    downloadUrl,       // Birincil indirme URL'si (CDN direkt linki)
    formats,
    // fileId YOK: YouTube için geçici dosya oluşturulmaz, CDN'den direkt servis edilir
  };
}
