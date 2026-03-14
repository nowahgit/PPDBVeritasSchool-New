"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ClipboardList, 
  Plus, 
  Play, 
  CheckCircle, 
  XCircle,
  Clock,
  Settings,
  AlertTriangle,
  Loader2,
  Users
} from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface SeleksiGroup {
  nama_seleksi: string;
  waktu_seleksi: string;
  count: number;
}

export default function SeleksiListPage() {
  const [periods, setPeriods] = useState<SeleksiGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState<string | null>(null);
  const [minScore, setMinScore] = useState(75); // UI state for selection
  const [showConfig, setShowConfig] = useState<string | null>(null);
  const [showConfirmRun, setShowConfirmRun] = useState<string | null>(null);

  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchPeriods = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/seleksi/periods");
      if (res.ok) {
        const json = await res.json();
        setPeriods(json);
      }
    } catch (err) {
      console.error("Fetch periods failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const runSeleksi = async (nama_seleksi: string) => {
    setShowConfirmRun(null);
    
    setIsRunning(nama_seleksi);
    try {
      const res = await fetch("/api/seleksi/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_seleksi, nilai_minimum: minScore }),
      });
      if (res.ok) {
        const result = await res.json();
        alert(`Seleksi Selesai!\nLulus: ${result.lulus}\nTidak Lulus: ${result.tidak_lulus}`);
        setShowConfig(null);
      }
    } catch (err) {
      console.error("Run seleksi error:", err);
    } finally {
      setIsRunning(null);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Periode Seleksi</h2>
          <p className="text-sm text-[#6b7280]">Konfigurasi dan jalankan seleksi otomatis pendaftar.</p>
        </div>
        <Link 
          href="/admin/seleksi/tambah"
          className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-blue-800 transition-colors"
        >
          <Plus size={16} />
          Tambah Periode
        </Link>
      </header>

      <div className="px-8 py-6 flex flex-col gap-6">
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
          <AlertTriangle className="text-[#1e3a8a] shrink-0" size={20} />
          <p className="text-xs text-[#1e3a8a] font-medium leading-relaxed">
            Sistem akan menghitung rata-rata nilai semester 1-5 untuk setiap pendaftar yang berkasnya sudah <strong>VALID</strong>. 
            Pendaftar yang memenuhi nilai rata-rata minimum akan otomatis diubah statusnya menjadi <strong>LULUS</strong>.
          </p>
        </div>

        {/* Periods List */}
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <Loader2 className="w-8 h-8 text-[#1e3a8a] animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-400">Memuat data periode...</p>
            </div>
          ) : periods.length > 0 ? (
            periods.map((period) => (
              <div key={period.nama_seleksi} className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col md:flex-row items-stretch">
                <div className="p-6 flex-1 flex items-center gap-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-[#1e3a8a] shrink-0">
                    <ClipboardList size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#111827]">{period.nama_seleksi}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-[#6b7280] flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(period.waktu_seleksi).toLocaleDateString("id-ID")}
                      </span>
                      <span className="text-xs text-[#6b7280] flex items-center gap-1">
                        <Users size={14} />
                        {period.count} Peserta Terdaftar
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 md:border-l border-gray-100 px-6 py-6 flex items-center gap-3">
                  {showConfig === period.nama_seleksi ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nilai Min.</span>
                        <input 
                          type="number" 
                          className="w-20 p-1.5 border border-gray-200 rounded bg-white text-sm font-bold text-center"
                          value={minScore}
                          onChange={(e) => setMinScore(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <button 
                        onClick={() => setShowConfirmRun(period.nama_seleksi)}
                        disabled={isRunning === period.nama_seleksi}
                        className="bg-green-600 text-white px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 hover:bg-green-700 disabled:opacity-50 h-10 mt-4"
                      >
                        {isRunning === period.nama_seleksi ? <Loader2 className="animate-spin" size={14} /> : <Play size={14} />}
                        Jalankan
                      </button>
                      <button 
                        onClick={() => setShowConfig(null)}
                        className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-xs font-bold h-10 mt-4"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowConfig(period.nama_seleksi)}
                      className="bg-[#1e3a8a] text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-800 transition-colors shadow-sm"
                    >
                      <Settings size={14} />
                      Konfigurasi Seleksi
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-20 text-center">
              <ClipboardList size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="text-sm text-gray-400">Belum ada periode seleksi yang dibuat.</p>
              <Link href="/admin/seleksi/tambah" className="text-[#1e3a8a] text-xs font-bold mt-2 inline-block hover:underline">+ Tambah Sekarang</Link>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!showConfirmRun}
        title="Jalankan seleksi otomatis?"
        message="Sistem akan menghitung rata-rata nilai semua pendaftar dan menentukan status lulus/tidak lulus secara otomatis. Proses ini tidak bisa dibatalkan."
        confirmLabel="Ya, Jalankan"
        confirmVariant="primary"
        onConfirm={() => showConfirmRun && runSeleksi(showConfirmRun)}
        onCancel={() => setShowConfirmRun(null)}
      />
    </>
  );
}
