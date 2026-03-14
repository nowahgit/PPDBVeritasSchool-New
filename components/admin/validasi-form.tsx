"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2, Save } from "lucide-react";

interface ValidasiFormProps {
  id_berkas: number;
  status: string;
  catatan: string;
}

export default function ValidasiForm({ id_berkas, status: initialStatus, catatan: initialCatatan }: ValidasiFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [catatan, setCatatan] = useState(initialCatatan);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSave = async () => {
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`/api/berkas/${id_berkas}/validasi`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_validasi: status, catatan }),
      });

      if (!res.ok) throw new Error("Gagal mengupdate status pendaftaran");

      setMessage({ type: "success", text: "Status pendaftaran berhasil diperbarui" });
      router.refresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[8px] border border-[#E5E7EB] shadow-subtle space-y-6">
      <h3 className="text-lg font-bold text-primary mb-2">Validasi Pendaftaran</h3>
      
      {message.text && (
        <div className={`p-4 rounded-[6px] text-xs font-bold border ${
          message.type === "success" 
            ? "bg-success/5 border-success/20 text-success" 
            : "bg-danger/5 border-danger/20 text-danger"
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <label className="text-sm font-bold text-text-primary block">Status Validasi</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setStatus("VALID")}
            className={`flex items-center justify-center gap-2 py-3 rounded-[6px] font-bold text-xs transition-fast border-2 ${
              status === "VALID" 
                ? "bg-success border-success text-white shadow-sm" 
                : "bg-white border-[#E5E7EB] text-text-muted hover:border-success/30 hover:text-success"
            }`}
          >
            <CheckCircle size={16} />
            VALID
          </button>
          <button
            type="button"
            onClick={() => setStatus("DITOLAK")}
            className={`flex items-center justify-center gap-2 py-3 rounded-[6px] font-bold text-xs transition-fast border-2 ${
              status === "DITOLAK" 
                ? "bg-danger border-danger text-white shadow-sm" 
                : "bg-white border-[#E5E7EB] text-text-muted hover:border-danger/30 hover:text-danger"
            }`}
          >
            <XCircle size={16} />
            DITOLAK
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-text-primary" htmlFor="catatan">Catatan / Alasan Penolakan</label>
        <textarea
          id="catatan"
          rows={4}
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          className="w-full px-4 py-3 rounded-[8px] border border-[#E5E7EB] focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm resize-none transition-fast"
          placeholder="Tambahkan catatan jika berkas divalidasi atau alasan jika ditolak..."
        />
      </div>

      <button
        onClick={handleSave}
        disabled={isLoading || status === "MENUNGGU"}
        className="w-full bg-primary text-white py-4 rounded-[8px] font-bold transition-fast hover:bg-primary/95 flex items-center justify-center gap-2 disabled:opacity-70 shadow-subtle"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            <Save size={20} />
            <span>Simpan Perubahan</span>
          </>
        )}
      </button>
      
      <p className="text-[10px] text-text-muted text-center font-medium italic">
        * Status "MENUNGGU" akan berubah menjadi "VALID" atau "DITOLAK" setelah disimpan.
      </p>
    </div>
  );
}
