---
type: node
tags: [obsidian-graph, testing]
---

# Testing

- **Özet:** Uçtan uca regresyon testleri, API doğrulama betikleri ve schema.org doğrulama süreçlerini yöneten test altyapısı düğümüdür.
- **Kütüphaneler:** Node.js HTTP Client, validator.schema.org API
- **Bağlantılar:** [[Index]], [[Architecture_Overview]], [[Media_Resolution_Flow]], [[API_Resolve_Proxy]], [[API_Engine_Resolve]], [[YtDlp_Service]], [[FFmpeg_Transcoding]], [[SEO_And_Schema]], [[Config]], [[Tech_Debt]]

---

## 🧪 Test Prosedürleri ve Betikler

- **Canlı Medya Regresyon Testi:** Gerçek Instagram, TikTok ve Facebook bağlantıları ile uçtan uca indirme doğrulaması.
- **Schema.org Doğrulaması:** validator.schema.org API POST testleri ile @graph JSON-LD kontrolü.
- **Transcode Testi:** FFmpeg SIGKILL ve zaman aşımı senaryolarının yük testleri.

---

## 🔗 İlgili Ağ Düğümleri (Graph Connections)
- [[Index]]
- [[Architecture_Overview]]
- [[Media_Resolution_Flow]]
- [[API_Resolve_Proxy]]
- [[API_Engine_Resolve]]
- [[YtDlp_Service]]
- [[FFmpeg_Transcoding]]
- [[SEO_And_Schema]]
- [[Config]]
- [[Tech_Debt]]
