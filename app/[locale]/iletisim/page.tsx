import type { Metadata } from "next";
import { MessageSquare, Mail } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = locale === "en";
  const baseUrl = "https://sosyalindirapp.com";
  const path = "/iletisim";

  return {
    title: isEn ? "Contact Us | SosyalIndir" : "İletişim | SosyalIndir",
    description: isEn ? "Get in touch with the SosyalIndir team for feedback, support, or DMCA requests." : "Görüş, öneri ve telif hakları bildirimleriniz için SosyalIndir ekibiyle iletişime geçin.",
    alternates: {
      canonical: isEn ? `${baseUrl}/en${path}` : `${baseUrl}${path}`,
      languages: { tr: `${baseUrl}${path}`, en: `${baseUrl}/en${path}`, "x-default": `${baseUrl}${path}` },
    },
  };
}

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const isEn = locale === "en";

  return (
    <div className="w-full py-16 px-4 sm:px-6 max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{isEn ? "Contact & Support" : "İletişim & Destek"}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">{isEn ? "Contact Us" : "Bize Ulaşın"}</h1>
        <p className="text-slate-400 text-sm">{isEn ? "Feel free to send us your feedback, bug reports, or DMCA notices." : "Görüşlerinizi, hata bildirimlerinizi veya telif hakkı taleplerinizi iletebilirsiniz."}</p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 text-white font-semibold">
          <Mail className="w-5 h-5 text-emerald-400" />
          <span>E-mail</span>
        </div>
        <p className="text-sm text-slate-300">iletisim@sosyalindirapp.com</p>
      </div>
    </div>
  );
}


export function generateStaticParams() {
  return [{ locale: 'tr' }, { locale: 'en' }];
}
