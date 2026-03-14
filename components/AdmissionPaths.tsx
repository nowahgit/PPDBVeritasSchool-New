"use client";

import React from "react";
import { BookOpen, Trophy, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const paths = [
  {
    title: "Jalur Reguler",
    icon: <BookOpen className="w-6 h-6" />,
    badge: "Pendaftaran Umum",
    description: "Seleksi umum melalui tes akademik komprehensif dan wawancara karakter.",
    requirements: [
      "Warga Negara Indonesia (WNI)",
      "Nilai rata-rata rapor min. 80",
      "Tidak pernah tinggal kelas selama SMP",
      "Lulus SMP/MTs tahun 2024/2025"
    ],
    highlight: "Nilai Min: 80"
  },
  {
    title: "Jalur Prestasi",
    icon: <Trophy className="w-6 h-6" />,
    badge: "Penerimaan Khusus",
    description: "Bagi siswa dengan capaian luar biasa di bidang Sains, Seni, atau Olahraga.",
    requirements: [
      "Semua syarat Reguler berlaku",
      "Sertifikat Prestasi (Min. Kota)",
      "Nilai rata-rata rapor min. 85",
      "Upload bukti sertifikat asli"
    ],
    highlight: "Nilai Min: 85"
  }
];

const AdmissionPaths: React.FC = () => {
  return (
    <section id="persyaratan" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16 gap-4 flex flex-col">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#111827]">Jalur Masuk & Persyaratan</h2>
          <p className="text-sm md:text-base text-[#6b7280] max-w-2xl mx-auto font-medium leading-relaxed">
            Dua jalur utama untuk menjaring pendaftar yang siap berkembang dalam ekosistem pendidikan berkualitas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {paths.map((path, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl border border-gray-100 bg-[#f9fafb] flex flex-col gap-8 transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-white rounded-lg text-primary shadow-sm">
                  {path.icon}
                </div>
                <span className="text-[10px] font-bold text-primary px-3 py-1 bg-white rounded-full uppercase tracking-widest border border-blue-100">
                  {path.badge}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-extrabold text-[#111827]">{path.title}</h3>
                <p className="text-sm text-[#6b7280] leading-relaxed font-medium">
                  {path.description}
                </p>
              </div>

              <ul className="flex flex-col gap-3">
                {path.requirements.map((req, ridx) => (
                  <li key={ridx} className="flex gap-3 items-center">
                    <CheckCircle className="text-primary" size={16} />
                    <span className="text-sm text-[#111827] font-medium">{req}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6 border-t border-gray-200 flex justify-between items-center">
                <span className="text-xs font-bold text-[#6b7280] uppercase tracking-widest">Kriteria</span>
                <span className="text-sm font-bold text-primary">{path.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdmissionPaths;
