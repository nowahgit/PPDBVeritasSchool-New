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
  AlertCircle,
  BarChart3,
  Calendar
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
  ).toFixed(2) : "-";

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">
      {/* Header Section */}
      <div>
        <h1 className="text-xl font-bold text-[#111827]">Halo, {user.berkas?.nama_pendaftar || user.username}!</h1>
        <p className="text-[#6b7280] text-sm font-medium mt-1">Selamat datang di dashboard pendaftaran kamu.</p>
      </div>

      {/* 3 Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card Status Berkas */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className={`p-3 rounded-xl ${
            berkasStatus === "VALID" ? "bg-green-50 text-green-600" :
            berkasStatus === "DITOLAK" ? "bg-red-50 text-red-600" : "bg-yellow-50 text-yellow-600"
          }`}>
            {berkasStatus === "VALID" ? <CheckCircle size={24} /> : 
             berkasStatus === "DITOLAK" ? <XCircle size={24} /> : <Clock size={24} />}
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status Berkas</h3>
            <p className={`text-sm font-black mt-0.5 ${
              berkasStatus === "VALID" ? "text-green-700" :
              berkasStatus === "DITOLAK" ? "text-red-700" : "text-yellow-700"
            }`}>
              {berkasStatus === "BELUM_DIISI" ? "BELUM LENGKAP" : berkasStatus}
            </p>
          </div>
        </div>

        {/* Card Status Seleksi */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className={`p-3 rounded-xl ${
            seleksiData?.status_seleksi === "LULUS" ? "bg-blue-50 text-[#1e3a8a]" :
            seleksiData?.status_seleksi === "TIDAK_LULUS" ? "bg-gray-50 text-gray-500" : "bg-yellow-50 text-yellow-600"
          }`}>
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status Seleksi</h3>
            <p className={`text-sm font-black mt-0.5 ${
              seleksiData?.status_seleksi === "LULUS" ? "text-blue-700" :
              seleksiData?.status_seleksi === "TIDAK_LULUS" ? "text-gray-700" : "text-yellow-700"
            }`}>
              {seleksiData ? seleksiData.status_seleksi : "MENUNGGU"}
            </p>
          </div>
        </div>

        {/* Card Nilai Rata-rata */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <BarChart3 size={24} />
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nilai Rata-rata</h3>
            <p className="text-xl font-black text-[#111827] mt-0.5">{average}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Card Berkas */}
        <div className="lg:col-span-2 space-y-6">
          {!hasSubmitted ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center flex flex-col items-center gap-4">
               <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center">
                <FileText size={32} />
              </div>
              <h2 className="text-xl font-bold text-[#111827]">Berkas Belum Lengkap</h2>
              <p className="text-sm text-gray-500 max-w-sm">Kamu belum melengkapi berkas pendaftaran. Segera lengkapi data untuk memulai proses seleksi.</p>
              <Link 
                href="/pendaftaran" 
                className="bg-[#1e3a8a] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/10 hover:bg-blue-800 transition-all mt-4"
              >
                Lengkapi Sekarang
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-base font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2">
                  <FileText size={18} className="text-[#1e3a8a]" />
                  Ringkasan Berkas
                </h2>
                <Link href="/status" className="text-xs font-bold text-[#1e3a8a] hover:underline uppercase tracking-widest flex items-center gap-1">
                  Lihat Detail <ChevronRight size={14} />
                </Link>
              </div>
              
              <div className="p-6 space-y-6">
                {berkasStatus === "DITOLAK" && user.berkas?.catatan && (
                  <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-red-800 uppercase tracking-widest mb-1">Catatan Admin</p>
                      <p className="text-sm text-red-700 font-medium">"{user.berkas.catatan}"</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap</span>
                    <p className="text-sm font-bold text-[#111827]">{user.berkas?.nama_pendaftar}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">NISN</span>
                    <p className="text-sm font-bold text-[#111827]">{user.berkas?.nisn_pendaftar}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jalur Pendaftaran</span>
                    <p className="text-sm font-bold text-[#111827]">{user.berkas?.jenis_berkas}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Agama</span>
                    <p className="text-sm font-bold text-[#111827]">{user.berkas?.agama}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-[#111827] rounded-3xl p-6 text-white shadow-xl shadow-blue-900/10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Informasi Akun</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg text-blue-400">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Username</p>
                  <p className="text-xs font-bold">{user.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg text-blue-400">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Terdaftar</p>
                  <p className="text-xs font-bold">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>

            <Link 
              href="/settings" 
              className="mt-8 flex items-center justify-between bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-all group border border-white/5"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="text-xs font-bold uppercase tracking-widest">Pengaturan Akun</span>
              </div>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
