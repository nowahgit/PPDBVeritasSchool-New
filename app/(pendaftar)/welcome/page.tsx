"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  GraduationCap, 
  Loader2, 
  AlertCircle 
} from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    nisn_pendaftar: "",
    nama_pendaftar: "",
    tanggallahir_pendaftar: "",
    alamat_pendaftar: "",
    agama: "",
    jenis_kelamin: "",
    asal_sekolah: "",
  });

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      const user = session.user as any;
      setFormData(prev => ({
        ...prev,
        jenis_kelamin: user.jenis_kelamin || "",
        asal_sekolah: user.asal_sekolah || "",
      }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Update profile in database
      const profileRes = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: session?.user?.email,
          jenis_kelamin: formData.jenis_kelamin,
          asal_sekolah: formData.asal_sekolah
        }),
      });

      if (!profileRes.ok) {
        throw new Error("Gagal memperbarui profil.");
      }

      // We'll store this in session storage/state temporarily as requested:
      // "Setelah submit: simpan data ke session/state sementara lalu redirect ke /pendaftaran untuk melengkapi sisa data"
      sessionStorage.setItem("pendaftaran_draft", JSON.stringify(formData));
      
      router.push("/pendaftaran");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-6 font-nunito">
      <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-8 md:p-12">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-blue-50 text-[#1e3a8a] rounded-2xl flex items-center justify-center mb-6">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827]">Selamat Datang!</h1>
          <p className="text-sm text-gray-500 mt-2 font-medium max-w-xs">
            Sebelum melanjutkan, lengkapi data identitas dasar kamu terlebih dahulu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle size={18} className="shrink-0" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest pl-1">NISN</label>
            <input
              name="nisn_pendaftar"
              type="text"
              required
              value={formData.nisn_pendaftar}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white focus:border-transparent outline-none transition-all font-medium"
              placeholder="Masukkan 10 digit NISN"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest pl-1">Nama Lengkap</label>
            <input
              name="nama_pendaftar"
              type="text"
              required
              value={formData.nama_pendaftar}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white focus:border-transparent outline-none transition-all font-medium"
              placeholder="Nama sesuai ijazah"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest pl-1">Tanggal Lahir</label>
              <input
                name="tanggallahir_pendaftar"
                type="date"
                required
                value={formData.tanggallahir_pendaftar}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white focus:border-transparent outline-none transition-all font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest pl-1">Agama</label>
              <select
                name="agama"
                required
                value={formData.agama}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white focus:border-transparent outline-none transition-all font-medium"
              >
                <option value="">Pilih Agama</option>
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Budha">Budha</option>
                <option value="Konghucu">Konghucu</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest pl-1">Alamat Lengkap</label>
            <textarea
              name="alamat_pendaftar"
              required
              rows={3}
              value={formData.alamat_pendaftar}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white focus:border-transparent outline-none transition-all font-medium"
              placeholder="Alamat domisili saat ini"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Field jenis_kelamin (optional as per prompt, but we'll show if null or empty) */}
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest pl-1">Jenis Kelamin</label>
                <select
                  name="jenis_kelamin"
                  value={formData.jenis_kelamin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white focus:border-transparent outline-none transition-all font-medium"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest pl-1">Asal SMP/MTs/Sederajat</label>
                <input
                  name="asal_sekolah"
                  type="text"
                  value={formData.asal_sekolah}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white focus:border-transparent outline-none transition-all font-medium"
                  placeholder="Contoh: SMP Negeri 1 Jakarta"
                />
              </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1e3a8a] text-white py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all hover:bg-blue-800 shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 disabled:opacity-70 mt-4 active:scale-[0.98]"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <span>Lanjutkan Pendaftaran</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
