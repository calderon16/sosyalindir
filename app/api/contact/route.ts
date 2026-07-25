import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * SosyalIndir — İletişim ve Telif Hakkı Bildirimi E-posta Gönderim Route'u
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, link, message, type = "contact" } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Lütfen adınızı, e-posta adresinizi ve mesajınızı doldurun." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const isCopyrightNotice = type === "copyright";

    // Konu başlığı
    const subject = isCopyrightNotice
      ? `[TELİF BİLDİRİMİ] ${name} tarafından kaldırma talebi`
      : `[İLETİŞİM FORMU] ${name} bir mesaj gönderdi`;

    // E-posta metin içeriği
    const emailText = `
SosyalIndir Web Sitesinden Yeni Mesaj

Tür: ${isCopyrightNotice ? "Telif Hakkı Kaldırma Bildirimi (DMCA)" : "Genel İletişim Formu"}
Gönderen Adı: ${name}
E-posta Adresi: ${email}
İçerik Linki: ${link || "Belirtilmedi"}

Mesaj / Açıklama:
${message}
----------------------------------------
Gönderim Tarihi: ${new Date().toLocaleString("tr-TR")}
    `.trim();

    // API anahtarı ayarlanmışsa Resend ile gönder
    if (apiKey && apiKey !== "re_123456789") {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: "SosyalIndir Form <onboarding@resend.dev>",
        to: "telif@sosyalindir.com",
        subject,
        text: emailText,
        replyTo: email,
      });
    } else {
      // Dev / Test ortamı bildirimi
      console.log("[Resend Email Mock Sending]:", { subject, email, emailText });
    }

    return NextResponse.json({
      success: true,
      message: isCopyrightNotice
        ? "Telif hakkı bildiriminiz alındı. Talebiniz en kısa sürede incelenerek yanıtlanacaktır."
        : "Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.",
    });

  } catch (error) {
    console.error("[Contact API error]:", error);
    return NextResponse.json(
      { error: "E-posta gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin." },
      { status: 500 }
    );
  }
}
