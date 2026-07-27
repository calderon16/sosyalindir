import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = locale === "en";
  const baseUrl = "https://sosyalindirapp.com";
  const path = "/kullanim-kosullari";

  return {
    title: isEn ? "Terms of Service | SosyalIndir" : "Kullanım Koşulları | SosyalIndir",
    description: isEn ? "SosyalIndir terms of service and usage guidelines." : "SosyalIndir kullanım koşulları ve hizmet şartları.",
    alternates: {
      canonical: isEn ? `${baseUrl}/en${path}` : `${baseUrl}${path}`,
      languages: { tr: `${baseUrl}${path}`, en: `${baseUrl}/en${path}`, "x-default": `${baseUrl}${path}` },
    },
  };
}

export default function TermsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const isEn = locale === "en";

  return (
    <div className="w-full py-16 px-4 max-w-3xl mx-auto space-y-6 text-slate-300">
      <h1 className="text-3xl font-bold text-white">{isEn ? "Terms of Service" : "Kullanım Koşulları"}</h1>
      <p className="text-sm leading-relaxed">{isEn ? "By using SosyalIndir, you agree to download content solely for personal use and respect copyright laws." : "SosyalIndir'i kullanarak, içerikleri yalnızca kişisel kullanım amacıyla indireceğinizi ve telif haklarına uyacağınızı kabul etmiş olursunuz."}</p>
    </div>
  );
}


export function generateStaticParams() {
  return [{ locale: 'tr' }, { locale: 'en' }];
}
