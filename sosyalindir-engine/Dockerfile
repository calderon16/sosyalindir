# Node 20 Slim Base Image
FROM node:20-slim

# Gerekli sistem paketleri: python3, ffmpeg, curl, ca-certificates
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# En güncel yt-dlp sürümünü indir ve çalıştırılabilir yap
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

# Çalışma dizinini ayarla
WORKDIR /app

# Bağımlılıkları kopyala ve kur
COPY package*.json ./
RUN npm ci

# Kaynak kodları kopyala ve TypeScript projesini derle
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Ortam değişkenleri
ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

# Uygulamayı başlat
CMD ["node", "dist/index.js"]
