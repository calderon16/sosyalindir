---
name: sosyalindir
description: SosyalIndir projesinde (Instagram/TikTok/YouTube Shorts/Facebook Reels indirme sitesi) kod yazarken, sayfa eklerken veya özellik geliştirirken bu dosyadaki standartlara ve kısıtlara uy.
---

# SosyalIndir — Proje Skill Dosyası

## Proje Tanımı
SosyalIndir, kullanıcının yapıştırdığı bir Instagram Reels / TikTok / YouTube Shorts / Facebook Reels linkinden videoyu **orijinal kalitede**, filigransız (TikTok için), giriş gerektirmeden indirmesini sağlayan ücretsiz bir web uygulamasıdır.

## Temel Farklılaştırıcı (her kararda bunu önceliklendir)
1. **Orijinal kalite koruma** — sunucu videoyu yeniden encode ETMEZ. Platformdan gelen dosya, gelen bitrate/çözünürlükte olduğu gibi kullanıcıya sunulur. Bu sitenin #1 pazarlama iddiasıdır, kod tarafında da bu ilkeye sadık kal (gereksiz ffmpeg re-encode adımı ekleme).
2. Filigransız TikTok indirme seçeneği (kullanıcı isterse filigranlı da alabilir).
3. Reklamsız/sade UX — sahte "İndir" butonu, sayaç, captcha YOK. Gerçek AdSense reklamları içerik akışını bozmayacak şekilde yerleştirilir.
4. Giriş/hesap bilgisi istenmez, kullanıcı verisi ve indirilen link geçmişi sunucuda saklanmaz (privacy-first).
5. Türkçe SEO içerik — rakiplerin çoğu İngilizce, biz Türkçe uzun-kuyruk trafiğini hedefliyoruz.

## Teknoloji Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS — Vercel'de barındırılır (ücretsiz)
- **Downloader Engine (backend):** Node.js/Express servis, `yt-dlp` binary'sini çalıştırır, Docker container içinde — Railway.app free tier veya ucuz bir VPS'te barındırılır (Vercel serverless'ta persistent binary çalıştırmak güvenilir değildir)
- **Veritabanı (opsiyonel, sadece anonim analytics/rate-limit için):** Supabase free tier
- **Monetizasyon:** Google AdSense
- **Email (iletişim/telif bildirimi formu için):** Resend

## Desteklenen Platformlar (MVP)
Instagram Reels/Post/Story, TikTok (filigranlı/filigransız), YouTube Shorts, Facebook Reels

## Yasal Kurallar — KESİNLİKLE UYULACAK
- Sadece herkese açık (public) içerik işlenir; hiçbir zaman kullanıcıdan Instagram/TikTok giriş bilgisi istenmez.
- Anasayfada ve `/kullanim-kosullari` sayfasında net uyarı bulunur: içerik telif hakları orijinal içerik sahibine aittir, araç sadece kişisel/adil kullanım amaçlıdır.
- `/telif-bildirimi` sayfası ve iletişim formu bulunur (hak sahiplerinin şikayet/kaldırma talebi iletebilmesi için).
- Kullanıcının yapıştırdığı linkler ve indirdiği dosyalar sunucuda kalıcı olarak saklanmaz; indirme tamamlanınca geçici dosyalar silinir.
- Kötüye kullanımı (toplu/otomatik scraping) önlemek için IP bazlı rate limiting uygulanır.

## Kod Standartları
- TypeScript strict mode açık.
- API route'lar `/app/api/resolve/[platform]/route.ts` yapısında, her platform için ayrı resolver.
- Hata yönetimi: platformun sayfa yapısı değişirse kullanıcıya "Bu bağlantı şu anda işlenemiyor, lütfen tekrar deneyin" gibi net bir mesaj göster; sessiz çökme veya boş sayfa asla olmasın.
- Her platform için ayrı SEO landing page: `/instagram-reels-indir`, `/tiktok-video-indir`, `/youtube-shorts-indir`, `/facebook-reels-indir` — her biri Türkçe, "nasıl indirilir" adımlarını içeren özgün içerikle.
- Mobil öncelikli tasarım (kullanıcıların büyük kısmı telefondan link yapıştırıp indirecek).

## Rakip Analizi Özeti (bağlam olarak akılda tut)
İncelenen siteler: ssstik, snapinsta, indown, gramfetchr, downreels.
Tespit edilen zayıf noktalar: kalite kaybı (re-encode), agresif reklam/sahte indir butonları, captcha/sayaç sürtünmesi, Türkçe pazarda boşluk, TikTok filigran temizlemede tutarsızlık.
SosyalIndir bu boşlukları kalite + sade UX + Türkçe SEO ile kapatır.
