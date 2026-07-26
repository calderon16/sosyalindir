import type { Metadata } from "next";
import { ShieldCheck, HardDrive, Lock, Cookie } from "lucide-react";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | SosyalIndir",
  description: "SosyalIndir gizlilik politikası, veri saklamama garantisi ve çerez (cookie) bildirimleri.",
};

export default function PrivacyPage() {
  return (
    <div className="w-full py-12 md:py-16 px-4 sm:px-6 max-w-4xl mx-auto space-y-10 text-slate-300">
      
      {/* Başlık */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Kişisel Veri Gizliliği</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Gizlilik Politikası
        </h1>
        <p className="text-xs text-slate-400">Son güncelleme: 26 Temmuz 2026</p>
      </div>

      {/* İçerik Kartı */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-8 text-sm leading-relaxed">
        
        {/* 1. Veri Saklamama Garantisi */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-emerald-400" />
            <span>1. Sunucuda Dosya ve Link Saklamama Garantisi</span>
          </h2>
          <p>
            SosyalIndir, kullanıcıların indirmek amacıyla forma yapıştırdığı video bağlantılarını veya indirilen medya dosyalarını <strong>sunucularında kalıcı olarak saklamaz veya depolamaz</strong>. İndirme işlemleri anlık medya akışı (proxy streaming) yöntemiyle doğrudan kaynağı ile sizin cihazınız arasında gerçekleşir.
          </p>
        </section>

        {/* 2. Kullanıcı Kaydı */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <span>2. Üyelik ve Kimlik Bilgileri</span>
          </h2>
          <p>
            Sitemizde <strong>kullanıcı kaydı, giriş yapma veya hesap oluşturma zorunluluğu bulunmamaktadır</strong>. SosyalIndir sizden ad, soyad, e-posta veya sosyal medya hesap şifresi gibi kişisel bilgileri talep etmez.
          </p>
        </section>

        {/* 3. İstatistik ve Çerezler */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cookie className="w-5 h-5 text-emerald-400" />
            <span>3. Çerezler (Cookies) ve Analitik Veriler</span>
          </h2>
          <p className="text-slate-300">
            Sitemizde ziyaretçi istatistiklerini anlamak için Google Analytics kullanılmaktadır. Bu araç, çerezler aracılığıyla anonim kullanım verileri toplar (hangi sayfaların ziyaret edildiği, hangi platform linklerinin indirildiği gibi). Bu veriler kişisel kimlik bilgisiyle ilişkilendirilmez.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-300 pt-2">
            <li>
              <strong>Kullanım İstatistikleri:</strong> Hizmet kalitesini artırmak ve performans takibi yapmak amacıyla yalnızca <strong>anonim ve kişisel olmayan</strong> genel istatistiksel veriler (Google Analytics 4 vb.) toplanabilir.
            </li>
            <li>
              <strong>Üçüncü Taraf Reklam Çerezleri (Google AdSense):</strong> Sitemizde gösterilen reklamlar kapsamında Google AdSense gibi üçüncü taraf sağlayıcılar, kullanıcılara ilgi alanlarına göre reklam sunmak amacıyla tarayıcınıza çerez (cookie) yerleştirebilir.
            </li>
          </ul>
        </section>

        {/* 4. İletişim */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. İletişim ve Haklarınız</h2>
          <p>
            Gizlilik politikamız ile ilgili soru veya görüşleriniz için <a href="/iletisim" className="text-emerald-400 underline">iletişim sayfamız</a> üzerinden bizimle iletişime geçebilirsiniz.
          </p>
        </section>

      </div>

    </div>
  );
}
