const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const svgPath = path.join(__dirname, "generate-favicon.svg");
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const appDir = path.join(rootDir, "app");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(appDir)) {
  fs.mkdirSync(appDir, { recursive: true });
}

async function generateFavicons() {
  console.log("🎨 Favicon üretimi başlatılıyor...");

  const svgBuffer = fs.readFileSync(svgPath);

  // 1. app/icon.png (32x32) & app/apple-icon.png (180x180)
  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(appDir, "icon.png"));
  console.log("  ✓ app/icon.png (32x32) oluşturuldu");

  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(appDir, "apple-icon.png"));
  console.log("  ✓ app/apple-icon.png (180x180) oluşturuldu");

  // 2. public/favicon-16x16.png & public/favicon-32x32.png
  await sharp(svgBuffer).resize(16, 16).png().toFile(path.join(publicDir, "favicon-16x16.png"));
  console.log("  ✓ public/favicon-16x16.png oluşturuldu");

  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(publicDir, "favicon-32x32.png"));
  console.log("  ✓ public/favicon-32x32.png oluşturuldu");

  // 3. public/favicon.ico (32x32 PNG)
  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(publicDir, "favicon.ico"));
  console.log("  ✓ public/favicon.ico oluşturuldu");

  // 4. public/android-chrome-192x192.png & 512x512.png
  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, "android-chrome-192x192.png"));
  console.log("  ✓ public/android-chrome-192x192.png oluşturuldu");

  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, "android-chrome-512x512.png"));
  console.log("  ✓ public/android-chrome-512x512.png oluşturuldu");

  console.log("✨ Tüm faviconlar başarıyla oluşturuldu!");
}

generateFavicons().catch((err) => {
  console.error("❌ Favicon üretim hatası:", err);
  process.exit(1);
});
