import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { 
  TrendingUp, 
  Calendar, 
  User, 
  GraduationCap,
  BarChart3,
  CalendarDays
} from "lucide-react";

export const dynamic = 'force-dynamic'

export default async function StatusSeleksiPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PENDAFTAR") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    include: {
      seleksi: {
        orderBy: { created_at: "desc" },
        take: 1
      },
      berkas: true
    },
  });

  if (!user) return null;

  const seleksiData = user.seleksi[0] || null;

  // Calculate average
  const average = seleksiData ? (
    (seleksiData.nilai_smt1 + seleksiData.nilai_smt2 + seleksiData.nilai_smt3 + seleksiData.nilai_smt4 + seleksiData.nilai_smt5) / 5
  ).toFixed(2) : "0.00";

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[#111827]">Status Seleksi</h1>
          <p className="text-sm text-[#6b7280]">Hasil seleksi dan rekapitulasi nilai rapor kamu.</p>
        </div>
      </header>

      <div className="px-8 py-6 flex flex-col gap-6 font-nunito">
        {!seleksiData ? (
          <div className="bg-white border border-gray-200 rounded-lg p-16 text-center flex flex-col items-center gap-4 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center">
              <TrendingUp size={32} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#111827] uppercase">Belum Masuk Seleksi</h2>
              <p className="text-sm text-[#6b7280] mt-1 max-w-sm mx-auto">
                Kamu belum masuk dalam proses seleksi. Mohon tunggu informasi selanjutnya dari panitia.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Status Badge */}
            <div className="bg-white rounded-lg p-10 border border-gray-200 shadow-sm text-center">
              <p className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">Pengumuman Hasil</p>
              <h2 className="text-base font-bold text-[#1e3a8a] uppercase mb-8">{seleksiData.nama_seleksi}</h2>
              
              <div className={`inline-block px-10 py-3 rounded-md text-xl font-bold uppercase mb-6 ${
                seleksiData.status_seleksi === "LULUS" ? "bg-green-600 text-white" :
                seleksiData.status_seleksi === "TIDAK_LULUS" ? "bg-red-600 text-white" :
                "bg-[#1e3a8a] text-white"
              }`}>
                {seleksiData.status_seleksi}
              </div>

              <div className="flex items-center justify-center gap-2 text-gray-500 mt-4">
                <CalendarDays size={16} />
                <span className="text-xs font-semibold">Waktu Seleksi: {new Date(seleksiData.waktu_seleksi).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Nilai Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <BarChart3 className="text-[#1e3a8a]" size={18} />
                <h3 className="text-base font-semibold text-[#111827]">Nilai Rapor Semester 1-5</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((smt) => (
                    <div key={smt} className="bg-gray-50 p-4 rounded-md text-center border border-gray-100">
                      <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider mb-1">Semester {smt}</p>
                      <p className="text-xl font-bold text-[#1e3a8a]">{(seleksiData as any)[`nilai_smt${smt}`]}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#6b7280] uppercase tracking-wider">Rata-rata Nilai</p>
                    <p className="text-xs text-[#6b7280] mt-1">Dihitung otomatis berdasarkan nilai semester 1-5</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-3xl font-bold text-[#1e3a8a]">{average}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
