"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Phone, 
  Calendar, 
  BookOpen, 
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Save,
  Loader2,
  FileText,
  Edit2,
  Lock,
  Mail,
  School,
  X,
  Trash2
} from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface PrestasiItem {
  nama: string;
  sertifikat: string | null;
}

interface PendaftarDetail {
  id: number;
  username: string;
  email: string | null;
  jenis_kelamin: string | null;
  asal_sekolah: string | null;
  berkas: {
    id_berkas: number;
    nisn_pendaftar: string;
    nama_pendaftar: string;
    tanggallahir_pendaftar: string;
    alamat_pendaftar: string;
    agama: string;
    prestasi: string | null;
    nama_ortu: string;
    pekerjaan_ortu: string;
    no_hp_ortu: string;
    alamat_ortu: string;
    jenis_berkas: string;
    file_path: string;
    status_validasi: string;
    catatan?: string;
    tanggal_validasi?: string;
  } | null;
  seleksi: Array<{
    id_seleksi: number;
    nilai_smt1: number;
    nilai_smt2: number;
    nilai_smt3: number;
    nilai_smt4: number;
    nilai_smt5: number;
    status_seleksi: string;
  }>;
}

export default function PendaftarDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<PendaftarDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [isSavingScores, setIsSavingScores] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [catatan, setCatatan] = useState("");
  const [showCatatanForm, setShowCatatanForm] = useState(false);
  const [showConfirmValid, setShowConfirmValid] = useState(false);
  const [showConfirmReject, setShowConfirmReject] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [statusSeleksi, setStatusSeleksi] = useState("MENUNGGU");

  // Edit form state
  const [editForm, setEditForm] = useState({
    username: "",
    password: "",
    email: "",
    asal_sekolah: "",
    jenis_kelamin: "",
    // Berkas fields
    nama_pendaftar: "",
    nisn_pendaftar: "",
    alamat_pendaftar: "",
    agama: "",
    tanggallahir_pendaftar: "",
    nama_ortu: "",
    no_hp_ortu: "",
    pekerjaan_ortu: "",
    alamat_ortu: ""
  });

  // Scores state
  const [scores, setScores] = useState({
    smt1: 0,
    smt2: 0,
    smt3: 0,
    smt4: 0,
    smt5: 0
  });

  useEffect(() => {
    fetchDetail();
  }, [id]);

  useEffect(() => {
    if (data?.seleksi && data.seleksi.length > 0) {
      const s = data.seleksi[0];
      setScores({
        smt1: s.nilai_smt1,
        smt2: s.nilai_smt2,
        smt3: s.nilai_smt3,
        smt4: s.nilai_smt4,
        smt5: s.nilai_smt5
      });
      setStatusSeleksi(s.status_seleksi);
    }
  }, [data]);

  const fetchDetail = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/pendaftar/${id}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.berkas?.catatan) setCatatan(json.berkas.catatan);
        
        // Populate edit form
        setEditForm({
          username: json.username || "",
          password: "",
          email: json.email || "",
          asal_sekolah: json.asal_sekolah || "",
          jenis_kelamin: json.jenis_kelamin || "Laki-laki",
          nama_pendaftar: json.berkas?.nama_pendaftar || "",
          nisn_pendaftar: json.berkas?.nisn_pendaftar || "",
          alamat_pendaftar: json.berkas?.alamat_pendaftar || "",
          agama: json.berkas?.agama || "Katolik",
          tanggallahir_pendaftar: json.berkas?.tanggallahir_pendaftar ? new Date(json.berkas.tanggallahir_pendaftar).toISOString().split('T')[0] : "",
          nama_ortu: json.berkas?.nama_ortu || "",
          no_hp_ortu: json.berkas?.no_hp_ortu || "",
          pekerjaan_ortu: json.berkas?.pekerjaan_ortu || "",
          alamat_ortu: json.berkas?.alamat_ortu || ""
        });
      }
    } catch (err) {
      console.error("Fetch detail error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePendaftar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingEdit(true);
    try {
      // 1. Update User Account
      const userRes = await fetch(`/api/admin/pendaftar/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: editForm.username,
          password: editForm.password,
          email: editForm.email,
          asal_sekolah: editForm.asal_sekolah,
          jenis_kelamin: editForm.jenis_kelamin
        }),
      });

      // 2. Update Berkas if exists
      if (data?.berkas) {
        await fetch(`/api/berkas/${data.berkas.id_berkas}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama_pendaftar: editForm.nama_pendaftar,
            nisn_pendaftar: editForm.nisn_pendaftar,
            alamat_pendaftar: editForm.alamat_pendaftar,
            agama: editForm.agama,
            tanggallahir_pendaftar: editForm.tanggallahir_pendaftar,
            nama_ortu: editForm.nama_ortu,
            no_hp_ortu: editForm.no_hp_ortu,
            pekerjaan_ortu: editForm.pekerjaan_ortu,
            alamat_ortu: editForm.alamat_ortu
          }),
        });
      }

      if (userRes.ok) {
        fetchDetail();
        setShowEditModal(false);
        alert("Data pendaftar berhasil diperbarui!");
      } else {
        const err = await userRes.json();
        alert(err.message || "Gagal memperbarui data");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeletePendaftar = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/pendaftar/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Pendaftar berhasil dihapus!");
        router.push("/admin/pendaftar");
      } else {
        const err = await res.json();
        alert(err.message || "Gagal menghapus pendaftar");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleValidate = async (status: string) => {
    if (!data?.berkas) return;
    setIsValidating(true);
    try {
      const res = await fetch(`/api/berkas/${data.berkas.id_berkas}/validasi`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_validasi: status, catatan: status === "DITOLAK" ? catatan : null }),
      });
      if (res.ok) {
        fetchDetail();
        setShowCatatanForm(false);
      }
    } catch (err) {
      console.error("Validation error:", err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSaveScores = async () => {
    setIsSavingScores(true);
    try {
      const res = await fetch("/api/seleksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: parseInt(id as string),
          nama_seleksi: "SELEKSI REGULER 2025", 
          waktu_seleksi: new Date(),
          nilai_smt1: scores.smt1,
          nilai_smt2: scores.smt2,
          nilai_smt3: scores.smt3,
          nilai_smt4: scores.smt4,
          nilai_smt5: scores.smt5,
          status_seleksi: statusSeleksi
        }),
      });
      if (res.ok) {
        fetchDetail();
        alert("Data seleksi berhasil disimpan!");
      }
    } catch (err) {
      console.error("Save scores error:", err);
    } finally {
      setIsSavingScores(false);
    }
  };

  const averageScore = ((scores.smt1 + scores.smt2 + scores.smt3 + scores.smt4 + scores.smt5) / 5).toFixed(2);

  const renderPrestasiList = () => {
    if (!data?.berkas?.prestasi) return <p className="text-sm text-gray-400 italic">Tidak ada prestasi dilampirkan.</p>;
    
    try {
      const list: PrestasiItem[] = JSON.parse(data.berkas.prestasi);
      if (!Array.isArray(list) || list.length === 0) return <p className="text-sm text-gray-400 italic">Tidak ada prestasi dilampirkan.</p>;
      
      return (
        <div className="space-y-3 mt-2">
          {list.map((p, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1e3a8a] flex items-center justify-center">
                  <Trophy size={14} />
                </div>
                <p className="text-sm font-semibold text-[#111827]">{p.nama}</p>
              </div>
              {p.sertifikat ? (
                <a 
                  href={p.sertifikat} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#1e3a8a] bg-white border border-blue-100 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <ExternalLink size={12} />
                  LIHAT SERTIFIKAT
                </a>
              ) : (
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tanpa sertifikat</span>
              )}
            </div>
          ))}
        </div>
      );
    } catch (e) {
      return <p className="text-sm text-red-500 font-medium">Gagal memuat data prestasi (format tidak valid).</p>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-[#1e3a8a] animate-spin" />
          <p className="text-sm font-medium text-gray-500">Memuat detail pendaftar...</p>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-center">Pendaftar tidak ditemukan.</div>;

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-[#111827]">Detail Pendaftar</h2>
            <p className="text-sm text-[#6b7280]">
              {data.berkas?.nama_pendaftar || data.username} • NISN: {data.berkas?.nisn_pendaftar || "-"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowConfirmDelete(true)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
            title="Hapus Pendaftar"
          >
            <Trash2 size={20} />
          </button>
          <button 
            onClick={() => setShowEditModal(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors border border-gray-300 shadow-sm"
          >
            <Edit2 size={16} />
            Edit Data Pendaftar
          </button>
        </div>
      </header>

      <div className="px-8 py-6 grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shrink-0">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <InfoItem label="Nama Lengkap" value={data.berkas?.nama_pendaftar} />
              <InfoItem label="NISN" value={data.berkas?.nisn_pendaftar} />
              <InfoItem label="Tanggal Lahir" value={data.berkas?.tanggallahir_pendaftar ? new Date(data.berkas.tanggallahir_pendaftar).toLocaleDateString("id-ID") : "-"} />
              <InfoItem label="Agama" value={data.berkas?.agama} />
              <InfoItem label="Jenis Kelamin" value={data.jenis_kelamin} />
              <InfoItem label="Asal Sekolah" value={data.asal_sekolah} />
              <InfoItem label="Jalur" value={data.berkas?.jenis_berkas} />
              
              <div className="md:col-span-2 space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daftar Prestasi</p>
                {renderPrestasiList()}
              </div>

              <div className="md:col-span-2">
                <InfoItem label="Alamat Pendaftar" value={data.berkas?.alamat_pendaftar} />
              </div>
              <hr className="md:col-span-2 border-gray-100" />
              <InfoItem label="Nama Orang Tua" value={data.berkas?.nama_ortu} />
              <InfoItem label="Pekerjaan Orang Tua" value={data.berkas?.pekerjaan_ortu} />
              <InfoItem label="Nomor HP Ortu" value={data.berkas?.no_hp_ortu} />
              <div className="md:col-span-2">
                <InfoItem label="Alamat Orang Tua" value={data.berkas?.alamat_ortu} />
              </div>
              
              <div className="md:col-span-2 pt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Dokumen Utama (Ijazah/SKL)</p>
                {data.berkas?.file_path ? (
                  <a 
                    href={data.berkas.file_path} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#1e3a8a] bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <ExternalLink size={16} />
                    Lihat Berkas Utama
                  </a>
                ) : (
                  <p className="text-sm text-gray-400 italic">Berkas belum diunggah.</p>
                )}
              </div>
            </div>

            <div className="px-6 py-6 border-t border-gray-100 bg-gray-50/30">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Tindakan Validasi</h4>
              
              {!showCatatanForm && data.berkas?.status_validasi === "MENUNGGU" ? (
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowConfirmValid(true)}
                    disabled={isValidating}
                    className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle size={18} />
                    Terima Berkas (VALID)
                  </button>
                  <button 
                    onClick={() => setShowCatatanForm(true)}
                    disabled={isValidating}
                    className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <XCircle size={18} />
                    Tolak Berkas (DITOLAK)
                  </button>
                </div>
              ) : showCatatanForm ? (
                <div className="space-y-3">
                  <textarea 
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:outline-none min-h-[100px]"
                    placeholder="Sebutkan alasan penolakan berkas..."
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowConfirmReject(true)}
                      disabled={isValidating || !catatan}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
                    >
                      Konfirmasi Tolak
                    </button>
                    <button 
                      onClick={() => setShowCatatanForm(false)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-100 p-4 rounded-lg flex items-center justify-between">
                  <div className={`px-3 py-1 rounded text-xs font-bold uppercase ${
                    data.berkas?.status_validasi === "VALID" ? "bg-green-100 text-green-700" :
                    data.berkas?.status_validasi === "DITOLAK" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    Status: {data.berkas?.status_validasi}
                  </div>
                  {data.berkas?.status_validasi === "DITOLAK" && (
                     <button 
                      onClick={() => setShowCatatanForm(true)}
                      className="text-xs font-bold text-[#1e3a8a] border-b border-dashed border-[#1e3a8a]"
                    >
                      Re-evaluasi & Ubah Catatan
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shrink-0">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-[#1e3a8a]" />
                Nilai Seleksi Akademik
              </h3>
            </div>

            <div className="p-6 flex flex-col gap-6">
              {data.berkas?.status_validasi !== "VALID" ? (
                <div className="bg-gray-50 p-6 rounded-lg text-center border border-dashed border-gray-200">
                  <Clock size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500 font-medium">Input nilai hanya untuk berkas <strong>VALID</strong>.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5].map((smt) => (
                      <div key={smt} className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Semester {smt}</label>
                        <input 
                          type="number" 
                          max={100}
                          min={0}
                          className="w-full p-2 border border-gray-200 rounded-lg text-sm font-bold focus:border-[#1e3a8a] focus:outline-none"
                          value={(scores as any)[`smt${smt}`]}
                          onChange={(e) => setScores({ ...scores, [`smt${smt}`]: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    ))}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rata-rata</label>
                      <div className="w-full p-2 bg-gray-900 text-white rounded-lg text-sm font-black text-center">
                        {averageScore}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 mt-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status Kelulusan</label>
                    <select 
                      className={`w-full p-3 border rounded-xl text-sm font-bold focus:outline-none transition-all ${
                        statusSeleksi === "LULUS" ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                        statusSeleksi === "TIDAK_LULUS" ? "bg-red-50 border-red-200 text-red-700" :
                        "bg-white border-gray-200 text-gray-700"
                      }`}
                      value={statusSeleksi}
                      onChange={(e) => setStatusSeleksi(e.target.value)}
                    >
                      <option value="MENUNGGU">⌛ MENUNGGU</option>
                      <option value="LULUS">✅ LULUS SELEKSI</option>
                      <option value="TIDAK_LULUS">❌ TIDAK LULUS</option>
                    </select>
                  </div>

                  <button 
                    onClick={handleSaveScores}
                    disabled={isSavingScores}
                    className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors disabled:opacity-50 mt-4"
                  >
                    {isSavingScores ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Simpan Nilai & Status
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <header className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Edit2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-none mb-1">Edit Seluruh Data Pendaftar</h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">Manajemen Akun dan Profil</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleUpdatePendaftar} className="overflow-y-auto flex-1 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="md:col-span-2">
                   <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-3 mb-6">
                     <Lock size={14} /> Keamanan & Akun
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Username Login</label>
                        <div className="relative">
                           <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                           <input 
                            type="text" required
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:border-blue-500 focus:bg-white transition-all"
                            value={editForm.username}
                            onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Terdaftar</label>
                        <div className="relative">
                           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                           <input 
                            type="email" 
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:border-blue-500 focus:bg-white transition-all"
                            value={editForm.email}
                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password Baru (Opsional)</label>
                        <div className="relative">
                           <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                           <input 
                            type="password"
                            placeholder="Isi jika ingin ubah"
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:border-blue-500 focus:bg-white transition-all"
                            value={editForm.password}
                            onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                          />
                        </div>
                      </div>
                   </div>
                </div>

                <hr className="md:col-span-2 border-gray-100" />

                <div className="space-y-6">
                  <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-3">
                     <User size={14} /> Data Pribadi
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap Sesuai Ijazah</label>
                      <input 
                        type="text" required
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                        value={editForm.nama_pendaftar}
                        onChange={(e) => setEditForm({...editForm, nama_pendaftar: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">NISN</label>
                        <input 
                          type="text" required
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                          value={editForm.nisn_pendaftar}
                          onChange={(e) => setEditForm({...editForm, nisn_pendaftar: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jenis Kelamin</label>
                        <select 
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                          value={editForm.jenis_kelamin}
                          onChange={(e) => setEditForm({...editForm, jenis_kelamin: e.target.value})}
                        >
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tanggal Lahir</label>
                        <input 
                          type="date" required
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                          value={editForm.tanggallahir_pendaftar}
                          onChange={(e) => setEditForm({...editForm, tanggallahir_pendaftar: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Agama</label>
                        <select 
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                          value={editForm.agama}
                          onChange={(e) => setEditForm({...editForm, agama: e.target.value})}
                        >
                          <option value="Katolik">Katolik</option>
                          <option value="Kristen">Kristen</option>
                          <option value="Islam">Islam</option>
                          <option value="Budha">Budha</option>
                          <option value="Hindu">Hindu</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asal Sekolah</label>
                      <div className="relative">
                         <School className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                         <input 
                          type="text" required
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                          value={editForm.asal_sekolah}
                          onChange={(e) => setEditForm({...editForm, asal_sekolah: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alamat Lengkap</label>
                      <textarea 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold min-h-[80px]"
                        value={editForm.alamat_pendaftar}
                        onChange={(e) => setEditForm({...editForm, alamat_pendaftar: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-3">
                     <MapPin size={14} /> Data Orang Tua
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Orang Tua / Wali</label>
                      <input 
                        type="text" required
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                        value={editForm.nama_ortu}
                        onChange={(e) => setEditForm({...editForm, nama_ortu: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nomor HP</label>
                        <div className="relative">
                           <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                           <input 
                            type="text" required
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                            value={editForm.no_hp_ortu}
                            onChange={(e) => setEditForm({...editForm, no_hp_ortu: e.target.value.replace(/\D/g, '')})}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pekerjaan</label>
                        <input 
                          type="text" required
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                          value={editForm.pekerjaan_ortu}
                          onChange={(e) => setEditForm({...editForm, pekerjaan_ortu: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alamat Orang Tua</label>
                      <textarea 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold min-h-[80px]"
                        value={editForm.alamat_ortu}
                        onChange={(e) => setEditForm({...editForm, alamat_ortu: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-3">
                 <button 
                  type="submit"
                  disabled={isSavingEdit}
                  className="flex-1 bg-[#1e3a8a] text-white py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-3 hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {isSavingEdit ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  SIMPAN SEMUA PERUBAHAN
                </button>
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-8 bg-gray-100 text-gray-500 rounded-2xl text-sm font-bold hover:bg-gray-200 transition-all"
                >
                  BATAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showConfirmValid}
        title="Validasi berkas ini?"
        message="Berkas pendaftar akan ditandai sebagai VALID dan tidak bisa diubah kembali ke status menunggu."
        confirmLabel="Ya, Validasi"
        confirmVariant="primary"
        onConfirm={() => {
          handleValidate("VALID");
          setShowConfirmValid(false);
        }}
        onCancel={() => setShowConfirmValid(false)}
      />

      <ConfirmDialog
        isOpen={showConfirmReject}
        title="Tolak berkas ini?"
        message="Berkas akan ditolak dan pendaftar akan mendapat notifikasi. Pastikan catatan penolakan sudah diisi."
        confirmLabel="Ya, Tolak"
        confirmVariant="danger"
        onConfirm={() => {
          handleValidate("DITOLAK");
          setShowConfirmReject(false);
        }}
        onCancel={() => setShowConfirmReject(false)}
      />

      <ConfirmDialog
        isOpen={showConfirmDelete}
        title="Hapus Pendaftar Permanen?"
        message="Tindakan ini tidak bisa dibatalkan. Seluruh data akun, berkas, dan nilai seleksi siswa ini akan dihapus selamanya dari sistem."
        confirmLabel={isDeleting ? "Menghapus..." : "Ya, Hapus Permanen"}
        confirmVariant="danger"
        onConfirm={() => {
          handleDeletePendaftar();
          setShowConfirmDelete(false);
        }}
        onCancel={() => setShowConfirmDelete(false)}
      />
    </>
  );
}

function InfoItem({ label, value }: { label: string; value: string | undefined | null }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-semibold text-[#111827]">{value || "-"}</p>
    </div>
  );
}
