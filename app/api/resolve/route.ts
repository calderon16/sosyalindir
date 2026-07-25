import { NextRequest, NextResponse } from "next/server";
import { detectPlatform } from "@/lib/platformDetect";

/**
 * SosyalIndir — API Proxy Endpoint (/api/resolve)
 * 
 * Frontend'den gelen isteği alır, platform doğrulaması yapar ve
 * arka plandaki sosyalindir-engine servisine (yt-dlp proxy) iletir.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const url = body.url;

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json(
        { error: "Lütfen geçerli bir video bağlantısı yapıştırın." },
        { status: 400 }
      );
    }

    const trimmedUrl = url.trim();

    // 1. Platform kontrolü
    const platform = detectPlatform(trimmedUrl);
    if (platform === "unknown") {
      return NextResponse.json(
        {
          error: "Bu bağlantı şu anda desteklenmiyor. Lütfen geçerli bir Instagram, TikTok, YouTube Shorts veya Facebook Reels bağlantısı girin.",
        },
        { status: 400 }
      );
    }

    // 2. Engine Servis URL'i
    const engineBaseUrl = process.env.DOWNLOADER_ENGINE_URL || "http://localhost:4000";
    const targetUrl = `${engineBaseUrl}/resolve?url=${encodeURIComponent(trimmedUrl)}`;

    // 3. Backend Engine'e İstek At
    const engineRes = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    const engineData = await engineRes.json().catch(() => null);

    if (!engineRes.ok || !engineData) {
      const errorMsg =
        engineData?.error ||
        "Bu bağlantı şu anda işlenemiyor, linki kontrol edip tekrar dener misin?";
      
      return NextResponse.json(
        { error: errorMsg },
        { status: engineRes.status >= 400 && engineRes.status < 500 ? engineRes.status : 422 }
      );
    }

    // Engine'in başarılı yanıtını aynen döndür
    return NextResponse.json(engineData);

  } catch (error) {
    console.error("[API resolve error]:", error);
    return NextResponse.json(
      {
        error: "Video indirme servisine şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin.",
      },
      { status: 503 }
    );
  }
}

// GET isteğini de desteklemek için
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Lütfen 'url' parametresini belirtin." },
      { status: 400 }
    );
  }

  // POST handler'ına yönlendir
  return POST(
    new NextRequest(req.url, {
      method: "POST",
      body: JSON.stringify({ url }),
      headers: { "Content-Type": "application/json" },
    })
  );
}
