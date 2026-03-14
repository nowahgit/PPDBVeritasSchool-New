import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  ArrowRight,
  AlertTriangle,
  Info,
  Calendar,
  FileCheck,
  Trophy,
  ArrowLeft,
  ExternalLink
} from "lucide-react";

interface PrestasiItem {
  nama: string;
  sertifikat: string | null;
}

export default async function StatusTimelinePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PENDAFTAR") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
    include: {
      berkas: true,
      seleksi: {
        orderBy: { created_at: "desc" },
        take: 1
      },
    },
  });

  if (!user) return null;

  const berkas = user.berkas;
  const seleksi = user.seleksi[0];

  // Parse Prestasi Helper
  const getPrestasiList = (): PrestasiItem[] => {
    if (!berkas?.prestasi) return [];
    try {
      return JSON.parse(berkas.prestasi);
    } catch {
      return [];
    }
  };
  const listPrestasi = getPrestasiList();

  const steps = [
    {
      id: 1,
      name: "Pendaftaran Akun",
      desc: "Akun anda telah terdaftar di sistem.",
      status: "COMPLETED",
      date: user.id ? new Date(user.id * 1000 + 1700000000000).toLocaleDateString("id-ID") : "-", 
    },
    {
      id: 2,
      name: "Pengiriman Berkas",
      desc: berkas ? "Berkas telah diunggah dan diterima sistem." : "Mohon lengkapi data dan unggah berkas.",
      status: berkas ? "COMPLETED" : "PENDING",
      date: berkas?.id_berkas ? new Date(berkas.id_berkas * 1000 + 1700000000000).toLocaleDateString("id-ID") : null,
    },
    {
      id: 3,
      name: "Validasi Panitia",
      desc: berkas?.status_validasi === "VALID" ? "Berkas Anda dinyatakan VALID." : 
            berkas?.status_validasi === "DITOLAK" ? "Berkas Anda DITOLAK." : "Berkas sedang menunggu antrean.",
      status: berkas?.status_validasi === "VALID" ? "COMPLETED" : 
              berkas?.status_validasi === "DITOLAK" ? "ERROR" : "PENDING",
      date: berkas?.tanggal_validasi ? new Date(berkas.tanggal_validasi).toLocaleDateString("id-ID") : null,
    },
    {
      id: 4,
      name: "Hasil Seleksi",
      desc: seleksi?.status_seleksi === "LULUS" ? "Selamat! Anda dinyatakan Lulus Seleksi." :
            seleksi?.status_seleksi === "TIDAK_LULUS" ? "Mohon maaf, Anda belum lulus seleksi." : "Menunggu pengumuman seleksi.",
      status: seleksi?.status_seleksi === "LULUS" ? "COMPLETED" :
              seleksi?.status_seleksi === "TIDAK_LULUS" ? "ERROR" : "PENDING",
      date: seleksi?.updated_at ? new Date(seleksi.updated_at).toLocaleDateString("id-ID") : null,
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-10">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 transition-all text-gray-400 hover:text-gray-600 shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-black text-[#111827] uppercase tracking-tight">Timeline Pendaftaran</h1>
          <p className="text-sm text-[#6b7280] font-medium">Pantau status pendaftaran Anda secara realtime.</p>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100 -z-10"></div>
          
          <div className="flex flex-col gap-12">
            {steps.map((step) => (
              <div key={step.id} className="flex gap-8 group">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white z-10 shadow-sm transition-all ${
                  step.status === "COMPLETED" ? "bg-green-500 text-white" :
                  step.status === "ERROR" ? "bg-red-500 text-white" : "bg-white text-gray-200 border-gray-100"
                }`}>
                  {step.status === "COMPLETED" ? <CheckCircle size={20} /> : 
                   step.status === "ERROR" ? <XCircle size={20} /> : <Clock size={20} />}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-sm font-black uppercase tracking-widest ${
                      step.status === "PENDING" ? "text-gray-400" : "text-[#111827]"
                    }`}>
                      {step.name}
                    </h3>
                    {step.date && <span className="text-[10px] font-bold text-gray-400">{step.date}</span>}
                  </div>
                  <p className="text-sm font-medium text-[#6b7280] leading-relaxed">
                    {step.desc}
                  </p>
                  
                  {/* Achievements Detail (Inside Step 2) */}
                  {step.id === 2 && listPrestasi.length > 0 && (
                    <div className="mt-4 space-y-2">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prestasi Melampirkan:</p>
                       <div className="flex flex-wrap gap-2">
                         {listPrestasi.map((p, i) => (
                           <div key={i} className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg flex items-center gap-2 group/item">
                             <Trophy size={12} className="text-[#1e3a8a]" />
                             <span className="text-xs font-semibold text-gray-700">{p.nama}</span>
                             {p.sertifikat && (
                               <a href={p.sertifikat} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                                 <ExternalLink size={12} />
                               </a>
                             )}
                           </div>
                         ))}
                       </div>
                    </div>
                  )}

                  {step.id === 3 && berkas?.status_validasi === "DITOLAK" && berkas.catatan && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                      <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Catatan Panitia</p>
                        <p className="text-xs text-red-700 font-medium">"{berkas.catatan}"</p>
                        <Link href="/pendaftaran" className="text-[10px] font-black text-red-600 uppercase mt-2 inline-block border-b border-red-200">
                          Revisi Berkas Sekarang
                        </Link>
                      </div>
                    </div>
                  )}

                  {step.id === 4 && seleksi?.status_seleksi === "LULUS" && (
                     <div className="mt-4 p-6 bg-blue-900 rounded-3xl text-white shadow-xl shadow-blue-900/20 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                        <h4 className="text-lg font-black leading-tight">Selamat, Anda Diterima! 🎓</h4>
                        <p className="text-xs text-blue-200 mt-1 font-medium italic">Rata-rata Nilai: {((seleksi.nilai_smt1 + seleksi.nilai_smt2 + seleksi.nilai_smt3 + seleksi.nilai_smt4 + seleksi.nilai_smt5) / 5).toFixed(2)}</p>
                        <hr className="my-4 border-white/10" />
                        <p className="text-xs text-blue-100 leading-relaxed font-medium">
                          Silakan datang ke sekolah untuk pendaftaran ulang dengan membawa dokumen cetak mulai tanggal 1-7 Juli 2025.
                        </p>
                     </div>
                  )}

                  {step.id === 4 && seleksi?.status_seleksi === "TIDAK_LULUS" && (
                    <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                       <p className="text-xs text-gray-600 font-medium">
                         Mohon maaf, Anda belum memenuhi kuota dan standar seleksi tahun ini. Jangan berkecil hati, tetap semangat!
                       </p>
                       <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest flex items-center gap-1">
                         <Info size={12} /> Info: Panitia (021) 123-4567
                       </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
