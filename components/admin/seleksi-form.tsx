"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Info } from "lucide-react";

interface SeleksiFormProps {
  userId: number;
  panitiaId: number;
  initialData: any;
}

export default function SeleksiForm({ userId, panitiaId, initialData }: SeleksiFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nilai_smt1: initialData?.nilai_smt1 || 0,
    nilai_smt2: initialData?.nilai_smt2 || 0,
    nilai_smt3: initialData?.nilai_smt3 || 0,
    nilai_smt4: initialData?.nilai_smt4 || 0,
    nilai_smt5: initialData?.nilai_smt5 || 0,
    status_seleksi: initialData?.status_seleksi || "MENUNGGU",
    nama_seleksi: initialData?.nama_seleksi || "Seleksi Akademik Rapor",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const average = (
    (Number(formData.nilai_smt1) + 
     Number(formData.nilai_smt2) + 
     Number(formData.nilai_smt3) + 
     Number(formData.nilai_smt4) + 
     Number(formData.nilai_smt5)) / 5
  ).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const endpoint = "/api/seleksi";
      const method = "POST"; // Upsert logic in API

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          userId, 
          panitiaId,
          // Ensure numbers are floats
          nilai_smt1: parseFloat(formData.nilai_smt1.toString()),
          nilai_smt2: parseFloat(formData.nilai_smt2.toString()),
          nilai_smt3: parseFloat(formData.nilai_smt3.toString()),
          nilai_smt4: parseFloat(formData.nilai_smt4.toString()),
          nilai_smt5: parseFloat(formData.nilai_smt5.toString()),
          waktu_seleksi: new Date().toISOString()
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data seleksi");

      setMessage({ type: "success", text: "Data seleksi berhasil disimpan" });
      router.refresh();
      setTimeout(() => router.push("/admin/seleksi"), 1500);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-[8px] text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10 focus:outline-none focus:border-primary transition-fast";

  return (
    <div className="bg-white p-8 rounded-[8px] border border-[#E5E7EB] shadow-subtle space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {message.text && (
          <div className={`p-4 rounded-[6px] text-xs font-bold border ${
            message.type === "success" ? "bg-success/5 border-success/20 text-success" : "bg-danger/5 border-danger/20 text-danger"
          }`}>
            {message.text}
          </div>
        )}

        {/* Nilai Inputs */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <Info size={18} />
            <h4 className="text-sm font-extrabold uppercase tracking-wider">Input Nilai Rapor (0-100)</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((smt) => (
              <div key={smt} className="space-y-2">
                <label className="text-[10px] font-extrabold text-text-muted uppercase">Smt {smt}</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  required
                  value={formData[`nilai_smt${smt}` as keyof typeof formData]}
                  onChange={(e) => setFormData({ ...formData, [`nilai_smt${smt}`]: e.target.value })}
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          <div className="bg-[#F9FAFB] p-6 rounded-[8px] border border-[#E5E7EB] flex justify-between items-center">
            <div>
              <p className="text-[10px] font-extrabold text-text-muted uppercase mb-1">Perhitungan Rata-rata</p>
              <p className="text-sm font-medium text-text-primary">Semester 1 sampai Semester 5</p>
            </div>
            <div className="text-right">
              <span className={`text-3xl font-extrabold ${parseFloat(average) >= 75 ? 'text-success' : 'text-danger'}`}>
                {average}
              </span>
            </div>
          </div>
        </div>

        {/* Status Selection */}
        <div className="space-y-6 pt-6 border-t border-[#F3F4F6]">
          <div className="flex flex-col gap-4">
            <label className="text-sm font-bold text-text-primary">Status Kelulusan</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { val: "MENUNGGU", label: "MENUNGGU", color: "border-warning text-warning" },
                { val: "LULUS", label: "LULUS", color: "border-success text-success" },
                { val: "TIDAK_LULUS", label: "TIDAK LULUS", color: "border-danger text-danger" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setFormData({ ...formData, status_seleksi: opt.val as any })}
                  className={`py-3 rounded-[6px] text-xs font-extrabold border-2 transition-fast ${
                    formData.status_seleksi === opt.val 
                      ? (opt.val === "LULUS" ? "bg-success border-success text-white shadow-sm" : opt.val === "TIDAK_LULUS" ? "bg-danger border-danger text-white shadow-sm" : "bg-warning border-warning text-white shadow-sm")
                      : `bg-white ${opt.color} opacity-60 hover:opacity-100`
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-4 rounded-[8px] font-bold transition-fast hover:bg-primary/95 flex items-center justify-center gap-2 shadow-subtle disabled:opacity-70"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Save size={20} />
              <span>Simpan & Selesaikan Seleksi</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
