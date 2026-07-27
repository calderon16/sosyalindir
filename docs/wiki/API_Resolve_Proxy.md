---
type: node
tags: [obsidian-graph, api_resolve_proxy]
---

# API_Resolve_Proxy

- **Özet:** Vercel üzerinde çalışan, istemci isteklerini doğrulayıp Railway Engine sunucusuna güvenli proxy ile ileten Serverless rotadır (app/api/resolve/route.ts).
- **Kütüphaneler:** Next.js NextRequest/NextResponse
- **Bağlantılar:** [[Index]], [[Architecture_Overview]], [[API_Routes]], [[Url_Input]], [[Platform_Detect]], [[API_Engine_Resolve]], [[Rate_Limit]], [[CORS_Middleware]]

---

## 🛡️ Vercel Proxy Mantığı

- Railway backend IP adresini gizler ve SSRF saldırılarını engeller.

---

## 🔗 İlgili Ağ Düğümleri (Graph Connections)
- [[Index]]
- [[Architecture_Overview]]
- [[API_Routes]]
- [[Url_Input]]
- [[Platform_Detect]]
- [[API_Engine_Resolve]]
- [[Rate_Limit]]
- [[CORS_Middleware]]
