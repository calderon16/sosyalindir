---
name: sosyalindir
description: SosyalIndir projesinde (Instagram/TikTok/YouTube Shorts/Facebook Reels indirme sitesi) kod yazarken, sayfa eklerken veya özellik geliştirirken bu dosyadaki standartlara ve kısıtlara uy.
---

# SosyalIndir — Proje Skill Dosyası

## Proje Tanımı
SosyalIndir, kullanıcının yapıştırdığı bir Instagram Reels / TikTok / YouTube Shorts / Facebook Reels linkinden videoyu **orijinal kalitede**, filigransız (TikTok için), giriş gerektirmeden indirmesini sağlayan ücretsiz bir web uygulamasıdır.

## Temel Farklılaştırıcı (her kararda bunu önceliklendir)
1. **Orijinal kalite koruma** — öncelik, H.264 (avc1) gibi evrensel uyumlu formatları hiç re-encode etmeden, gelen bitrate/çözünürlükte olduğu gibi sunmaktır (videoların büyük çoğunluğu zaten bu formatta gelir, ek işlem yapılmaz). SADECE bir video yalnızca HEVC (H.265) formatında mevcutsa — ki bu Windows/eski cihazlarda oynatma sorunu yaratır — cihaz uyumluluğu için `ffmpeg -c:v libx264 -preset fast -crf 18 -c:a copy` ile H.264'e transcode edilir (ses hiçbir zaman re-encode edilmez, sadece bu durumda görüntüde kayıpsıza yakın küçük bir kalite/CPU maliyeti kabul edilir). Gereksiz yere hiçbir formata re-encode/transcode uygulanmaz.
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

## ZORUNLU: Her Değişiklik Sonrası Otomatik Uçtan Uca Test Protokolü
Bu proje üzerinde HERHANGİ BİR görev (kod değişikliği, yeni özellik, tasarım güncellemesi, bağımlılık güncellemesi, konfigürasyon değişikliği — istisnasız hepsi) tamamlandıktan ve deploy edildikten SONRA, aşağıdaki otomatik test protokolü ÇALIŞTIRILMADAN görev "tamamlandı" sayılamaz:

1. **Araç:** Playwright (Chromium) kullanarak gerçek bir tarayıcı oturumu başlat (henüz kurulu değilse `npm install -D playwright && npx playwright install chromium` ile kur, bunu bir kere yap sonra her seferinde kullan).

2. **Test seti:** Şu an production URL'i olan https://sosyalindirapp.com adresinde, aşağıdaki gibi GERÇEK, herkese açık, güncel 5 video linkiyle test yap (linkler zamanla geçersiz olabilir, geçersizse yeni gerçek bir link bul ve onunla değiştir):
   - 2 adet Instagram Reels linki
   - 2 adet TikTok linki
   - 1 adet Facebook Reels linki

3. **Her link için otomatik akış:**
   - Sayfayı aç, URL input'una linki yapıştır, "İndir" butonuna tıkla.
   - Video önizlemesinin (başlık, thumbnail) göründüğünü doğrula.
   - İndirme butonuna tıklayıp dosyanın gerçekten inmesini bekle (Playwright'ın download event'ini yakala).
   - İnen dosyayı `ffprobe` ile analiz et: hem video hem audio stream'inin var olduğunu, süresinin >0 olduğunu, dosya boyutunun makul (>0 byte, bozuk değil) olduğunu doğrula. Mümkünse dosyayı `ffplay` veya headless bir oynatıcıyla birkaç saniye oynatıp hata çıkmadığını kontrol et.
   - Sonucu (başarılı/başarısız, hata mesajı varsa tam metni) kaydet.

4. **Raporlama:** Test bittiğinde 5 linkin her biri için ayrı ayrı ✅/❌ durumu, toplam başarı oranı ve varsa hata detaylarını özetleyen bir rapor ver. TEK BİR link bile başarısız olursa, bunu "her şey çalışıyor" gibi sunma — net şekilde hangi platformda/hangi linkte sorun olduğunu belirt.

5. **Bu protokol, yapılan değişikliğin video indirme akışıyla hiçbir ilgisi yokmuş gibi görünse bile (örn. sadece bir metin/tasarım değişikliğiyse) ATLANAMAZ** — bu projede daha önce "ilgisiz" görünen değişikliklerin video indirmeyi bozduğu defalarca yaşandı, bu yüzden her deploy sonrası bu test zorunludur.
