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

# En güncel yt-dlp sürümünü pip ile yükle (her build'de en son PyPI sürümünü çeker)
RUN pip install --no-cache-dir -U --break-system-packages yt-dlp || pip install --no-cache-dir -U yt-dlp

# Çalışma dizinini ayarla
WORKDIR /app

# Bağımlılıkları kopyala ve kur
COPY sosyalindir-engine/package*.json ./
RUN npm ci

# Kaynak kodları kopyala ve TypeScript projesini derle
COPY sosyalindir-engine/tsconfig.json ./
COPY sosyalindir-engine/src ./src
RUN npm run build

# Ortam değişkenleri
ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

# Uygulamayı başlat
CMD ["node", "dist/index.js"]
