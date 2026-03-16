"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Mail, 
  ArrowLeft, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  ShieldCheck,
  ClipboardList,
  CheckCircle as CheckCircleIcon
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengirim link reset.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Kolom Kiri */}
      <div className="hidden md:block md:w-1/2 relative h-screen">
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
            Sistem kami memastikan akses Anda tetap aman dan mudah dipulihkan saat dibutuhkan.
          </p>
          
          <div className="flex flex-col gap-3 mt-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span className="text-sm text-gray-200">Enkripsi perlindungan data</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-4 h-4 text-white" />
              <span className="text-sm text-gray-200">Pemulihan akun cepat</span>
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
            Lupa Password
          </h2>
          
          <p className="text-sm text-gray-500 mt-1 mb-8">
            Ingat password kamu?{" "}
            <Link href="/login" className="text-blue-900 font-semibold hover:underline">
              Masuk kembali
            </Link>
          </p>

          {success ? (
            <div className="bg-green-50 border border-green-200 p-6 rounded-2xl text-center space-y-4 animate-in zoom-in duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <p className="text-sm text-green-800 font-semibold leading-relaxed">
                Link reset password sudah dikirim ke email kamu. Silakan cek inbox atau folder spam Anda.
              </p>
              <Link 
                href="/login" 
                className="inline-flex items-center justify-center gap-2 w-full bg-blue-900 hover:bg-blue-800 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors duration-150"
              >
                <ArrowLeft size={16} />
                Kembali ke Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block" htmlFor="email">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent placeholder-gray-400"
                    placeholder="Masukkan email yang terdaftar"
                  />
                </div>
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
                {isLoading ? "Mohon tunggu..." : "Kirim Link Reset"}
              </button>

              <div className="mt-4 text-center">
                <Link 
                  href="/login" 
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-900 transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>Kembali ke login</span>
                </Link>
              </div>
            </form>
          )}

          <div className="text-xs text-gray-400 text-center mt-8">
            © 2025 Veritas School. Sistem PPDB Online.
          </div>
        </div>
      </div>
    </div>
  );
}
