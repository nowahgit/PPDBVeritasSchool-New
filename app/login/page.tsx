"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
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
        const session = await getSession();
        router.refresh();
        
        if (session?.user?.role === "PANITIA") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Kolom Kiri */}
      <div className="hidden md:block md:w-1/2 relative h-screen">
        <img 
          src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80"
          alt="Siswa belajar di sekolah"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="absolute bottom-10 left-10 right-10">
          
          
          <h1 className="text-3xl font-bold text-white leading-tight">
            Sekolah Terbaik untuk<br />
            Generasi Terbaik.
          </h1>
          
          <p className="text-sm text-gray-300 mt-3 max-w-md leading-relaxed">
            Veritas School membentuk karakter dan akademik siswa menuju masa depan yang cerah.
          </p>
          
          <div className="flex flex-col gap-3 mt-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-white" />
              <span className="text-sm text-gray-200">Proses pendaftaran 100% online</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span className="text-sm text-gray-200">Data kamu aman dan terenkripsi</span>
            </div>
            <div className="flex items-center gap-3">
              <ClipboardList className="w-4 h-4 text-white" />
              <span className="text-sm text-gray-200">Pantau status seleksi secara real-time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kolom Kanan */}
      <div className="w-full md:w-1/2 bg-white p-10 md:p-16 flex flex-col justify-center h-screen overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <div className="text-xs font-semibold text-blue-900 tracking-widest uppercase mb-2">
            PPDB 2025/2026
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-2">
            Masuk ke Akun Kamu
          </h2>
          
          <p className="text-sm text-gray-500 mt-1 mb-8">
            Belum punya akun?{" "}
            <Link href="/register" className="text-blue-900 font-semibold hover:underline">
              Daftar sekarang
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent placeholder-gray-400"
                  placeholder="Masukkan username kamu"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent placeholder-gray-400"
                  placeholder="Masukkan password kamu"
                />
                <div 
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-blue-900 hover:underline">
                Lupa password?
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2 mt-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors duration-150 mt-2 flex items-center justify-center disabled:opacity-70"
            >
              {isLoading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
              {isLoading ? "Mohon tunggu..." : "Masuk Akun"}
            </button>
          </form>

          <div className="text-xs text-gray-400 text-center mt-8">
            © 2025 Veritas School. Sistem PPDB Online.
          </div>
        </div>
      </div>
    </div>
  );
}
