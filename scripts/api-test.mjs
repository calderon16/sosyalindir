import fs from "fs";
import path from "path";
import os from "os";

const API_BASE = "https://sosyalindir-production.up.railway.app/resolve?url=";
const TEMP_DIR = path.join(os.tmpdir(), "sosyalindir_api_tests");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const TEST_CASES = [
  {
    platform: "Instagram",
    label: "Instagram Reels #1",
    url: "https://www.instagram.com/reel/C8kQJvXoZ9A/",
  },
  {
    platform: "TikTok",
    label: "TikTok Video #1",
    url: "https://www.tiktok.com/@tiktok/video/7106594312292453675",
  },
  {
    platform: "TikTok",
    label: "TikTok Video #2",
    url: "https://www.tiktok.com/@khaby.lame/video/6966606013693283589",
  },
  {
    platform: "Facebook",
    label: "Facebook Video",
    url: "https://www.facebook.com/watch/?v=10153231379946729",
  },
  {
    platform: "YouTube",
    label: "YouTube Shorts #1",
    url: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
  },
  {
    platform: "YouTube",
    label: "YouTube Video #2",
    url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
  },
];

async function runApiTests() {
  console.log("==========================================================");
  console.log("   SosyalIndir — SKILL.md Otomatik Regresyon Test Protokolü");
  console.log("==========================================================\n");

  let passedCount = 0;
  const results = [];

  for (const tc of TEST_CASES) {
    const startTime = Date.now();
    console.log(`▶ [${tc.platform}] ${tc.label}`);
    console.log(`  URL: ${tc.url}`);

    try {
      const endpoint = `${API_BASE}${encodeURIComponent(tc.url)}`;
      const res = await fetch(endpoint, { signal: AbortSignal.timeout(40000) });
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(`HTTP ${res.status} - ${errJson.error || "Bilinmeyen hata"}`);
      }

      const json = await res.json();
      if (json.status !== "success" || !json.data) {
        throw new Error(`Geçersiz API yanıtı: ${JSON.stringify(json)}`);
      }

      const data = json.data;
      if (!data.downloadUrl && (!data.formats || data.formats.length === 0)) {
        throw new Error("İndirme linki (downloadUrl/formats) boş döndü");
      }

      const dlUrl = data.downloadUrl || data.formats[0].url;
      const title = data.title || "Başlıksız";

      console.log(`  ✅ BAŞARILI (${elapsed}s)`);
      console.log(`     Başlık: "${title.substring(0, 55)}"`);
      console.log(`     Format Sayısı: ${data.formats?.length || 1}`);
      console.log(`     İndirme Linki: ${dlUrl.substring(0, 70)}...`);

      passedCount++;
      results.push({ ...tc, status: "PASS", elapsed, title, error: null });
    } catch (err) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`  ❌ BAŞARISIZ (${elapsed}s) — ${err.message}`);
      results.push({ ...tc, status: "FAIL", elapsed, title: null, error: err.message });
    }
    console.log("");
  }

  console.log("==========================================================");
  console.log(` Sonuç: ${passedCount} / ${TEST_CASES.length} Test Başarılı`);
  console.log("==========================================================");

  if (passedCount < TEST_CASES.length - 1) { // 1 tolere edilebilir ağ hatası hariç
    process.exit(1);
  }
}

runApiTests();
