"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Lock, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Phone,
  ShieldCheck
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [profileData, setProfileData] = useState({
    username: "",
    nama_panitia: "",
    no_hp: ""
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (session?.user) {
      fetchAdminProfile();
    }
  }, [session]);

  const fetchAdminProfile = async () => {
    setIsFetching(true);
    try {
      const res = await fetch("/api/admin/profile");
      if (res.ok) {
        const data = await res.json();
        setProfileData({
          username: (session?.user as any).username || "",
          nama_panitia: data.nama_panitia || "",
          no_hp: data.no_hp || ""
        });
      } else {
        setProfileData(prev => ({
          ...prev,
          username: (session?.user as any).username || "",
        }));
      }
    } catch (error) {
      console.error("Failed to fetch admin profile", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_panitia: profileData.nama_panitia,
          no_hp: profileData.no_hp
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal update profil");

      setMessage({ type: "success", text: "Profil berhasil diperbarui." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Konfirmasi password tidak cocok." });
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setMessage({ type: "error", text: "Password baru minimal 8 karakter." });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal ubah password");

      setMessage({ type: "success", text: "Password berhasil diubah." });
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest leading-none">Memuat Pengaturan...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <h2 className="text-lg font-semibold text-[#111827]">Pengaturan Panel</h2>
        <p className="text-sm text-[#6b7280]">Kelola informasi akun dan keamanan administrator.</p>
      </header>

      <div className="px-8 py-6 flex flex-col gap-6 max-w-4xl">
        {message && (
          <div className={`p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
            message.type === "success" ? "bg-green-50 border border-green-100 text-green-700" : "bg-red-50 border border-red-100 text-red-700"
          }`}>
            {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-bold">{message.text}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Info Akun Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <User size={16} className="text-[#1e3a8a]" />
                Informasi Personal
              </h3>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Username</label>
                <input 
                  type="text" 
                  disabled
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 font-medium cursor-not-allowed"
                  value={profileData.username}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap Panitia</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:border-[#1e3a8a] focus:outline-none transition-all"
                    placeholder="Masukkan nama lengkap"
                    value={profileData.nama_panitia}
                    onChange={(e) => setProfileData({...profileData, nama_panitia: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nomor HP Aktif</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:border-[#1e3a8a] focus:outline-none transition-all"
                    placeholder="08xxxxxxxxxx"
                    value={profileData.no_hp}
                    onChange={(e) => setProfileData({...profileData, no_hp: e.target.value})}
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1e3a8a] text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all disabled:opacity-50 mt-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                Simpan Perubahan
              </button>
            </form>
          </div>

          {/* Password Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Lock size={16} className="text-[#1e3a8a]" />
                Keamanan Password
              </h3>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password Saat Ini</label>
                <input 
                  type="password" 
                  required
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#1e3a8a] focus:outline-none"
                  placeholder="Password lama"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password Baru</label>
                <input 
                  type="password" 
                  required
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#1e3a8a] focus:outline-none"
                  placeholder="Min. 8 karakter"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Konfirmasi Password</label>
                <div className="relative">
                   <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                   <input 
                    type="password" 
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#1e3a8a] focus:outline-none"
                    placeholder="Ulangi password baru"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#111827] text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50 mt-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Lock size={14} />}
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
