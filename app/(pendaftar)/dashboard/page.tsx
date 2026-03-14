import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  User, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export default async function PendaftarDashboard() {
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

  const hasSubmitted = !!user.berkas;
  const berkasStatus = user.berkas?.status_validasi || "BELUM_DIISI";
  const seleksiData = user.seleksi[0] || null;

  // Calculate average if scores exist
  const average = seleksiData ? (
    (seleksiData.nilai_smt1 + seleksiData.nilai_smt2 + seleksiData.nilai_smt3 + seleksiData.nilai_smt4 + seleksiData.nilai_smt5) / 5
  ).toFixed(2) : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Halo, {user.berkas?.nama_pendaftar || user.username}! 👋</h1>
          <p className="text-[#6b7280] text-sm font-medium">Selamat datang di portal pendaftaran Veritas School.</p>
        </div>
        {!hasSubmitted && (
          <Link 
            href="/pendaftaran" 
            className="bg-[#1e3a8a] text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg shadow-blue-900/10 hover:bg-blue-800 transition-all active:scale-95 flex items-center gap-2"
          >
            Lengkapi Pendaftaran
            <ChevronRight size={16} />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Status Berkas */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-xl ${
              berkasStatus === "VALID" ? "bg-green-50 text-green-600" :
              berkasStatus === "DITOLAK" ? "bg-red-50 text-red-600" : "bg-yellow-50 text-yellow-600"
            }`}>
              {berkasStatus === "VALID" ? <CheckCircle size={24} /> : 
               berkasStatus === "DITOLAK" ? <XCircle size={24} /> : <Clock size={24} />}
            </div>
            {hasSubmitted && (
              <span className={`text-[10px] font-bold uppercase py-1 px-2.5 rounded-full ${
                berkasStatus === "VALID" ? "bg-green-100 text-green-700" :
                berkasStatus === "DITOLAK" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {berkasStatus}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider">Status Berkas</h3>
            <p className="text-xs text-[#6b7280] mt-1 font-medium leading-relaxed">
              {!hasSubmitted ? "Anda belum mengisi formulir pendaftaran." :
                berkasStatus === "MENUNGGU" ? "Berkas Anda sedang dalam antrean validasi panitia." :
                berkasStatus === "VALID" ? "Berkas Anda telah diverifikasi dan dinyatakan valid." :
                "Berkas Anda ditolak. Silakan cek catatan dan perbaiki data Anda."}
            </p>
          </div>
          
          {berkasStatus === "DITOLAK" && user.berkas?.catatan && (
            <div className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-start gap-2">
              <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-red-700 font-medium">"{user.berkas.catatan}"</p>
            </div>
          )}
        </div>

        {/* Card Status Seleksi */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-50 text-[#1e3a8a] rounded-xl">
              <TrendingUp size={24} />
            </div>
            {seleksiData && (
              <span className={`text-[10px] font-bold uppercase py-1 px-2.5 rounded-full ${
                seleksiData.status_seleksi === "LULUS" ? "bg-blue-100 text-[#1e3a8a]" :
                seleksiData.status_seleksi === "TIDAK_LULUS" ? "bg-gray-100 text-gray-500" : "bg-yellow-100 text-yellow-700"
              }`}>
                {seleksiData.status_seleksi}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider">Hasil Seleksi</h3>
            <p className="text-xs text-[#6b7280] mt-1 font-medium leading-relaxed">
              {seleksiData ? 
                `Seleksi selesai. Rata-rata nilai Anda: ${average}` : 
                "Hasil seleksi akan muncul setelah panitia menjalankan pengumuman."}
            </p>
          </div>
          {seleksiData?.status_seleksi === "LULUS" && (
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-center">
              <p className="text-[11px] text-[#1e3a8a] font-black uppercase tracking-widest">Selamat! Anda Lulus</p>
            </div>
          )}
        </div>

        {/* Quick Actions / Link to Detail */}
        <div className="bg-[#111827] rounded-2xl p-6 shadow-lg flex flex-col justify-between text-white">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Info Pendaftaran</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <User size={16} className="text-gray-500" />
                <span className="text-xs font-medium">{user.username}</span>
              </div>
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-gray-500" />
                <span className="text-xs font-medium">{user.berkas?.jenis_berkas || "Belum Memilih Jalur"}</span>
              </div>
            </div>
          </div>
          <Link 
            href="/status" 
            className="mt-6 flex items-center justify-between bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all group"
          >
            <span className="text-xs font-bold uppercase tracking-widest">Detail Status</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
