"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  UserPlus, 
  FileText, 
  ShieldCheck, 
  Loader2, 
  CheckCircle,
  Upload,
  User,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Trophy
} from "lucide-react";

export default function AdminTambahPendaftarPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    // Account
    username: "",
    password: "",
    // Berkas
    nisn_pendaftar: "",
    nama_pendaftar: "",
    tanggallahir_pendaftar: "",
    alamat_pendaftar: "",
    agama: "Islam",
    prestasi: "",
    nama_ortu: "",
    pekerjaan_ortu: "",
    no_hp_ortu: "",
    alamat_ortu: "",
    jenis_berkas: "UMUM"
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Register Account
      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      });
      const regData = await regRes.json();
      if (!regRes.ok) throw new Error(regData.message || "Gagal membuat akun.");

      const userId = regData.userId;

      // 2. Upload File if exists
      let publicUrl = "";
      if (file) {
        const fileData = new FormData();
        fileData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fileData });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) throw new Error("Gagal upload berkas.");
        publicUrl = uploadJson.url;
      }

      // 3. Save Berkas
      const berkasRes = await fetch("/api/berkas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          nisn_pendaftar: formData.nisn_pendaftar,
          nama_pendaftar: formData.nama_pendaftar,
          tanggallahir_pendaftar: formData.tanggallahir_pendaftar,
          alamat_pendaftar: formData.alamat_pendaftar,
          agama: formData.agama,
          prestasi: formData.prestasi,
          nama_ortu: formData.nama_ortu,
          pekerjaan_ortu: formData.pekerjaan_ortu,
          no_hp_ortu: formData.no_hp_ortu,
          alamat_ortu: formData.alamat_ortu,
          jenis_berkas: formData.jenis_berkas,
          file_path: publicUrl
        }),
      });
      if (!berkasRes.ok) throw new Error("Gagal menyimpan data berkas.");

      setSuccess(true);
      setTimeout(() => router.push("/admin/pendaftar"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center shadow-sm max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-300">
           <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <CheckCircle className="text-green-600" size={32} />
           </div>
           <h3 className="text-lg font-bold text-[#111827]">Pendaftaran Berhasil</h3>
           <p className="text-sm text-[#6b7280] mt-2">Data pendaftar manual telah disimpan ke sistem.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Tambah Pendaftar Manual</h2>
          <p className="text-sm text-[#6b7280]">Input data akun dan berkas pendaftar baru oleh panitia.</p>
        </div>
      </header>

      <div className="px-8 py-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
          {/* Left: Account Info */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#1e3a8a]" />
                  Akses Portal
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:border-[#1e3a8a] focus:outline-none"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      placeholder="Username siswa"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                  <input 
                    type="password" 
                    required
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:border-[#1e3a8a] focus:outline-none"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Minimal 6 karakter"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle className="shrink-0" size={18} />
                <p className="text-xs font-bold">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1e3a8a] text-white py-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-md shadow-blue-900/10 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
              Simpan Data Pendaftar
            </button>
          </div>

          {/* Right: Berkas Info */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm h-fit">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-widest flex items-center gap-2">
                <FileText size={16} className="text-[#1e3a8a]" />
                Informasi Pendaftaran
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
               {/* Step 1: Data Diri */}
               <div className="md:col-span-2">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] mb-4">Biodata Siswa</h4>
               </div>
               <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">NISN</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:bg-white focus:border-[#1e3a8a] focus:outline-none"
                  value={formData.nisn_pendaftar}
                  onChange={(e) => setFormData({...formData, nisn_pendaftar: e.target.value.replace(/\D/g, '')})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:bg-white focus:border-[#1e3a8a] focus:outline-none"
                  value={formData.nama_pendaftar}
                  onChange={(e) => setFormData({...formData, nama_pendaftar: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tanggal Lahir</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:bg-white focus:border-[#1e3a8a] focus:outline-none"
                  value={formData.tanggallahir_pendaftar}
                  onChange={(e) => setFormData({...formData, tanggallahir_pendaftar: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Agama</label>
                <select 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:bg-white focus:border-[#1e3a8a] focus:outline-none"
                  value={formData.agama}
                  onChange={(e) => setFormData({...formData, agama: e.target.value})}
                >
                  <option>Islam</option>
                  <option>Kristen</option>
                  <option>Katolik</option>
                  <option>Hindu</option>
                  <option>Budha</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Alamat Domisili</label>
                <textarea 
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:bg-white focus:border-[#1e3a8a] focus:outline-none min-h-[80px]"
                  value={formData.alamat_pendaftar}
                  onChange={(e) => setFormData({...formData, alamat_pendaftar: e.target.value})}
                />
              </div>

              {/* Step 2: Data Ortu */}
              <div className="md:col-span-2 pt-4">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] mb-4">Informasi Orang Tua</h4>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nama Ayah/Ibu</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:bg-white focus:border-[#1e3a8a] focus:outline-none"
                  value={formData.nama_ortu}
                  onChange={(e) => setFormData({...formData, nama_ortu: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pekerjaan</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:bg-white focus:border-[#1e3a8a] focus:outline-none"
                  value={formData.pekerjaan_ortu}
                  onChange={(e) => setFormData({...formData, pekerjaan_ortu: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">No. HP Orang Tua</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:bg-white focus:border-[#1e3a8a] focus:outline-none"
                  value={formData.no_hp_ortu}
                  onChange={(e) => setFormData({...formData, no_hp_ortu: e.target.value.replace(/\D/g, '')})}
                />
              </div>

               {/* Step 3: Berkas */}
                <div className="md:col-span-2 pt-4">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] mb-4">Lampiran Berkas</h4>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lampiran Berkas (PDF/JPG)</label>
                <div className="relative">
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload-admin"
                  />
                  <label 
                    htmlFor="file-upload-admin"
                    className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    <Upload size={18} />
                    {file ? file.name : "Pilih File Berkas"}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

function AlertCircle(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}
