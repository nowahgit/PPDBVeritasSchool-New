"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Calendar, Target } from "lucide-react";

export default function TambahSeleksiPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_seleksi: "",
    waktu_seleksi: "",
    nilai_minimum: 75
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Note: Since there is no "Period" model, we just simulate or 
    // create a placeholder if the system requires it.
    // For now, we just redirect as per flow.
    setTimeout(() => {
      setIsLoading(false);
      router.push("/admin/seleksi");
    }, 1000);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Tambah Periode Seleksi</h2>
          <p className="text-sm text-[#6b7280]">Definisikan nama dan standar kelulusan periode baru.</p>
        </div>
      </header>

      <div className="px-8 py-6 max-w-2xl">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nama Seleksi</label>
                <div className="relative">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                     <Target size={18} />
                   </div>
                   <input 
                    type="text" 
                    required
                    placeholder="Contoh: SELEKSI GELOMBANG 1 2025"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#1e3a8a] focus:outline-none transition-all"
                    value={formData.nama_seleksi}
                    onChange={(e) => setFormData({ ...formData, nama_seleksi: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tanggal Pelaksanaan</label>
                <div className="relative">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                     <Calendar size={18} />
                   </div>
                   <input 
                    type="datetime-local" 
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#1e3a8a] focus:outline-none transition-all"
                    value={formData.waktu_seleksi}
                    onChange={(e) => setFormData({ ...formData, waktu_seleksi: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nilai Rata-rata Minimum</label>
                <input 
                  type="number" 
                  required
                  min={0}
                  max={100}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold focus:border-[#1e3a8a] focus:outline-none transition-all"
                  value={formData.nilai_minimum}
                  onChange={(e) => setFormData({ ...formData, nilai_minimum: parseFloat(e.target.value) || 0 })}
                />
                <p className="text-[10px] text-gray-400 font-medium italic">Rata-rata dari akumulasi nilai semester 1-5.</p>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all disabled:opacity-50 shadow-md shadow-blue-900/10 active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Simpan Periode Seleksi
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
