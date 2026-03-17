"use client";

import { useState } from "react";
import { updatePassword } from "../actions";
import DialogCard from "@/components/ui/DialogCard";
import { Lock, Loader2, ShieldCheck, Key } from "lucide-react";

export default function PengaturanForm() {
  const [formData, setFormData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({ type: "success", title: "", description: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setDialogConfig({ type: "error", title: "Gagal", description: "Konfirmasi password baru tidak cocok" });
      setShowDialog(true);
      return;
    }

    setIsLoading(true);

    try {
      const res = await updatePassword(formData);
      if (res.success) {
        setDialogConfig({ type: "success", title: "Berhasil!", description: "Password akun kamu telah diperbarui." });
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setDialogConfig({ type: "error", title: "Gagal", description: res.message || "Pastikan password lama anda benar." });
      }
      setShowDialog(true);
    } catch (err) {
      setDialogConfig({ type: "error", title: "Kesalahan", description: "Terjadi kesalahan sistem." });
      setShowDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <ShieldCheck size={20} className="text-[#1e3a8a]" />
          <div>
            <h2 className="text-base font-semibold text-[#111827]">Ganti Kata Sandi</h2>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider">Password Lama</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="password"
                className="w-full bg-gray-50 border border-gray-200 rounded-md pl-10 pr-4 py-2 text-sm font-semibold focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all placeholder:text-gray-300" 
                name="oldPassword"
                placeholder="Password saat ini"
                value={formData.oldPassword} 
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider">Password Baru</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="password"
                className="w-full bg-white border border-gray-200 rounded-md pl-10 pr-4 py-2 text-sm font-semibold focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all placeholder:text-gray-300" 
                name="newPassword"
                placeholder="Password baru"
                value={formData.newPassword} 
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider">Konfirmasi Password Baru</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="password"
                className="w-full bg-white border border-gray-200 rounded-md pl-10 pr-4 py-2 text-sm font-semibold focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all placeholder:text-gray-300" 
                name="confirmPassword"
                placeholder="Ulangi password baru"
                value={formData.confirmPassword} 
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#1e3a8a] hover:bg-blue-800 text-white px-8 py-2.5 rounded-md font-bold uppercase tracking-wider text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-70"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              {isLoading ? "Memproses..." : "Perbarui Kata Sandi"}
            </button>
          </div>
        </div>
      </form>

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
