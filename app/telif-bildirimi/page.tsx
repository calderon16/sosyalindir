"use client";

import React, { useState } from "react";
import { Scale, CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";

export default function CopyrightNoticePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    link: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          type: "copyright",
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Form gönderilirken bir hata oluştu.");
      }

      setSuccessMsg(json.message || "Telif hakkı bildiriminiz alındı.");
      setFormData({ name: "", email: "", link: "", message: "" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Form gönderilemedi, lütfen tekrar deneyin.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full py-12 md:py-16 px-4 sm:px-6 max-w-3xl mx-auto space-y-10">
      
      {/* Başlık */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20">
          <Scale className="w-3.5 h-3.5" />
          <span>DMCA & Telif Hakkı Kaldırma Bildirimi</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Telif Hakkı Bildirimi (Takedown Notice)
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          SosyalIndir başkalarının fikri mülkiyet haklarına saygı duyar. Telif hakkı sahibi olduğunuz bir içeriğin bu araç üzerinden indirilebilir durumda olduğunu düşünüyorsanız aşağıdaki formu doldurarak kaldırma talebinde bulunabilirsiniz.
        </p>
      </div>

      {/* Form Kartı */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
        
        {successMsg ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-start gap-3 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Bildiriminiz Alındı</strong>
              <span>{successMsg}</span>
            </div>
          </div>
        ) : null}

        {errorMsg ? (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Adınız Soyadınız / Firma Unvanı *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Örn: Ahmet Yılmaz veya ABC Medya A.Ş."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              İletişim E-posta Adresi *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="telif@firmaniz.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Telif Hakkına Konu İçerik Bağlantısı (URL) *
            </label>
            <input
              type="url"
              required
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://instagram.com/reel/... veya https://tiktok.com/..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Telif Hakkı Sahipliği Açıklaması ve Kanıtı *
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Lütfen içeriğin hak sahibi olduğunuzu doğrulayan detayları ve kaldırma talebinizin gerekçesini açıklayın..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Gönderiliyor...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Telif Bildirimini Gönder</span>
              </>
            )}
          </button>
        </form>

      </div>

    </div>
  );
}
