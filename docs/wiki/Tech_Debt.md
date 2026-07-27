---
type: node
tags: [obsidian-graph, tech_debt]
---

# Tech_Debt

- **Özet:** Gelecekte iyileştirilmesi planlanan performans optimizasyonları, geçici dosya temizlik zamanlayıcıları ve ek platform desteklerini içeren teknik borç kaydıdır.
- **Kütüphaneler:** Node.js fs, Cron, Redis
- **Bağlantılar:** [[Index]], [[Architecture_Overview]], [[YtDlp_Service]], [[FFmpeg_Transcoding]], [[Rate_Limit]], [[YouTube_Shorts_Page]], [[Testing]]

---

## 📌 Takip Edilen Teknik Borçlar

1. **Geçici Dosya Temizliği:** /temp klasöründe transcode edilen MP4 dosyalarının Redis/Cron tabanlı otomatik silinmesi.
2. **YouTube Shorts Desteği:** YouTube arama kısıtlamalarını aşacak PO-Token rotasyon servisinin eklenmesi.
3. **Proxy Pool:** İleride yoğun trafikte kullanılmak üzere döner residential proxy desteği.

---

## 🔗 İlgili Ağ Düğümleri (Graph Connections)
- [[Index]]
- [[Architecture_Overview]]
- [[YtDlp_Service]]
- [[FFmpeg_Transcoding]]
- [[Rate_Limit]]
- [[YouTube_Shorts_Page]]
- [[Testing]]
