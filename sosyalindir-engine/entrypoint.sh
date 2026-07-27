#!/bin/sh
set -e

echo "[entrypoint] Container başlatılıyor..."
echo "[entrypoint] yt-dlp + curl-cffi güncel sürüm kontrolü yapılıyor..."

# yt-dlp ve curl-cffi'yi her container başlangıcında güncelle
# Bu, Railway'in image cache'ini bypass ederek her zaman en güncel sürümü garantiler
pip install --no-cache-dir -U --break-system-packages "yt-dlp[default]" curl-cffi 2>/dev/null || \
  pip install --no-cache-dir -U "yt-dlp[default]" curl-cffi 2>/dev/null || \
  echo "[entrypoint] UYARI: yt-dlp/curl-cffi güncelleme başarısız, mevcut sürüm kullanılıyor."

echo "[entrypoint] yt-dlp sürümü: $(yt-dlp --version 2>/dev/null || echo 'bilinmiyor')"
echo "[entrypoint] Uygulama başlatılıyor..."

# Ana uygulamayı başlat
exec node dist/index.js
