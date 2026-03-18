"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Settings as SettingsIcon,
  ShieldCheck
} from "lucide-react";

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [errorProfile, setErrorProfile] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [successProfile, setSuccessProfile] = useState(false);
  const [successPassword, setSuccessPassword] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingProfile(true);
    setErrorProfile("");
    setSuccessProfile(false);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal update profil");

      setSuccessProfile(true);
      await update(); // Update session
    } catch (err: any) {
      setErrorProfile(err.message);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorPassword("Konfirmasi password tidak cocok");
      return;
    }

    setIsLoadingPassword(true);
    setErrorPassword("");
    setSuccessPassword(false);

    try {
      const res = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal ubah password");

      setSuccessPassword(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setErrorPassword(err.message);
    } finally {
      setIsLoadingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-blue-50 rounded-lg text-[#1e3a8a]">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Pengaturan Akun</h1>
          <p className="text-sm text-[#6b7280]">Kelola informasi profil dan keamanan akun kamu.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Info Akun */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
            <User size={18} className="text-gray-400" />
            <h2 className="text-base font-bold text-[#111827] uppercase tracking-wider">Info Akun</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Username</label>
              <p className="text-sm font-bold text-[#111827] bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-100 italic">
                {session?.user?.username || "Loading..."}
              </p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Alamat Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all font-medium"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              {successProfile && (
                <div className="bg-green-50 border border-green-100 text-green-700 text-xs p-3 rounded-lg flex items-center gap-2 font-bold animate-in fade-in duration-300">
                  <CheckCircle size={14} />
                  Profil berhasil diperbarui.
                </div>
              )}

              {errorProfile && (
                <div className="bg-red-50 border border-red-100 text-red-700 text-xs p-3 rounded-lg flex items-center gap-2 font-bold animate-in fade-in duration-300">
                  <AlertCircle size={14} />
                  {errorProfile}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoadingProfile}
                className="w-full bg-[#1e3a8a] text-white py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-blue-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoadingProfile ? <Loader2 className="animate-spin" size={14} /> : "Simpan Perubahan"}
              </button>
            </form>
          </div>
        </div>

        {/* Card 2: Ubah Password */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
            <ShieldCheck size={18} className="text-gray-400" />
            <h2 className="text-base font-bold text-[#111827] uppercase tracking-wider">Ubah Password</h2>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Password Lama</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showOld ? "text" : "password"}
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Password Baru</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showNew ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all font-medium"
                  placeholder="Min. 8 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Konfirmasi Password Baru</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all font-medium ${
                    confirmPassword && newPassword !== confirmPassword ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Ulangi password baru"
                />
              </div>
            </div>

            {successPassword && (
              <div className="bg-green-50 border border-green-100 text-green-700 text-xs p-3 rounded-lg flex items-center gap-2 font-bold animate-in fade-in duration-300">
                <CheckCircle size={14} />
                Password berhasil diubah.
              </div>
            )}

            {errorPassword && (
              <div className="bg-red-50 border border-red-100 text-red-700 text-xs p-3 rounded-lg flex items-center gap-2 font-bold animate-in fade-in duration-300">
                <AlertCircle size={14} />
                {errorPassword}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoadingPassword}
              className="w-full bg-[#111827] text-white py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoadingPassword ? <Loader2 className="animate-spin" size={14} /> : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
