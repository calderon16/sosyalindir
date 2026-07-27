---
type: node
tags: [obsidian-graph, architecture_overview]
---

# Architecture_Overview

- **Özet:** Vercel üzerinde çalışan Next.js 14 frontend ile Railway üzerinde çalışan Express.js backend motorunun ayrık mikroservis mimarisini tanımlar.
- **Kütüphaneler:** Next.js 14, Node.js Express, Docker, Vercel Edge Network, Railway PaaS
- **Bağlantılar:** [[Index]], [[Landing_Page]], [[API_Routes]], [[API_Resolve_Proxy]], [[Express_Server]], [[API_Engine_Resolve]], [[YtDlp_Service]], [[Config]], [[Testing]], [[Docker_Container]], [[Railway_Deploy]]

---

## 🏛️ Katmanlı Mimari Şeması

Platform presentation katmanı (Next.js) ile ağır medya işleme katmanını (Express + FFmpeg) birbirinden ayırır.

- **Frontend (Vercel):** [[Landing_Page]], [[Hero]], [[Navbar]], [[Url_Input]], [[SEO_And_Schema]].
- **Proxy Katmanı:** [[API_Resolve_Proxy]], [[Platform_Detect]], [[API_Routes]].
- **Backend Motoru (Railway):** [[Express_Server]], [[API_Engine_Resolve]], [[API_Engine_Download]], [[YtDlp_Service]], [[Auto_Guest_Cookies]], [[FFmpeg_Transcoding]].
- **Güvenlik:** [[Rate_Limit]], [[Helmet_Security]], [[CORS_Middleware]].

---

## 🔗 İlgili Ağ Düğümleri (Graph Connections)
- [[Index]]
- [[Landing_Page]]
- [[API_Routes]]
- [[API_Resolve_Proxy]]
- [[Express_Server]]
- [[API_Engine_Resolve]]
- [[YtDlp_Service]]
- [[Config]]
- [[Testing]]
- [[Docker_Container]]
- [[Railway_Deploy]]
