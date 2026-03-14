"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
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
  CheckCircle 
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Kredensial tidak valid. Silakan periksa kembali.");
      } else {
        router.refresh();
        router.push("/dashboard"); 
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Kolom Kiri - Desktop */}
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

      {/* Kolom Kanan - Login Form */}
      <div className="bg-white flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-sm flex flex-col items-center">
          {/* Logo Inisial */}
          <div className="w-12 h-12 bg-[#1e3a8a] text-white rounded-xl flex items-center justify-center text-xl font-black shadow-lg shadow-blue-900/10 mb-6">
            V
          </div>

          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Selamat Datang</h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">Masuk ke akun Veritas School kamu</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle size={18} className="shrink-0" />
                <span className="font-bold">{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest pl-1" htmlFor="username">
                Username
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1e3a8a] transition-colors">
                  <User size={18} />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all font-medium"
                  placeholder="Username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between pl-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest" htmlFor="password">
                  Password
                </label>
                <Link href="#" className="text-[10px] font-bold text-[#1e3a8a] hover:underline uppercase tracking-wide">Lupa?</Link>
              </div>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1e3a8a] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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
                <span>Masuk Akun</span>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm font-medium">
              Belum punya akun?{" "}
              <Link href="/register" className="text-[#1e3a8a] font-bold hover:underline ml-1">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
