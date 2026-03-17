"use client";

import { useState } from "react";
import { updateDataDiri } from "../actions";
import DialogCard from "@/components/ui/DialogCard";
import { Save, Loader2, User, Home, Users } from "lucide-react";

export default function DataDiriForm({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({ type: "success", title: "", description: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await updateDataDiri(formData);
      if (res.success) {
        setDialogConfig({
          type: "success",
          title: "Berhasil!",
          description: "Data diri pendaftaran kamu telah diperbarui."
        });
      } else {
        setDialogConfig({
          type: "error",
          title: "Gagal",
          description: res.message || "Terjadi kesalahan saat menyimpan data."
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      {/* Section 1: Data Akun */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <User size={18} className="text-[#1e3a8a]" />
          <h2 className="text-base font-semibold text-[#111827]">Section 1 — Data Akun</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider">Username</label>
              <input 
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2.5 text-sm font-semibold text-gray-400 cursor-not-allowed outline-none" 
                value={formData.username} 
                disabled 
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider">Email</label>
              <input 
                className="w-full bg-white border border-gray-200 rounded-md px-4 py-2.5 text-sm font-semibold focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all" 
                name="email"
                type="email"
                value={formData.email} 
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider">Jenis Kelamin</label>
              <select 
                className="w-full bg-white border border-gray-200 rounded-md px-4 py-2.5 text-sm font-semibold focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all"
                name="jenis_kelamin"
                value={formData.jenis_kelamin}
                onChange={handleChange}
                required
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider">Asal Sekolah</label>
              <input 
                className="w-full bg-white border border-gray-200 rounded-md px-4 py-2.5 text-sm font-semibold focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all" 
                name="asal_sekolah"
                value={formData.asal_sekolah} 
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Data Pribadi */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Home size={18} className="text-[#1e3a8a]" />
          <h2 className="text-base font-semibold text-[#111827]">Section 2 — Data Pribadi</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider">Nama Pendaftar</label>
              <input 
                className="w-full bg-white border border-gray-200 rounded-md px-4 py-2.5 text-sm font-semibold focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all" 
                name="nama_pendaftar"
                value={formData.nama_pendaftar} 
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider">NISN</label>
              <input 
                className="w-full bg-white border border-gray-200 rounded-md px-4 py-2.5 text-sm font-semibold focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all" 
                name="nisn_pendaftar"
                value={formData.nisn_pendaftar} 
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider">Tanggal Lahir</label>
              <input 
                className="w-full bg-white border border-gray-200 rounded-md px-4 py-2.5 text-sm font-semibold focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all" 
                name="tanggallahir_pendaftar"
                type="date"
                value={formData.tanggallahir_pendaftar} 
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider">Agama</label>
              <select 
                className="w-full bg-white border border-gray-200 rounded-md px-4 py-2.5 text-sm font-semibold focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all"
                name="agama"
                value={formData.agama}
                onChange={handleChange}
                required
              >
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Budha">Budha</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider">Alamat Pendaftar</label>
              <textarea 
                className="w-full bg-white border border-gray-200 rounded-md px-4 py-2.5 text-sm font-semibold focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all min-h-[100px]" 
                name="alamat_pendaftar"
                value={formData.alamat_pendaftar} 
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider">Prestasi (Opsional)</label>
              <textarea 
                className="w-full bg-white border border-gray-200 rounded-md px-4 py-2.5 text-sm font-semibold focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all min-h-[100px]" 
                name="prestasi"
                placeholder="Sebutkan prestasi yang pernah diraih..."
                value={formData.prestasi} 
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Data Orang Tua */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Users size={18} className="text-[#1e3a8a]" />
          <h2 className="text-base font-semibold text-[#111827]">Section 3 — Data Orang Tua</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider">Nama Orang Tua</label>
              <input 
                className="w-full bg-white border border-gray-200 rounded-md px-4 py-2.5 text-sm font-semibold focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all" 
                name="nama_ortu"
                value={formData.nama_ortu} 
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider">Pekerjaan Orang Tua</label>
              <input 
                className="w-full bg-white border border-gray-200 rounded-md px-4 py-2.5 text-sm font-semibold focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all" 
                name="pekerjaan_ortu"
                value={formData.pekerjaan_ortu} 
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider">No. HP Orang Tua</label>
              <input 
                className="w-full bg-white border border-gray-200 rounded-md px-4 py-2.5 text-sm font-semibold focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all" 
                name="no_hp_ortu"
                value={formData.no_hp_ortu} 
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider">Alamat Orang Tua</label>
              <textarea 
                className="w-full bg-white border border-gray-200 rounded-md px-4 py-2.5 text-sm font-semibold focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all min-h-[100px]" 
                name="alamat_ortu"
                value={formData.alamat_ortu} 
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#1e3a8a] hover:bg-blue-800 text-white px-8 py-3 rounded-md font-bold uppercase tracking-wider text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-70"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      <DialogCard
        isOpen={showDialog}
        type={dialogConfig.type as any}
        title={dialogConfig.title}
        description={dialogConfig.description}
        onClose={() => setShowDialog(false)}
      />
    </form>
  );
}
