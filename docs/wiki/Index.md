---
type: node
tags: [obsidian-graph, index]
---

# Index

- **Özet:** SosyalIndir mimari bilgi grafiğinin ana haritası ve kontrol merkezidir. Tüm UI bileşenlerini, API rotalarını, backend servislerini ve güvenlik katmanlarını bağlar.
- **Kütüphaneler:** Next.js 14, Express.js, TypeScript, TailwindCSS, yt-dlp, FFmpeg, Sharp, @next/third-parties, Schema.org
- **Bağlantılar:** [[Architecture_Overview]], [[Media_Resolution_Flow]], [[Landing_Page]], [[Navbar]], [[Hero]], [[Url_Input]], [[Video_Preview_Card]], [[API_Routes]], [[Express_Server]], [[YtDlp_Service]], [[Auto_Guest_Cookies]], [[FFmpeg_Transcoding]], [[SEO_And_Schema]], [[Analytics_GA4]], [[Config]], [[Design_System]], [[Testing]], [[Tech_Debt]]

---

## 🗺️ Master Graph Map

SosyalIndir platformunun tüm bileşenleri Obsidian Graph View üzerinde birbirine bağlı bir ağ düğümü kümesi olarak modellenmiştir.

### 📍 Temel Katmanlar
- **Mimari & Konfigürasyon:** [[Architecture_Overview]], [[Config]], [[Design_System]], [[Testing]], [[Tech_Debt]]
- **Arayüz (Frontend):** [[Landing_Page]], [[Hero]], [[Navbar]], [[Footer]], [[Url_Input]], [[Video_Preview_Card]], [[Platform_Landing_Client]], [[Ad_Slot]]
- **Platform Sayfaları:** [[Instagram_Reels_Page]], [[TikTok_Video_Page]], [[Facebook_Reels_Page]], [[YouTube_Shorts_Page]]
- **API Katmanı:** [[API_Routes]], [[API_Resolve_Proxy]], [[API_Contact]], [[Sitemap_Generator]]
- **Backend Motoru:** [[Express_Server]], [[API_Engine_Resolve]], [[API_Engine_Download]], [[YtDlp_Service]], [[Auto_Guest_Cookies]], [[FFmpeg_Transcoding]]
- **Güvenlik & Middleware:** [[Rate_Limit]], [[Helmet_Security]], [[CORS_Middleware]], [[Platform_Detect]]
- **Dağıtım & Altyapı:** [[Docker_Container]], [[Railway_Deploy]]
- **Strateji & SEO:** [[SEO_And_Schema]], [[Analytics_GA4]], [[Legal_Privacy]], [[Legal_Terms]], [[Legal_DMCA]]

---

## 🔗 İlgili Ağ Düğümleri (Graph Connections)
- [[Architecture_Overview]]
- [[Media_Resolution_Flow]]
- [[Landing_Page]]
- [[Navbar]]
- [[Hero]]
- [[Url_Input]]
- [[Video_Preview_Card]]
- [[API_Routes]]
- [[Express_Server]]
- [[YtDlp_Service]]
- [[Auto_Guest_Cookies]]
- [[FFmpeg_Transcoding]]
- [[SEO_And_Schema]]
- [[Analytics_GA4]]
- [[Config]]
- [[Design_System]]
- [[Testing]]
- [[Tech_Debt]]
