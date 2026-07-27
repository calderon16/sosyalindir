# Node 20 Slim Base Image
FROM node:20-slim

# Gerekli sistem paketleri: python3, python3-pip, ffmpeg, curl, ca-certificates
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# En güncel yt-dlp sürümünü pip ile yükle
# --no-cache-dir: pip cache kullanmaz (her zaman taze indirme)
# -U: mevcut sürümü günceller (upgrade)
# NOT: Ayrıca entrypoint.sh her container başlangıcında da güncelleme yapar
RUN pip install --no-cache-dir -U --break-system-packages yt-dlp || pip install --no-cache-dir -U yt-dlp

# yt-dlp sürümünü build loguna yaz (doğrulama için)
RUN echo "Build zamanı yt-dlp sürümü: $(yt-dlp --version)"

# Çalışma dizinini ayarla
WORKDIR /app

# Bağımlılıkları kopyala ve kur
COPY package*.json ./
RUN npm ci

# Kaynak kodları kopyala ve TypeScript projesini derle
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Entrypoint script'ini kopyala ve çalıştırılabilir yap
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Ortam değişkenleri
ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

# Her container başlangıcında yt-dlp güncelleme + uygulama başlatma
CMD ["./entrypoint.sh"]
