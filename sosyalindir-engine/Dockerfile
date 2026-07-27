# Node 20 Slim Base Image
FROM node:20-slim

# Gerekli sistem paketleri: python3, python3-pip, ffmpeg, curl, ca-certificates
# libssl-dev ve libffi-dev: curl-cffi derleme bağımlılıkları (Facebook bot bypass için gerekli)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-dev \
    ffmpeg \
    curl \
    ca-certificates \
    gcc \
    libssl-dev \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# yt-dlp + curl-cffi (Facebook/Meta için modern TLS/browser impersonation desteği)
# curl-cffi: yt-dlp'nin Facebook extractorı için ZORUNLU bağımlılık (2026 itibarıyla)
# --break-system-packages: Debian slim'in dışarıdan pip kurulumunu engellememesi için
ARG CACHEBUST=1
RUN pip install --no-cache-dir -U --break-system-packages \
    "yt-dlp[default]" \
    curl-cffi \
    || pip install --no-cache-dir -U \
    "yt-dlp[default]" \
    curl-cffi

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
