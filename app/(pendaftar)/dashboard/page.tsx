import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  User, 
  FileText, 
  CheckCircle, 
  XCircle, 
  ChevronRight,
  TrendingUp,
  BarChart3,
  Calendar,
  ClipboardCheck
} from "lucide-react";

export default async function PendaftarDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PENDAFTAR") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    include: {
      berkas: true,
      seleksi: {
        orderBy: { created_at: "desc" },
        take: 1
      },
    },
  });

  if (!user) return null;

  const berkasStatus = user.berkas?.status_validasi || "MENUNGGU";
  const seleksiData = user.seleksi[0] || null;
  const seleksiStatus = seleksiData?.status_seleksi || "MENUNGGU";

  // Calculate average
  const average = seleksiData ? (
    (seleksiData.nilai_smt1 + seleksiData.nilai_smt2 + seleksiData.nilai_smt3 + seleksiData.nilai_smt4 + seleksiData.nilai_smt5) / 5
  ).toFixed(2) : "0.00";

  return (
    <>
      {/* Page Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[#111827]">
            Halo, {user.berkas?.nama_pendaftar || user.username}!
          </h1>
          <p className="text-sm text-[#6b7280]">Selamat datang di portal PPDB Veritas.</p>
        </div>
      </header>

      {/* Page Content */}
      <div className="px-8 py-6 flex flex-col gap-6 font-nunito">
        {/* 4 Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Berkas */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6b7280] font-medium">Status Berkas</p>
              <p className={`text-base font-bold mt-1 ${
                berkasStatus === "VALID" ? "text-green-600" :
                berkasStatus === "DITOLAK" ? "text-red-700" : "text-[#1e3a8a]"
              }`}>
                {berkasStatus}
              </p>
            </div>
            <div className={`p-2 rounded-md ${
              berkasStatus === "VALID" ? "bg-green-50" :
              berkasStatus === "DITOLAK" ? "bg-red-50" : "bg-blue-50"
            }`}>
              {berkasStatus === "VALID" ? <CheckCircle className="text-green-600" size={24} /> : 
               berkasStatus === "DITOLAK" ? <XCircle className="text-red-600" size={24} /> : <FileText className="text-[#1e3a8a]" size={24} />}
            </div>
          </div>

          {/* Status Seleksi */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6b7280] font-medium">Status Seleksi</p>
              <p className={`text-base font-bold mt-1 ${
                seleksiStatus === "LULUS" ? "text-green-600" :
                seleksiStatus === "TIDAK_LULUS" ? "text-red-700" : "text-[#1e3a8a]"
              }`}>
                {seleksiData ? seleksiStatus : "BELUM DISELEKSI"}
              </p>
            </div>
            <div className={`p-2 rounded-md ${
              seleksiStatus === "LULUS" ? "bg-green-50" :
              seleksiStatus === "TIDAK_LULUS" ? "bg-red-50" : "bg-blue-50"
            }`}>
              <TrendingUp className={
                seleksiStatus === "LULUS" ? "text-green-600" :
                seleksiStatus === "TIDAK_LULUS" ? "text-red-600" : "text-[#1e3a8a]"
              } size={24} />
            </div>
          </div>

          {/* Rata-rata Nilai */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6b7280] font-medium">Nilai Rata-rata</p>
              <p className="text-2xl font-bold text-[#111827] mt-1">{average}</p>
            </div>
            <div className="p-2 bg-indigo-50 rounded-md">
              <BarChart3 className="text-indigo-600" size={24} />
            </div>
          </div>

          {/* Periode Seleksi */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6b7280] font-medium">Periode Seleksi</p>
              <p className="text-sm font-bold text-[#111827] mt-1 truncate">
                {seleksiData?.nama_seleksi || "Tidak Ada Data"}
              </p>
            </div>
            <div className="p-2 bg-gray-50 rounded-md">
              <ClipboardCheck className="text-gray-600" size={24} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Info Berkas Ringkas */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#111827] flex items-center gap-2">
                <FileText size={18} className="text-[#1e3a8a]" />
                Informasi Berkas
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#6b7280] font-medium uppercase tracking-wider">NISN</p>
                  <p className="text-sm font-semibold text-[#111827] mt-1">{user.berkas?.nisn_pendaftar || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6b7280] font-medium uppercase tracking-wider">Jalur</p>
                  <p className="text-sm font-semibold text-[#111827] mt-1">{user.berkas?.jenis_berkas || "-"}</p>
                </div>
              </div>
              {berkasStatus === "DITOLAK" && user.berkas?.catatan && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-md mt-4">
                  <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Catatan Admin:</p>
                  <p className="text-sm text-red-700 italic">"{user.berkas.catatan}"</p>
                </div>
              )}
              <Link href="/dashboard/berkas" className="block w-full text-center bg-gray-50 hover:bg-gray-100 text-[#1e3a8a] text-xs font-bold py-3 rounded-md transition-all mt-4 border border-gray-200">
                Kelola Berkas
              </Link>
            </div>
          </div>

          {/* Info Akun Ringkas */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#111827] flex items-center gap-2">
                <User size={18} className="text-[#1e3a8a]" />
                Informasi Akun
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-xs text-[#6b7280] font-medium">Username</span>
                  <span className="text-sm font-semibold text-[#111827]">{user.username}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-xs text-[#6b7280] font-medium">Email</span>
                  <span className="text-sm font-semibold text-[#111827]">{user.email || "-"}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-xs text-[#6b7280] font-medium">Sekolah Asal</span>
                  <span className="text-sm font-semibold text-[#111827]">{user.asal_sekolah || "-"}</span>
                </div>
                <Link href="/dashboard/data-diri" className="block w-full text-center bg-[#1e3a8a] hover:bg-blue-800 text-white text-xs font-bold py-3 rounded-md transition-all mt-4">
                  Edit Data Diri
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
