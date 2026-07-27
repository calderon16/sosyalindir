import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = locale === "en";
  const baseUrl = "https://sosyalindirapp.com";
  const path = "/telif-bildirimi";

  return {
    title: isEn ? "DMCA & Copyright Notice | SosyalIndir" : "Telif Bildirimi (DMCA) | SosyalIndir",
    description: isEn ? "SosyalIndir DMCA policy and copyright takedown notices." : "SosyalIndir telif hakkı ihlal bildirimleri ve DMCA prosedürü.",
    alternates: {
      canonical: isEn ? `${baseUrl}/en${path}` : `${baseUrl}${path}`,
      languages: { tr: `${baseUrl}${path}`, en: `${baseUrl}/en${path}`, "x-default": `${baseUrl}${path}` },
    },
  };
}

export default function DMCASection({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const isEn = locale === "en";

  return (
    <div className="w-full py-16 px-4 max-w-3xl mx-auto space-y-6 text-slate-300">
      <h1 className="text-3xl font-bold text-white">{isEn ? "DMCA & Copyright Notice" : "Telif Bildirimi (DMCA)"}</h1>
      <p className="text-sm leading-relaxed">{isEn ? "If you believe your copyrighted content is accessible without permission, please contact us for immediate review." : "Telif hakkı sahibi olduğunuz bir içeriğin izinsiz erişildiğini düşünüyorsanız, kaldırılması için lütfen bizimle iletişime geçin."}</p>
    </div>
  );
}


export function generateStaticParams() {
  return [{ locale: 'tr' }, { locale: 'en' }];
}
