"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Users as UsersIcon, 
  Upload, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Plus,
  Trash2,
  FileText,
  ExternalLink,
  Trophy
} from "lucide-react";

interface PrestasiItem {
  nama: string;
  sertifikat: string | null;
  fileName?: string; // For UI display
}

export default function PendaftaranForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    nisn_pendaftar: "",
    nama_pendaftar: "",
    tanggallahir_pendaftar: "",
    alamat_pendaftar: "",
    agama: "Islam",
    nama_ortu: "",
    pekerjaan_ortu: "",
    no_hp_ortu: "",
    alamat_ortu: "",
    jenis_berkas: "Reguler"
  });

  // Dynamic Prestasi List
  const [prestasiList, setPrestasiList] = useState<PrestasiItem[]>([
    { nama: "", sertifikat: null }
  ]);
  const [uploadingItemIndex, setUploadingItemIndex] = useState<number | null>(null);

  const addPrestasi = () => {
    if (prestasiList.length < 5) {
      setPrestasiList([...prestasiList, { nama: "", sertifikat: null }]);
    }
  };

  const removePrestasi = (index: number) => {
    if (prestasiList.length > 1) {
      const newList = prestasiList.filter((_, i) => i !== index);
      setPrestasiList(newList);
    } else {
      setPrestasiList([{ nama: "", sertifikat: null }]);
    }
  };

  const updatePrestasi = (index: number, field: keyof PrestasiItem, value: any) => {
    const newList = [...prestasiList];
    newList[index] = { ...newList[index], [field]: value };
    setPrestasiList(newList);
  };

  const handlePrestasiFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Ukuran sertifikat maksimal 5MB.");
        return;
      }

      setUploadingItemIndex(index);
      setError("");

      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
        const res = await fetch("/api/upload", { method: "POST", body: uploadFormData });
        const json = await res.json();
        
        if (res.ok) {
          updatePrestasi(index, "sertifikat", json.url);
          updatePrestasi(index, "fileName", selectedFile.name);
        } else {
          throw new Error("Gagal mengunggah sertifikat.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setUploadingItemIndex(null);
      }
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.nisn_pendaftar || !formData.nama_pendaftar || !formData.alamat_pendaftar) {
        setError("Mohon lengkapi semua data diri wajib.");
        return;
      }
      
      // Validate prestasi list if filled
      const hasEmptyName = prestasiList.some((p, i) => p.sertifikat && !p.nama);
      if (hasEmptyName) {
        setError("Nama prestasi wajib diisi jika melampirkan sertifikat.");
        return;
      }
    }
    if (step === 2 && (!formData.nama_ortu || !formData.no_hp_ortu)) {
      setError("Mohon lengkapi data orang tua wajib.");
      return;
    }
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Mohon unggah berkas persyaratan utama.");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      // 1. Upload Hauptberkas
      const fileData = new FormData();
      fileData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fileData });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) throw new Error("Gagal mengunggah berkas utama.");

      // 2. Filter out empty items from prestasi list before stringifying
      const finalPrestasi = prestasiList
        .filter(p => p.nama.trim() !== "")
        .map(({ nama, sertifikat }) => ({ nama, sertifikat }));

      // 3. Submit Data
      const res = await fetch("/api/berkas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          prestasi: finalPrestasi.length > 0 ? JSON.stringify(finalPrestasi) : null,
          file_path: uploadJson.url
        }),
      });
      
      if (res.ok) {
        router.push("/dashboard");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menyimpan pendaftaran.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Header & Progress Bar */}
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-black text-[#111827] uppercase tracking-tight">Formulir Pendaftaran</h1>
        <p className="text-[#6b7280] text-sm mt-1 font-medium">Lengkapi 3 langkah pendaftaran siswa baru.</p>
        
        <div className="flex items-center justify-between mt-10 relative px-4">
           <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -z-10 -translate-y-1/2 mx-10"></div>
           <div 
            className="absolute top-1/2 left-0 h-0.5 bg-[#1e3a8a] -z-10 -translate-y-1/2 transition-all duration-500 mx-10"
            style={{ width: `${((step - 1) / 2) * 80}%` }}
           ></div>

           <StepIndicator num={1} active={step >= 1} current={step === 1} label="Data Diri" icon={<User size={16} />} />
           <StepIndicator num={2} active={step >= 2} current={step === 2} label="Orang Tua" icon={<UsersIcon size={16} />} />
           <StepIndicator num={3} active={step >= 3} current={step === 3} label="Berkas" icon={<Upload size={16} />} />
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-xs font-bold">{error}</p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2 border-b border-gray-50 pb-4">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-[#1e3a8a] flex items-center justify-center text-sm">1</span>
              Biodata Calon Siswa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="NISN" required value={formData.nisn_pendaftar} onChange={(e) => setFormData({...formData, nisn_pendaftar: e.target.value.replace(/\D/g, '')})} />
              <FormInput label="Nama Lengkap" required value={formData.nama_pendaftar} onChange={(e) => setFormData({...formData, nama_pendaftar: e.target.value})} />
              <FormInput label="Tanggal Lahir" type="date" required value={formData.tanggallahir_pendaftar} onChange={(e) => setFormData({...formData, tanggallahir_pendaftar: e.target.value})} />
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Agama</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:bg-white focus:border-[#1e3a8a] focus:outline-none transition-all"
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
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Alamat Lengkap</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-[#1e3a8a] focus:outline-none transition-all"
                  value={formData.alamat_pendaftar}
                  onChange={(e) => setFormData({...formData, alamat_pendaftar: e.target.value})}
                />
              </div>

              {/* Dynamic Prestasi List */}
              <div className="md:col-span-2 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <Trophy size={16} className="text-[#1e3a8a]" />
                    Prestasi (Opsional)
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Maksimal 5</span>
                </div>
                
                <div className="space-y-4">
                  {prestasiList.map((item, index) => (
                    <div key={index} className="p-5 border border-gray-100 bg-gray-50/30 rounded-2xl space-y-4 relative group">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-7 space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Prestasi</label>
                          <input 
                            type="text" 
                            placeholder="Contoh: Juara 1 OSN Matematika 2024"
                            className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-medium focus:border-[#1e3a8a] focus:outline-none"
                            value={item.nama}
                            onChange={(e) => updatePrestasi(index, "nama", e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-4 space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sertifikat (Opsional)</label>
                          <div className="relative">
                            <input 
                              type="file" 
                              id={`prestasi-file-${index}`}
                              className="hidden"
                              onChange={(e) => handlePrestasiFileChange(index, e)}
                              accept=".pdf,.jpg,.jpeg"
                            />
                            <label 
                              htmlFor={`prestasi-file-${index}`}
                              className={`w-full flex items-center gap-2 px-3 py-2.5 border rounded-xl text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                item.sertifikat 
                                ? "bg-green-50 border-green-200 text-green-700" 
                                : "bg-white border-gray-100 text-gray-500 hover:border-blue-200 hover:text-[#1e3a8a]"
                              }`}
                            >
                              {uploadingItemIndex === index ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : item.sertifikat ? (
                                <CheckCircle size={14} />
                              ) : (
                                <Upload size={14} />
                              )}
                              <span className="truncate">{item.fileName || "Pilih File"}</span>
                            </label>
                          </div>
                        </div>
                        <div className="md:col-span-1 flex justify-center pb-1">
                          {prestasiList.length > 1 && (
                            <button 
                              type="button"
                              onClick={() => removePrestasi(index)}
                              className="p-2 text-red-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                      {item.sertifikat && (
                         <p className="text-[9px] text-gray-400 font-medium italic">* Sertifikat berhasil diunggah.</p>
                      )}
                    </div>
                  ))}

                  {prestasiList.length < 5 && (
                    <button 
                      type="button"
                      onClick={addPrestasi}
                      className="w-full py-3 border-2 border-dashed border-gray-100 rounded-2xl text-xs font-bold text-gray-400 flex items-center justify-center gap-2 hover:border-gray-200 hover:text-gray-600 transition-all uppercase tracking-widest"
                    >
                      <Plus size={14} />
                      Tambah Prestasi
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2 border-b border-gray-50 pb-4">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-[#1e3a8a] flex items-center justify-center text-sm">2</span>
              Informasi Orang Tua / Wali
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Nama Orang Tua" required value={formData.nama_ortu} onChange={(e) => setFormData({...formData, nama_ortu: e.target.value})} />
              <FormInput label="Pekerjaan" required value={formData.pekerjaan_ortu} onChange={(e) => setFormData({...formData, pekerjaan_ortu: e.target.value})} />
              <FormInput label="Nomor HP Aktif" required value={formData.no_hp_ortu} onChange={(e) => setFormData({...formData, no_hp_ortu: e.target.value.replace(/\D/g, '')})} />
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Alamat Orang Tua</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-[#1e3a8a] focus:outline-none transition-all"
                  value={formData.alamat_ortu}
                  onChange={(e) => setFormData({...formData, alamat_ortu: e.target.value})}
                />
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, alamat_ortu: formData.alamat_pendaftar})}
                  className="text-[10px] font-bold text-[#1e3a8a] flex items-center gap-1 mt-1 hover:underline"
                >
                  Sama dengan alamat siswa
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2 border-b border-gray-50 pb-4">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-[#1e3a8a] flex items-center justify-center text-sm">3</span>
              Kelengkapan Berkas
            </h2>
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pilih Jalur Pendaftaran</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Reguler", "Prestasi", "Afirmasi"].map((jalur) => (
                    <button
                      key={jalur}
                      type="button"
                      onClick={() => setFormData({...formData, jenis_berkas: jalur})}
                      className={`p-4 rounded-2xl border-2 text-sm font-bold transition-all ${
                        formData.jenis_berkas === jalur 
                        ? "border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]" 
                        : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                      }`}
                    >
                      Jalur {jalur}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Unggah Scan Ijazah/SKL (PDF/JPG)</label>
                <div 
                  className={`w-full border-2 border-dashed rounded-3xl p-10 text-center transition-all ${
                    file ? "border-green-200 bg-green-50" : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"
                  }`}
                >
                  <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                  <label htmlFor="file-upload" className="cursor-pointer group flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all ${
                      file ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-[#1e3a8a]"
                    }`}>
                      {file ? <CheckCircle size={24} /> : <Upload size={24} />}
                    </div>
                    <p className="text-sm font-bold text-[#111827]">
                      {file ? file.name : "Klik untuk pilih file berkas"}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium mt-1">Maksimal ukuran file 2MB</p>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
                <ShieldCheck size={20} className="text-[#1e3a8a] shrink-0" />
                <p className="text-[11px] text-[#1e3a8a] font-medium leading-relaxed">
                  Dengan menekan tombol submit, saya menyatakan bahwa data yang saya kirimkan adalah benar dan dapat dipertanggungjawabkan.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-10 flex gap-3">
          {step > 1 && (
            <button 
              onClick={prevStep}
              className="flex-1 border-2 border-gray-100 text-gray-500 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
            >
              <ChevronLeft size={18} />
              Kembali
            </button>
          )}
          {step < 3 ? (
            <button 
              onClick={nextStep}
              className="flex-[2] bg-[#1e3a8a] text-white py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10"
            >
              Lanjutkan
              <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-[2] bg-[#1e3a8a] text-white py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
              Kirim Pendaftaran
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ num, active, current, label, icon }: { num: number; active: boolean; current: boolean; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 relative z-10">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
        current ? "bg-[#1e3a8a] text-white shadow-lg shadow-blue-900/20 ring-4 ring-blue-50" : 
        active ? "bg-green-500 text-white" : "bg-white border border-gray-200 text-gray-300"
      }`}>
        {active && !current ? <CheckCircle size={20} /> : icon}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-widest ${
        current ? "text-[#1e3a8a]" : "text-gray-400"
      }`}>
        {label}
      </span>
    </div>
  );
}

function FormInput({ label, type = "text", required, value, onChange }: { label: string; type?: string; required?: boolean; value: string; onChange: (e: any) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input 
        type={type} 
        required={required}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:bg-white focus:border-[#1e3a8a] focus:outline-none transition-all shadow-sm"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
