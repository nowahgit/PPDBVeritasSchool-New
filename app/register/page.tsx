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
  Star,
  Users,
  Trophy,
  Mail,
  School,
  CheckCircle
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [asalSekolah, setAsalSekolah] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Password Strength Logic
  const strength = useMemo(() => {
    if (!password) return { label: "", color: "bg-gray-200", text: "", width: "0%" };
    if (password.length < 6) return { label: "Lemah", color: "bg-red-500", text: "text-red-500", width: "33%" };
    if (password.length < 8) return { label: "Cukup", color: "bg-yellow-500", text: "text-yellow-500", width: "66%" };
    return { label: "Kuat", color: "bg-green-600", text: "text-green-600", width: "100%" };
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (username.length < 4 || username.length > 20 || username.includes(" ")) {
      setError("Username minimal 4-20 karakter dan tanpa spasi.");
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
        body: JSON.stringify({ 
          username, 
          password, 
          email: email || undefined, 
          jenis_kelamin: jenisKelamin || undefined, 
          asal_sekolah: asalSekolah || undefined 
        }),
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

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil</h2>
          <p className="text-gray-500 text-sm mb-6">
            Akun kamu telah berhasil dibuat. Kamu akan dialihkan ke halaman login dalam beberapa saat.
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-900 font-semibold">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Mengalihkan...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden flex flex-row">
      {/* Kolom Kiri */}
      <div className="hidden md:flex md:w-1/2 relative h-screen">
        <img 
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80"
          alt="Suasana kampus sekolah"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="absolute bottom-10 left-10 right-10">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-6">
            <span className="text-blue-900 font-bold text-xl">V</span>
          </div>
          
          <h1 className="text-3xl font-bold text-white leading-tight">
            Mulai Perjalananmu<br />
            Bersama Kami.
          </h1>
          
          <p className="text-sm text-gray-300 mt-3 max-w-md leading-relaxed">
            Daftarkan diri dan jadilah bagian dari keluarga besar Veritas School.
          </p>
          
          <div className="flex flex-col gap-3 mt-8">
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-white" />
              <span className="text-sm text-gray-200">Kurikulum berkualitas internasional</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-white" />
              <span className="text-sm text-gray-200">Komunitas belajar yang supportif</span>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="w-4 h-4 text-white" />
              <span className="text-sm text-gray-200">Ribuan alumni berprestasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kolom Kanan */}
      <div className="flex-1 bg-white p-10 md:p-16 flex flex-col justify-center h-screen overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <div className="text-xs font-semibold text-blue-900 tracking-widest uppercase mb-2">
            PPDB 2025/2026
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-2">
            Buat Akun Baru
          </h2>
          
          <p className="text-sm text-gray-500 mt-1 mb-8">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-blue-900 font-semibold hover:underline">
              Masuk sekarang
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent placeholder-gray-400"
                  placeholder="Buat username unik (min. 4 karakter)"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Tidak bisa diubah setelah mendaftar</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent placeholder-gray-400"
                  placeholder="Masukkan email aktif kamu"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Digunakan untuk reset password</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Jenis Kelamin
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  required
                  value={jenisKelamin}
                  onChange={(e) => setJenisKelamin(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent appearance-none bg-white font-medium"
                >
                  <option value="">pilih...</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Asal SMP/MTs/Sederajat
              </label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={asalSekolah}
                  onChange={(e) => setAsalSekolah(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent placeholder-gray-400"
                  placeholder="Contoh: SMP Negeri 1 Jakarta"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent placeholder-gray-400"
                  placeholder="Buat password (min. 6 karakter)"
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
              {password && (
                <div className="mt-1.5">
                  <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-200 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className={`text-xs mt-1 font-medium ${strength.text}`}>{strength.label}</p>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-9 pr-10 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent placeholder-gray-400 ${
                    confirmPassword && password !== confirmPassword ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Ulangi password kamu"
                />
                <div 
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
              )}
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
              {isLoading ? "Mohon tunggu..." : "Buat Akun"}
            </button>
          </form>

          <div className="text-xs text-gray-400 text-center mt-8 pb-10">
            © 2025 Veritas School. Sistem PPDB Online.
          </div>
        </div>
      </div>
    </div>
  );
}
