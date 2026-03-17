"use client";

import { useState } from "react";
import { uploadBerkas } from "../actions";
import DialogCard from "@/components/ui/DialogCard";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Upload, 
  Loader2, 
  ExternalLink,
  AlertCircle
} from "lucide-react";

export default function BerkasClient({ berkas }: { berkas: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({ type: "success", title: "", description: "" });

  const handleSimulateUpload = async () => {
    setIsLoading(true);
    // Simulating file upload - in real app would use a proper upload handler
    const simulatedPath = `/uploads/berkas_${berkas.user_id}_${Date.now()}.pdf`;
    
    try {
      const res = await uploadBerkas(simulatedPath);
      if (res.success) {
        setDialogConfig({
          type: "success",
          title: "Berhasil!",
          description: "Berkas kamu telah diunggah dan sedang menunggu validasi."
        });
      } else {
        setDialogConfig({
          type: "error",
          title: "Gagal",
          description: res.message || "Terjadi kesalahan saat mengunggah berkas."
        });
      }
      setShowDialog(true);
    } catch (err) {
      setDialogConfig({
        type: "error",
        title: "Kesalahan",
        description: "Terjadi kesalahan sistem."
      });
      setShowDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  const statusColors: any = {
    MENUNGGU: "bg-blue-50 text-blue-600 border-blue-100",
    VALID: "bg-green-50 text-green-600 border-green-100",
    DITOLAK: "bg-red-50 text-red-600 border-red-100",
  };

  const StatusIcon = berkas.status_validasi === "VALID" ? CheckCircle : 
                    berkas.status_validasi === "DITOLAK" ? XCircle : Clock;

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${statusColors[berkas.status_validasi].split(' text')[0]}`}>
              <StatusIcon size={24} className={statusColors[berkas.status_validasi].split('border')[0]} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-1">Status Validasi</p>
              <h2 className={`text-lg font-bold uppercase tracking-tight ${statusColors[berkas.status_validasi].split(' border')[0]}`}>
                {berkas.status_validasi}
              </h2>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-2 rounded-md">
            <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">Tanggal Validasi</p>
            <p className="text-sm font-semibold text-[#111827]">
              {berkas.tanggal_validasi 
                ? new Date(berkas.tanggal_validasi).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                : "Belum Divalidasi"}
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-1">Jenis Berkas</p>
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-[#1e3a8a]" />
                  <span className="text-sm font-semibold text-[#111827]">{berkas.jenis_berkas}</span>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-1">File Pendaftaran</p>
                {berkas.file_path ? (
                  <a 
                    href={berkas.file_path} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#1e3a8a] hover:underline text-sm font-bold transition-all"
                  >
                    Lihat Berkas <ExternalLink size={14} />
                  </a>
                ) : (
                  <span className="text-sm font-semibold text-gray-400 italic">Belum ada file diunggah</span>
                )}
              </div>
            </div>

            {berkas.status_validasi === "DITOLAK" && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-red-600 mb-1">
                  <AlertCircle size={16} />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Catatan Admin</h4>
                </div>
                <p className="text-sm text-red-700 leading-relaxed font-medium italic">
                  "{berkas.catatan || "Tidak ada catatan khusus."}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Section */}
      {(!berkas.file_path || berkas.status_validasi === "DITOLAK") && (
        <div className="bg-[#111827] rounded-lg p-10 text-white shadow-sm text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
            <Upload size={28} className="text-blue-400" />
          </div>
          <div className="max-w-md">
            <h3 className="text-lg font-bold uppercase">Unggah Berkas Pendaftaran</h3>
            <p className="text-gray-400 text-sm mt-1">
              Format PDF maksimal 2MB. Berkas akan divalidasi oleh panitia.
            </p>
          </div>
          
          <button
            onClick={handleSimulateUpload}
            disabled={isLoading}
            className="bg-white text-[#111827] px-8 py-3 rounded-md font-bold uppercase tracking-wider text-xs flex items-center gap-3 hover:bg-gray-100 transition-all disabled:opacity-70 mt-2"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            {isLoading ? "Mengunggah..." : "Pilih & Unggah File"}
          </button>
        </div>
      )}

      <DialogCard
        isOpen={showDialog}
        type={dialogConfig.type as any}
        title={dialogConfig.title}
        description={dialogConfig.description}
        onClose={() => setShowDialog(false)}
      />
    </div>
  );
}
