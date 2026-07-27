---
type: node
tags: [obsidian-graph, media_resolution_flow]
---

# Media_Resolution_Flow

- **Özet:** Kullanıcının URL girmesinden itibaren medya metadatasının çıkarılması, format dönüşümü ve MP4 indirmesine kadar geçen uçtan uca veri akış şemasıdır.
- **Kütüphaneler:** Next.js Fetch API, Express Stream, yt-dlp, FFmpeg
- **Bağlantılar:** [[Index]], [[Architecture_Overview]], [[Url_Input]], [[Video_Preview_Card]], [[Platform_Detect]], [[API_Resolve_Proxy]], [[API_Engine_Resolve]], [[YtDlp_Service]], [[Auto_Guest_Cookies]], [[FFmpeg_Transcoding]], [[API_Engine_Download]], [[Analytics_GA4]]

---

## 🔄 Uçtan Uca Medya Akış Adımları

1. [[Url_Input]] üzerinden bağlantı yapıştırılır ve [[Platform_Detect]] ile regex kontrolü yapılır.
2. [[API_Resolve_Proxy]] isteği doğrular ve [[Express_Server]] üzerindeki [[API_Engine_Resolve]] rotasına iletir.
3. [[Auto_Guest_Cookies]] ile canlı Meta misafir çerezleri alınır ve [[YtDlp_Service]] çalıştırılır.
4. Gerekirse [[FFmpeg_Transcoding]] ile video H.264/AAC MP4 formatına dönüştürülür.
5. [[Video_Preview_Card]] üzerinde indirme linki sunulur, [[Analytics_GA4]] ile olay kaydedilir ve [[API_Engine_Download]] üzerinden MP4 indirilir.

---

## 🔗 İlgili Ağ Düğümleri (Graph Connections)
- [[Index]]
- [[Architecture_Overview]]
- [[Url_Input]]
- [[Video_Preview_Card]]
- [[Platform_Detect]]
- [[API_Resolve_Proxy]]
- [[API_Engine_Resolve]]
- [[YtDlp_Service]]
- [[Auto_Guest_Cookies]]
- [[FFmpeg_Transcoding]]
- [[API_Engine_Download]]
- [[Analytics_GA4]]
