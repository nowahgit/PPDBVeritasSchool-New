"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  ShieldCheck, 
  ClipboardList, 
  CheckCircle,
  UserPlus
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Password Strength Logic
  const strength = useMemo(() => {
    if (!password) return { label: "", color: "bg-gray-100", width: "0%" };
    if (password.length < 6) return { label: "Lemah", color: "bg-red-500", width: "33%" };
    if (password.length < 8) return { label: "Cukup", color: "bg-yellow-500", width: "66%" };
    return { label: "Kuat", color: "bg-green-500", width: "100%" };
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (username.length < 4 || username.includes(" ")) {
      setError("Username minimal 4 karakter dan tanpa spasi.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Pendaftaran gagal.");
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Kolom Kiri - Desktop (Sama dengan Login) */}
      <div className="hidden lg:flex bg-[#111827] flex-col justify-between p-12 text-white">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Veritas School</h1>
          <p className="text-gray-400 text-sm mt-2 font-medium">Sistem Penerimaan Peserta Didik Baru</p>

          <div className="mt-12 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <ShieldCheck size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Keamanan Data</p>
                <p className="text-xs text-gray-400 mt-1">Data pendaftaran aman dan terenkripsi</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <ClipboardList size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Real-time Tracking</p>
                <p className="text-xs text-gray-400 mt-1">Pantau status pendaftaran secara real-time</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <CheckCircle size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Seleksi Objektif</p>
                <p className="text-xs text-gray-400 mt-1">Proses seleksi transparan dan objektif</p>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 text-xs font-medium tracking-widest uppercase">
          © 2025 Veritas School. All rights reserved.
        </p>
      </div>

      {/* Kolom Kanan - Register Form */}
      <div className="bg-white flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-sm flex flex-col items-center">
          {/* Logo Inisial */}
          <div className="w-12 h-12 bg-[#1e3a8a] text-white rounded-xl flex items-center justify-center text-xl font-black shadow-lg shadow-blue-900/10 mb-6">
            V
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Buat Akun Baru</h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">Daftar sebagai calon peserta didik Veritas School</p>
          </div>

          {isSuccess ? (
            <div className="text-center py-10 space-y-4 animate-in zoom-in duration-300">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-4">
                <CheckCircle className="text-green-600" size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Pendaftaran Berhasil</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[240px] mx-auto text-center">
                Akun telah aktif. Mengalihkan Anda ke halaman masuk...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle size={18} className="shrink-0" />
                  <span className="font-bold">{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest pl-1">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1e3a8a] transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all font-medium"
                    placeholder="Buat username unik kamu"
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-medium pl-1 italic">Minimal 4 karakter, tanpa spasi</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest pl-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1e3a8a] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all font-medium"
                    placeholder="Buat password yang kuat"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password && (
                  <div className="pt-2 px-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Keamanan</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        strength.label === "Lemah" ? "text-red-500" :
                        strength.label === "Cukup" ? "text-yellow-600" : "text-green-600"
                      }`}>{strength.label}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: strength.width }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest pl-1">
                  Konfirmasi Password
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1e3a8a] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all font-medium ${
                      confirmPassword && password !== confirmPassword ? "border-red-500 ring-red-100" : "border-gray-300"
                    }`}
                    placeholder="Ulangi password kamu"
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[10px] text-red-500 font-bold pl-1">Password tidak cocok</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg font-bold text-sm tracking-widest uppercase transition-all hover:bg-blue-800 shadow-md shadow-blue-900/10 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4 active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>Buat Akun</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm font-medium">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-[#1e3a8a] font-bold hover:underline ml-1">
                Masuk sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
