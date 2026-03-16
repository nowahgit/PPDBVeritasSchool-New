"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  XCircle,
  ShieldCheck,
} from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const strength = useMemo(() => {
    if (!password) return { label: "", color: "bg-gray-200", text: "", width: "0%" };
    if (password.length < 6) return { label: "Lemah", color: "bg-red-500", text: "text-red-500", width: "33%" };
    if (password.length < 8) return { label: "Cukup", color: "bg-yellow-500", text: "text-yellow-500", width: "66%" };
    return { label: "Kuat", color: "bg-green-600", text: "text-green-600", width: "100%" };
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengubah password.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
          <XCircle size={24} className="text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Link Tidak Valid</h2>
        <p className="text-sm text-gray-500">Token reset password tidak ditemukan atau sudah rusak.</p>
        <Link href="/forgot-password" className="inline-block mt-4 text-blue-900 font-semibold hover:underline">
          Ulangi Permintaan
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Password Berhasil Diubah!</h2>
        <p className="text-sm text-gray-500">Kamu sekarang bisa masuk menggunakan password baru kamu.</p>
        <button
          onClick={() => router.push("/login")}
          className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors duration-150 mt-4 flex items-center justify-center"
        >
          Masuk Sekarang
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Password Baru
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent placeholder-gray-400"
            placeholder="Min. 6 karakter"
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
          Konfirmasi Password Baru
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showConfirm ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full pl-9 pr-10 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent placeholder-gray-400 ${
              confirmPassword && password !== confirmPassword ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Ulangi password baru"
          />
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? (
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
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2">
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
        {isLoading ? "Memproses..." : "Reset Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="h-screen overflow-hidden flex flex-row">
      {/* Kolom Kiri */}
      <div className="hidden md:flex md:w-1/2 relative h-screen">
        <img
          src="https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=1200&q=80"
          alt="Suasana belajar di perpustakaan"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute bottom-10 left-10 right-10">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-6">
            <span className="text-blue-900 font-bold text-xl">V</span>
          </div>

          <h1 className="text-3xl font-bold text-white leading-tight">
            Keamanan Akun Anda<br />
            Prioritas Kami.
          </h1>

          <p className="text-sm text-gray-300 mt-3 max-w-md leading-relaxed">
            Buat password baru yang kuat untuk melindungi akun PPDB kamu.
          </p>

          <div className="flex flex-col gap-3 mt-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span className="text-sm text-gray-200">Enkripsi perlindungan data</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-white" />
              <span className="text-sm text-gray-200">Password aman dengan bcrypt</span>
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
            Buat Password Baru
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-8">
            Ingat password kamu?{" "}
            <Link href="/login" className="text-blue-900 font-semibold hover:underline">
              Masuk kembali
            </Link>
          </p>

          <Suspense fallback={
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-blue-900 w-8 h-8" />
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>

          <div className="text-xs text-gray-400 text-center mt-8">
            © 2025 Veritas School. Sistem PPDB Online.
          </div>
        </div>
      </div>
    </div>
  );
}
