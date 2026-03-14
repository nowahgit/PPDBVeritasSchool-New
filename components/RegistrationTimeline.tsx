"use client";

import React from "react";
import { 
  ClipboardList, 
  CreditCard, 
  Brain, 
  MessageSquare, 
  CheckCircle2
} from "lucide-react";

const steps = [
  {
    title: "Buat Akun Portal",
    description: "Daftarkan diri secara online untuk mendapatkan akses dashboard.",
    icon: <ClipboardList size={20} />,
  },
  {
    title: "Lengkapi Berkas",
    description: "Unggah dokumen rapor dan identitas secara digital.",
    icon: <CreditCard size={20} />,
  },
  {
    title: "Verifikasi Data",
    description: "Panitia meninjau kualitas & keaslian dokumen Anda.",
    icon: <Brain size={20} />,
  },
  {
    title: "Tes Seleksi",
    description: "Tes akademik dan wawancara pembentukan karakter.",
    icon: <MessageSquare size={20} />,
  },
  {
    title: "Hasil Akhir",
    description: "Pengumuman dan proses pendaftaran ulang siswa baru.",
    icon: <CheckCircle2 size={20} />,
  },
];

const RegistrationTimeline: React.FC = () => {
  return (
    <section id="alur" className="py-24 bg-[#f9fafb]">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16 gap-4 flex flex-col">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#111827]">Prosedur Pendaftaran</h2>
          <p className="text-sm md:text-base text-[#6b7280] max-w-2xl mx-auto font-medium leading-relaxed">
            Tahapan pendaftaran transparan dan mudah yang dirancang untuk seluruh calon siswa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center gap-6 group">
              <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-200">
                {step.icon}
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-[2px]">Langkah {index + 1}</span>
                <h4 className="font-extrabold text-[#111827] text-sm">{step.title}</h4>
                <p className="text-xs text-[#6b7280] leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegistrationTimeline;
