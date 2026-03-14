"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Minus, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Kapan batas akhir pendaftaran PPDB?",
    answer: "Pendaftaran gelombang pertama dibuka hingga 30 Mei 2025. Namun, pendaftaran dapat ditutup lebih awal jika kuota sudah terpenuhi."
  },
  {
    question: "Apa saja dokumen yang harus disiapkan?",
    answer: "Anda perlu menyiapkan scan rapor semester 1-5, kartu keluarga, akta kelahiran, dan sertifikat prestasi jika mendaftar melalui jalur prestasi."
  },
  {
    question: "Bagaimana sistem seleksi akademik dilakukan?",
    answer: "Seleksi akademik dilakukan secara berkala melalui tes potensi akademik dan wawancara karakter yang dijadwalkan setelah berkas Anda divalidasi."
  },
  {
    question: "Apakah ada biaya pendaftaran?",
    answer: "Biaya pendaftaran adalah Rp 250.000 yang mencakup biaya tes akademik, psikotes, dan administrasi pendaftaran."
  }
];

const FAQSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16 gap-4 flex flex-col">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#111827]">Pertanyaan Sering Diajukan</h2>
          <p className="text-sm md:text-base text-[#6b7280] max-w-2xl mx-auto font-medium leading-relaxed">
            Temukan jawaban cepat untuk pertanyaan umum seputar proses pendaftaran dan seleksi lingkungan sekolah.
          </p>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-gray-100 rounded-xl overflow-hidden bg-[#f9fafb]"
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-all duration-200"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-sm md:text-base font-bold text-[#111827] pr-8">
                  {faq.question}
                </span>
                <span className="text-primary shrink-0">
                  {activeIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 text-sm text-[#6b7280] leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-blue-50/50 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-100">
          <div className="text-center md:text-left">
            <h4 className="text-lg font-extrabold text-[#111827]">Masih punya pertanyaan lain?</h4>
            <p className="text-sm text-[#6b7280] font-medium mt-1">Tim admin kami siap membantu Anda melalui layanan WhatsApp.</p>
          </div>
          <Link
            href="https://wa.me/6281234567890"
            className="flex items-center gap-2 bg-[#1e3a8a] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#1e3a8a]/90 transition-all"
          >
            <MessageCircle size={18} />
            <span>Hubungi Admin Humas</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
