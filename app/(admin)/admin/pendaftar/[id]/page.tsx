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
  FileText
} from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface PrestasiItem {
  nama: string;
  sertifikat: string | null;
}

interface PendaftarDetail {
  id: number;
  username: string;
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
  const [catatan, setCatatan] = useState("");
  const [showCatatanForm, setShowCatatanForm] = useState(false);
  const [showConfirmValid, setShowConfirmValid] = useState(false);
  const [showConfirmReject, setShowConfirmReject] = useState(false);

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
      }
    } catch (err) {
      console.error("Fetch detail error:", err);
    } finally {
      setIsLoading(false);
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
          nilai_smt5: scores.smt5
        }),
      });
      if (res.ok) {
        fetchDetail();
        alert("Nilai berhasil disimpan!");
      }
    } catch (err) {
      console.error("Save scores error:", err);
    } finally {
      setIsSavingScores(false);
    }
  };

  const averageScore = ((scores.smt1 + scores.smt2 + scores.smt3 + scores.smt4 + scores.smt5) / 5).toFixed(2);

  // Parse Prestasi JSON
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
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center gap-4">
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
      </header>

      <div className="px-8 py-6 grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left Column: Berkas Info */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shrink-0">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <InfoItem label="Nama Lengkap" value={data.berkas?.nama_pendaftar} />
              <InfoItem label="NISN" value={data.berkas?.nisn_pendaftar} />
              <InfoItem label="Tanggal Lahir" value={data.berkas?.tanggallahir_pendaftar ? new Date(data.berkas.tanggallahir_pendaftar).toLocaleDateString("id-ID") : "-"} />
              <InfoItem label="Agama" value={data.berkas?.agama} />
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

            {/* Validation Actions */}
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

        {/* Right Column: Seleksi & Scores */}
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

                  <button 
                    onClick={handleSaveScores}
                    disabled={isSavingScores}
                    className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors disabled:opacity-50 mt-4"
                  >
                    {isSavingScores ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Simpan Nilai
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
