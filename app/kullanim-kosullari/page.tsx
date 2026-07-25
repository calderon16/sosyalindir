import type { Metadata } from "next";
import { FileText, ShieldAlert, Scale, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Kullanım Koşulları | SosyalIndir",
  description: "SosyalIndir hizmet kullanım koşulları, telif hakları sorumlulukları ve kişisel kullanım şartları.",
};

export default function TermsPage() {
  return (
    <div className="w-full py-12 md:py-16 px-4 sm:px-6 max-w-4xl mx-auto space-y-10 text-slate-300">
      
      {/* Başlık */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
          <FileText className="w-3.5 h-3.5" />
          <span>Hukuki Şartlar & Yasal Sorumluluklar</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Kullanım Koşulları
        </h1>
        <p className="text-xs text-slate-400">Son güncelleme: 25 Temmuz 2026</p>
      </div>

      {/* İçerik Kartı */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-8 text-sm leading-relaxed">
        
        {/* 1. Hizmetin Amacı */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>1. Hizmetin Amacı ve Kapsamı</span>
          </h2>
          <p>
            SosyalIndir, kullanıcıların sosyal medya platformlarında (Instagram, TikTok, YouTube, Facebook) <strong>herkese açık (public)</strong> olarak yayınlanan medya içeriklerini kişisel erişim ve çevrimdışı arşivleme amacıyla indirmelerini sağlayan teknik bir araçtır.
          </p>
        </section>

        {/* 2. Telif Hakları */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            <span>2. Telif Hakları ve Mülkiyet</span>
          </h2>
          <p>
            SosyalIndir aracılığıyla indirilen tüm videoların, görsellerin ve ses dosyalarının telif hakları, mülkiyet hakları ve fikri hakları münhasıran <strong>orijinal içerik üreticilerine ve hak sahiplerine</strong> aittir. SosyalIndir indirilen hiçbir içerik üzerinde hak iddia etmez veya sahiplik üstlenmez.
          </p>
        </section>

        {/* 3. Kişisel Kullanım ve Sorumluluk */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <span>3. Kullanıcı Sorumluluğu ve Adil Kullanım</span>
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li>
              Bu araç yalnızca <strong>kişisel ve adil kullanım (fair use)</strong> amaçları doğrultusunda kullanılabilir.
            </li>
            <li>
              İndirilen içeriklerin hak sahibinin izni olmadan <strong>ticari amaçlarla kullanılması, satılması, dağıtılması veya telif sahibinin haklarını ihlal edecek şekilde yeniden yayınlanması</strong> kesinlikle yasaktır.
            </li>
            <li>
              Kullanıcı, indirdiği içerikleri üçüncü taraflara ait hesaplardaymış gibi göstermekten veya yetkisiz kullanımdan doğacak tüm hukuki ve cezai sorumlulukların <strong>tek başına kendisine ait olduğunu</strong> kabul ve beyan eder.
            </li>
          </ul>
        </section>

        {/* 4. Sorumluluk Reddi */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Hizmet Değişiklikleri ve Sorumluluk Sınırı</h2>
          <p>
            SosyalIndir, ilgili sosyal medya platformlarının teknik yapısındaki değişikliklere bağlı olarak hizmeti durdurma, kısıtlama veya güncelleme hakkını saklı tutar. Hizmetin kesintisiz veya hatasız işleyeceğine dair garanti verilmemektedir.
          </p>
        </section>

      </div>

    </div>
  );
}
