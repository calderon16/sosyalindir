import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = locale === "en";
  const baseUrl = "https://sosyalindirapp.com";
  const path = "/gizlilik-politikasi";

  return {
    title: isEn ? "Privacy Policy | SosyalIndir" : "Gizlilik Politikası | SosyalIndir",
    description: isEn ? "SosyalIndir privacy policy and data retention principles." : "SosyalIndir gizlilik politikası ve kişisel verilerin korunması prensipleri.",
    alternates: {
      canonical: isEn ? `${baseUrl}/en${path}` : `${baseUrl}${path}`,
      languages: { tr: `${baseUrl}${path}`, en: `${baseUrl}/en${path}`, "x-default": `${baseUrl}${path}` },
    },
  };
}

export default function PrivacyPolicyPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const isEn = locale === "en";

  return (
    <div className="w-full py-16 px-4 max-w-3xl mx-auto space-y-6 text-slate-300">
      <h1 className="text-3xl font-bold text-white">{isEn ? "Privacy Policy" : "Gizlilik Politikası"}</h1>
      <p className="text-sm leading-relaxed">{isEn ? "We respect your privacy. No personal user data or video files are stored on our servers." : "Gizliliğinize önem veriyoruz. Sunucularımızda hiçbir kişisel veri veya indirilen video dosyası saklanmaz."}</p>
    </div>
  );
}


export function generateStaticParams() {
  return [{ locale: 'tr' }, { locale: 'en' }];
}
