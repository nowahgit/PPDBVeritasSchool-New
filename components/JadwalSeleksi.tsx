import React from "react";
import { Calendar, Clock, Timer } from "lucide-react";

interface Jadwal {
  id_seleksi: number;
  nama_seleksi: string;
  waktu_seleksi: Date;
  status_seleksi: string;
}

interface JadwalSeleksiProps {
  jadwal: Jadwal[];
}

const JadwalSeleksi: React.FC<JadwalSeleksiProps> = ({ jadwal }) => {
  return (
    <section id="jadwal" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16 gap-4 flex flex-col">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#111827]">Jadwal Seleksi</h2>
          <p className="text-sm md:text-base text-[#6b7280] max-w-2xl mx-auto font-medium leading-relaxed">
            Perhatikan tanggal-tanggal penting agar tidak terlewat proses seleksi akademik.
          </p>
        </div>

        {jadwal.length === 0 ? (
          <div className="bg-[#f9fafb] rounded-2xl p-12 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-300 shadow-sm">
              <Calendar size={28} />
            </div>
            <p className="text-sm text-[#6b7280] font-medium italic">Belum ada jadwal seleksi yang aktif saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jadwal.map((item) => (
              <div 
                key={item.id_seleksi}
                className="bg-[#f9fafb] p-8 rounded-2xl border border-gray-100 flex flex-col gap-6"
              >
                <div className="flex justify-between items-center">
                  <div className="p-2 bg-white rounded-lg text-primary shadow-sm">
                    <Timer size={18} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.status_seleksi === "MENUNGGU" 
                      ? "bg-amber-100 text-amber-700" 
                      : "bg-green-100 text-green-700"
                  }`}>
                    {item.status_seleksi === "MENUNGGU" ? "Mendatang" : "Terlaksana"}
                  </span>
                </div>
                
                <h3 className="text-lg font-extrabold text-[#111827]">
                  {item.nama_seleksi}
                </h3>
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-[#6b7280]">
                    <Calendar size={14} className="text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {item.waktu_seleksi.toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[#6b7280]">
                    <Clock size={14} className="text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {item.waktu_seleksi.toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })} WIB
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default JadwalSeleksi;
