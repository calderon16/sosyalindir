# SosyalIndir — Proje Brief

## 1. Özet
Ücretsiz, Türkçe, çoklu platform (Instagram/TikTok/YouTube Shorts/Facebook Reels) video indirme sitesi. AdSense ile gelir modeli. Sıfıra yakın altyapı maliyeti hedefi.

## 2. Site Haritası
```
/                          → Ana sayfa: tek input, link yapıştır, otomatik platform algıla
/instagram-reels-indir     → SEO landing page (Instagram özel)
/tiktok-video-indir        → SEO landing page (TikTok özel, filigransız vurgusu)
/youtube-shorts-indir      → SEO landing page (YouTube Shorts özel)
/facebook-reels-indir      → SEO landing page (Facebook özel)
/nasil-calisir             → Adım adım kullanım rehberi (tüm platformlar)
/sss                       → Sıkça sorulan sorular
/kullanim-kosullari        → Kullanım koşulları + telif uyarısı
/gizlilik-politikasi       → Gizlilik politikası
/telif-bildirimi           → Hak sahipleri için kaldırma talebi formu
/iletisim                  → İletişim formu (Resend ile)
```

## 3. Ana Sayfa Akışı (kullanıcı deneyimi)
1. Kullanıcı input'a link yapıştırır.
2. Frontend, URL pattern'inden platformu otomatik algılar (instagram.com, tiktok.com, youtube.com/shorts, facebook.com).
3. Next.js API route, backend downloader engine'e isteği proxy'ler.
4. Backend, yt-dlp ile video metadata + direkt indirme linkini çözer (orijinal kalite, re-encode yok).
5. Kullanıcıya video önizlemesi + "İndir" butonu (varsa kalite seçenekleri: HD/SD, TikTok için filigranlı/filigransız) gösterilir.
6. İndirme, backend üzerinden stream edilir; dosya sunucuda kalıcı olarak saklanmaz.

## 4. Klasör Yapısı (Frontend — Next.js 14 App Router)
```
sosyalindir/
├── app/
│   ├── page.tsx                          → Ana sayfa
│   ├── instagram-reels-indir/page.tsx
│   ├── tiktok-video-indir/page.tsx
│   ├── youtube-shorts-indir/page.tsx
│   ├── facebook-reels-indir/page.tsx
│   ├── nasil-calisir/page.tsx
│   ├── sss/page.tsx
│   ├── kullanim-kosullari/page.tsx
│   ├── gizlilik-politikasi/page.tsx
│   ├── telif-bildirimi/page.tsx
│   ├── iletisim/page.tsx
│   └── api/
│       ├── resolve/route.ts              → Platform algıla + backend'e proxy
│       └── contact/route.ts              → İletişim formu → Resend
├── components/
│   ├── UrlInput.tsx
│   ├── VideoPreviewCard.tsx
│   ├── PlatformBadge.tsx
│   ├── AdSlot.tsx
│   └── Footer.tsx / Header.tsx
├── lib/
│   ├── platformDetect.ts
│   └── rateLimiter.ts
└── public/
```

## 5. Backend Downloader Engine (ayrı servis)
```
sosyalindir-engine/
├── src/
│   ├── index.ts                          → Express server
│   ├── routes/resolve.ts                 → /resolve?url=...
│   ├── services/ytdlp.ts                 → yt-dlp wrapper (child_process)
│   └── middleware/rateLimit.ts
├── Dockerfile
└── package.json
```
Railway.app / ucuz VPS'te Docker ile deploy edilir. Vercel'deki frontend, bu servisin URL'sine ortam değişkeni (`DOWNLOADER_ENGINE_URL`) üzerinden istek atar.

## 6. Monetizasyon Yerleşimi
- AdSense: ana sayfada input'un altında ve sonuç kartının altında (içerik akışını bozmayacak, "sahte indir butonu" izlenimi vermeyecek şekilde — rakiplerin en büyük hatası bu).

## 7. MVP Kapsamı (ilk sürüm)
- [ ] Instagram Reels + TikTok (öncelik — en yüksek talep)
- [ ] YouTube Shorts + Facebook Reels (2. faz)
- [ ] Kalite seçimi (HD/SD)
- [ ] TikTok filigransız indirme
- [ ] 4 SEO landing page + nasıl-çalışır + SSS
- [ ] Yasal sayfalar (kullanım koşulları, gizlilik, telif bildirimi)
- [ ] AdSense entegrasyonu

## 8. Faz 2 (sonraki)
- Toplu indirme (birden fazla link)
- MP3 çıkarma (TikTok/Reels sesini indir)
- Instagram Story/Highlight desteği
- Tarayıcı uzantısı
