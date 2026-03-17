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
  CheckCircle,
} from "lucide-react";
import DialogCard from "@/components/ui/DialogCard";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    nama_pendaftar: "",
    nisn_pendaftar: "",
    tanggallahir_pendaftar: "",
    jenis_kelamin: "",
    asal_sekolah: "",
    agama: "",
    alamat_pendaftar: "",
    nama_ortu: "",
    pekerjaan_ortu: "",
    no_hp_ortu: "",
    alamat_ortu: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation per step
  const canNext = () => {
    if (step === 1) {
      return formData.username.length >= 4 && formData.email && formData.password.length >= 6 && formData.password === formData.confirmPassword;
    }
    if (step === 2) {
      return formData.nama_pendaftar && formData.nisn_pendaftar.length >= 10 && formData.tanggallahir_pendaftar && formData.jenis_kelamin && formData.asal_sekolah && formData.agama && formData.alamat_pendaftar;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Pendaftaran gagal.");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-row font-nunito">
      <DialogCard
        isOpen={isSuccess}
        type="success"
        title="Pendaftaran Berhasil!"
        description="Akun dan berkas pendaftaran kamu telah berhasil dibuat. Kamu akan diarahkan ke halaman login."
        onClose={() => router.push("/login")}
      />
      {/* Kolom Kiri */}
      <div className="hidden lg:flex lg:w-1/3 relative h-screen">
        <img 
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80"
          alt="Suasana kampus sekolah"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="absolute bottom-10 left-10 right-10">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-6 shadow-xl">
            <span className="text-[#1e3a8a] font-black text-2xl">V</span>
          </div>
          
          <h1 className="text-3xl font-black text-white leading-tight uppercase tracking-tighter">
            Veritas<br />
            PPDB Online.
          </h1>
          
          <p className="text-sm text-gray-300 mt-4 leading-relaxed font-medium">
            Gabung dengan komunitas pembelajar terbaik untuk masa depan yang gemilang.
          </p>
          
          <div className="mt-12 space-y-4">
             {[
               { label: "Data Akun", desc: "Buat identitas akses login" },
               { label: "Data Diri", desc: "Lengkapi identitas pendaftar" },
               { label: "Data Orang Tua", desc: "Informasi wali murid" }
             ].map((s, i) => (
               <div key={i} className="flex items-center gap-4 group">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                   step > i + 1 ? "bg-green-500 text-white" : 
                   step === i + 1 ? "bg-white text-[#1e3a8a] scale-110 shadow-lg" : 
                   "bg-white/20 text-white/50"
                 }`}>
                   {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
                 </div>
                 <div>
                   <p className={`text-xs font-black uppercase tracking-widest ${step >= i + 1 ? "text-white" : "text-white/40"}`}>{s.label}</p>
                   <p className="text-[10px] text-white/60 font-medium">{s.desc}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Kolom Kanan */}
      <div className="flex-1 bg-[#f8fafc] p-6 md:p-12 lg:p-20 flex flex-col justify-center h-screen overflow-y-auto no-scrollbar">
        <div className="max-w-xl w-full mx-auto bg-white p-10 rounded-3xl shadow-2xl shadow-blue-900/5 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-[10px] font-black text-blue-900 uppercase tracking-[0.2em] mb-1">Step {step} of 3</p>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {step === 1 && "Data Akun Anda"}
                {step === 2 && "Detail Identitas"}
                {step === 3 && "Data Orang Tua"}
              </h2>
            </div>
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="text-xs font-bold text-gray-400 hover:text-blue-900 transition-colors"
              >
                Kembali
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        type="text" required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-900 transition-all font-medium"
                        placeholder="testuser123"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        type="email" required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-900 transition-all font-medium"
                        placeholder="contoh@mail.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        type={showPassword ? "text" : "password"} required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-900 transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Konfirmasi Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        type={showPassword ? "text" : "password"} required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-900 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Lengkap</label>
                    <input
                      type="text" required
                      value={formData.nama_pendaftar}
                      onChange={(e) => setFormData({ ...formData, nama_pendaftar: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-bold"
                      placeholder="Masukkan nama sesuai ijazah"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">NISN</label>
                    <input
                      type="text" required
                      value={formData.nisn_pendaftar}
                      onChange={(e) => setFormData({ ...formData, nisn_pendaftar: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white transition-all font-bold"
                      placeholder="10 digit nomor NISN"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Asal Sekolah</label>
                    <input
                      type="text" required
                      value={formData.asal_sekolah}
                      onChange={(e) => setFormData({ ...formData, asal_sekolah: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white transition-all font-bold"
                      placeholder="SMP Negeri 1..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tgl Lahir</label>
                    <input
                      type="date" required
                      value={formData.tanggallahir_pendaftar}
                      onChange={(e) => setFormData({ ...formData, tanggallahir_pendaftar: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gender</label>
                    <select
                      required
                      value={formData.jenis_kelamin}
                      onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold"
                    >
                      <option value="">pilih...</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Agama</label>
                    <input
                      type="text" required
                      value={formData.agama}
                      onChange={(e) => setFormData({ ...formData, agama: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold"
                      placeholder="Agama"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Alamat Lengkap</label>
                  <textarea
                    required rows={2}
                    value={formData.alamat_pendaftar}
                    onChange={(e) => setFormData({ ...formData, alamat_pendaftar: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium"
                    placeholder="Alamat domisili saat ini"
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Ortu / Wali</label>
                    <input
                      type="text" required
                      value={formData.nama_ortu}
                      onChange={(e) => setFormData({ ...formData, nama_ortu: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No. HP Ortu</label>
                    <input
                      type="text" required
                      value={formData.no_hp_ortu}
                      onChange={(e) => setFormData({ ...formData, no_hp_ortu: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pekerjaan Ortu</label>
                  <input
                    type="text" required
                    value={formData.pekerjaan_ortu}
                    onChange={(e) => setFormData({ ...formData, pekerjaan_ortu: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Alamat Ortu</label>
                  <textarea
                    required rows={2}
                    value={formData.alamat_ortu}
                    onChange={(e) => setFormData({ ...formData, alamat_ortu: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium"
                  />
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 p-4 rounded-xl flex items-center gap-3 border border-red-100">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-xs text-red-700 font-bold leading-tight">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !canNext()}
              className="w-full bg-[#1e3a8a] text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-800 transition-all disabled:opacity-30 shadow-xl shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : step === 3 ? "Simpan & Daftar" : "Lanjutkan"}
            </button>
          </form>

          <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mt-10">
            © 2025 Veritas School System
          </p>
        </div>
      </div>
    </div>
  );
}
