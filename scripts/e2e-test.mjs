/**
 * SosyalIndir — SKILL.md Otomatik Uçtan Uca Test Protokolü
 * 6 link: 2 Instagram + 2 TikTok + 1 Facebook + 1 YouTube
 * 
 * Kullanım:
 *   node scripts/e2e-test.mjs
 *   (veya: npx playwright test scripts/e2e-test.mjs --headed)
 */

import { chromium } from "@playwright/test";
import { execSync } from "child_process";
import { existsSync, statSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

const PRODUCTION_URL = "https://sosyalindirapp.com";
const DOWNLOAD_DIR = join(tmpdir(), "sosyalindir_test_downloads");

// ─── Test Linkleri (gerçek, herkese açık) ──────────────────────────────────
const TEST_LINKS = [
  {
    platform: "instagram",
    label: "Instagram Reels #1",
    url: "https://www.instagram.com/reel/C9XzQjrMqzE/",
  },
  {
    platform: "instagram",
    label: "Instagram Reels #2",
    url: "https://www.instagram.com/reel/C8kQJvXoZ9A/",
  },
  {
    platform: "tiktok",
    label: "TikTok #1",
    url: "https://www.tiktok.com/@tiktok/video/7106594312292453675",
  },
  {
    platform: "tiktok",
    label: "TikTok #2",
    url: "https://vm.tiktok.com/ZMkUDV5eM/",
  },
  {
    platform: "facebook",
    label: "Facebook Reels #1",
    url: "https://www.facebook.com/reel/1234567890",
  },
  {
    platform: "youtube",
    label: "YouTube Shorts",
    url: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
  },
];

// ─── ffprobe ile dosya doğrulama ────────────────────────────────────────────
function validateVideoFile(filePath) {
  if (!existsSync(filePath)) {
    return { ok: false, reason: "Dosya bulunamadı" };
  }

  const size = statSync(filePath).size;
  if (size < 1000) {
    return { ok: false, reason: `Dosya çok küçük: ${size} byte` };
  }

  try {
    const out = execSync(
      `ffprobe -v quiet -print_format json -show_streams "${filePath}"`,
      { encoding: "utf-8", timeout: 15000 }
    );
    const data = JSON.parse(out);
    const streams = data.streams || [];
    const hasVideo = streams.some((s) => s.codec_type === "video");
    const hasAudio = streams.some((s) => s.codec_type === "audio");

    if (!hasVideo) {
      return { ok: false, reason: "Video stream yok" };
    }

    const duration = parseFloat(
      streams.find((s) => s.codec_type === "video")?.duration || "0"
    );

    return {
      ok: true,
      size,
      hasVideo,
      hasAudio,
      duration: duration.toFixed(1),
    };
  } catch (e) {
    return { ok: false, reason: `ffprobe hatası: ${e.message}` };
  }
}

// ─── Ana test fonksiyonu ─────────────────────────────────────────────────────
async function runTests() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║     SosyalIndir — Otomatik Uçtan Uca Test Protokolü       ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");
  console.log(`🌐 Hedef: ${PRODUCTION_URL}`);
  console.log(`📁 İndirme dizini: ${DOWNLOAD_DIR}`);
  console.log(`🔗 Test linki sayısı: ${TEST_LINKS.length}\n`);

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const testCase of TEST_LINKS) {
    console.log(`\n▶ [${testCase.platform.toUpperCase()}] ${testCase.label}`);
    console.log(`  URL: ${testCase.url}`);

    const context = await browser.newContext({
      acceptDownloads: true,
      locale: "tr-TR",
    });
    const page = await context.newPage();

    const result = {
      label: testCase.label,
      platform: testCase.platform,
      url: testCase.url,
      ok: false,
      error: null,
      downloadedFile: null,
      fileCheck: null,
      duration: null,
    };

    const startTime = Date.now();

    try {
      // 1. Sayfayı aç
      await page.goto(PRODUCTION_URL, { waitUntil: "domcontentloaded", timeout: 30000 });

      // 2. URL input'una linki yapıştır
      const inputSel = "input[type='text']";
      await page.waitForSelector(inputSel, { timeout: 15000 });
      await page.fill(inputSel, testCase.url);
      await page.waitForTimeout(800);

      // 3. İndir butonuna tıkla
      const submitSel = "button[type='submit']";
      await page.waitForSelector(submitSel + ":not([disabled])", { timeout: 10000 });
      await page.click(submitSel);

      // 4. Video önizlemesini bekle (başlık veya thumbnail)
      const previewSel = [
        "[data-testid='video-preview']",
        ".video-preview",
        "img[alt*='thumbnail']",
        "h2", // başlık genellikle h2 ile gösterilir
        "[class*='preview']",
        "[class*='VideoPreview']",
        "[class*='video-card']",
      ].join(", ");

      try {
        await page.waitForSelector(previewSel, { timeout: 45000 });
        console.log("  ✓ Video önizleme göründü");
      } catch {
        // Önizleme bulunamazsa hata mesajı ara
        const errText = await page.evaluate(() => {
          const el = document.querySelector("[class*='error'], [class*='Error'], .text-red");
          return el ? el.textContent : null;
        });
        throw new Error(
          errText ? `API Hatası: ${errText.trim().substring(0, 200)}` : "Video önizleme 45s içinde görünmedi"
        );
      }

      // 5. İndirme butonuna tıkla ve dosyayı yakala
      const downloadPromise = page.waitForEvent("download", { timeout: 60000 });

      // İndirme butonunu bul — birkaç olası seçici dene
      const dlBtnSels = [
        "a[download]",
        "a[href*='download']",
        "button:has-text('İndir')",
        "[data-testid='download-btn']",
        "[class*='download']",
      ];

      let dlClicked = false;
      for (const sel of dlBtnSels) {
        const btn = page.locator(sel).first();
        if (await btn.count() > 0) {
          await btn.click();
          dlClicked = true;
          console.log(`  ✓ İndirme butonu tıklandı (${sel})`);
          break;
        }
      }

      if (!dlClicked) {
        throw new Error("İndirme butonu bulunamadı");
      }

      const download = await downloadPromise;
      const savePath = join(DOWNLOAD_DIR, download.suggestedFilename() || `${testCase.platform}_test.mp4`);
      await download.saveAs(savePath);

      result.downloadedFile = savePath;
      console.log(`  ✓ Dosya indirildi: ${download.suggestedFilename()}`);

      // 6. ffprobe ile doğrula
      const fileCheck = validateVideoFile(savePath);
      result.fileCheck = fileCheck;

      if (fileCheck.ok) {
        result.ok = true;
        console.log(
          `  ✅ BAŞARILI — Boyut: ${(fileCheck.size / 1024 / 1024).toFixed(2)} MB | ` +
          `Süre: ${fileCheck.duration}s | Ses: ${fileCheck.hasAudio ? "✓" : "✗"}`
        );
      } else {
        throw new Error(`Dosya doğrulama başarısız: ${fileCheck.reason}`);
      }
    } catch (err) {
      result.ok = false;
      result.error = err.message;
      console.log(`  ❌ BAŞARISIZ — ${err.message}`);

      // Screenshot al
      try {
        const ssPath = join(DOWNLOAD_DIR, `error_${testCase.platform}_${Date.now()}.png`);
        await page.screenshot({ path: ssPath, fullPage: true });
        console.log(`     📸 Screenshot: ${ssPath}`);
      } catch {}
    } finally {
      result.duration = ((Date.now() - startTime) / 1000).toFixed(1) + "s";
      await context.close();
    }

    results.push(result);
  }

  await browser.close();

  // ─── Rapor ──────────────────────────────────────────────────────────────
  console.log("\n\n╔════════════════════════════════════════════════════════════╗");
  console.log("║                     TEST RAPORU                           ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  let successCount = 0;
  for (const r of results) {
    const icon = r.ok ? "✅" : "❌";
    const detail = r.ok
      ? `${(r.fileCheck.size / 1024 / 1024).toFixed(2)} MB, ${r.fileCheck.duration}s`
      : r.error;
    console.log(`${icon} [${r.platform.toUpperCase()}] ${r.label}`);
    console.log(`   Süre: ${r.duration} | ${detail}\n`);
    if (r.ok) successCount++;
  }

  const total = results.length;
  const failCount = total - successCount;

  console.log("─".repeat(62));
  console.log(
    `Toplam: ${total} | ✅ Başarılı: ${successCount} | ❌ Başarısız: ${failCount}`
  );
  console.log(`Başarı Oranı: ${((successCount / total) * 100).toFixed(0)}%`);

  if (failCount > 0) {
    console.log("\n⚠️ Başarısız testler var — detayları yukarıda inceleyin.");
    process.exit(1);
  } else {
    console.log("\n🎉 Tüm testler başarılı!");
    process.exit(0);
  }
}

// ─── Playwright kurulumu yoksa yükle ────────────────────────────────────────
try {
  await import("@playwright/test");
} catch {
  console.log("📦 Playwright yükleniyor...");
  execSync("npm install -D @playwright/test playwright 2>&1", { stdio: "inherit" });
  execSync("npx playwright install chromium 2>&1", { stdio: "inherit" });
}

// İndirme klasörünü oluştur
import { mkdirSync } from "fs";
try { mkdirSync(DOWNLOAD_DIR, { recursive: true }); } catch {}

runTests().catch((err) => {
  console.error("\n💥 Test runner hatası:", err);
  process.exit(1);
});
