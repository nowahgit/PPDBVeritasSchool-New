import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  ShieldCheck
} from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PANITIA") {
    redirect("/login");
  }

  // Fetch summary data
  const [totalPendaftar, waitingValidasi, validBerkas, rejectedBerkas, totalAdmin, recentApplicants] = await Promise.all([
    prisma.user.count({ where: { role: "PENDAFTAR" } }),
    prisma.berkas.count({ where: { status_validasi: "MENUNGGU" } }),
    prisma.berkas.count({ where: { status_validasi: "VALID" } }),
    prisma.berkas.count({ where: { status_validasi: "DITOLAK" } }),
    prisma.admin.count(),
    prisma.user.findMany({
      where: { role: "PENDAFTAR" },
      include: { berkas: true },
      orderBy: { id: "desc" },
      take: 5,
    }),
  ]);

  const cards = [
    {
      label: "Total Pendaftar",
      value: totalPendaftar,
      icon: <Users className="text-[#1e3a8a]" size={24} />,
      color: "border-blue-200",
    },
    {
      label: "Menunggu Validasi",
      value: waitingValidasi,
      icon: <Clock className="text-yellow-500" size={24} />,
      color: "border-yellow-200",
    },
    {
      label: "Berkas Valid",
      value: validBerkas,
      icon: <CheckCircle className="text-green-500" size={24} />,
      color: "border-green-200",
    },
    {
      label: "Berkas Ditolak",
      value: rejectedBerkas,
      icon: <XCircle className="text-red-500" size={24} />,
      color: "border-red-200",
    },
    {
      label: "Total Admin",
      value: totalAdmin,
      icon: <ShieldCheck className="text-indigo-600" size={24} />,
      color: "border-indigo-200",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VALID":
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-[11px] font-bold rounded">VALID</span>;
      case "DITOLAK":
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-[11px] font-bold rounded">DITOLAK</span>;
      case "MENUNGGU":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-[11px] font-bold rounded">MENUNGGU</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-500 text-[11px] font-bold rounded">BELUM ISI</span>;
    }
  };

  return (
    <>
      {/* Page Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Dashboard Overview</h2>
          <p className="text-sm text-[#6b7280]">Statistik terkini sistem pendaftaran sekolah.</p>
        </div>
      </header>

      {/* Page Content */}
      <div className="px-8 py-6 flex flex-col gap-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map((card, idx) => (
            <div key={idx} className={`bg-white border border-gray-200 rounded-lg p-5 flex items-start justify-between`}>
              <div>
                <p className="text-sm text-[#6b7280] font-medium">{card.label}</p>
                <p className="text-2xl font-bold text-[#111827] mt-1">{card.value}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-md">
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Applicants */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#111827]">Pendaftar Terbaru</h3>
            <Link 
              href="/admin/pendaftar" 
              className="text-[#1e3a8a] text-xs font-bold hover:underline"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f9fafb] border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">NISN</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">Jalur</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">Status Berkas</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-[#6b7280] uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentApplicants.length > 0 ? (
                  recentApplicants.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#111827]">{user.berkas?.nama_pendaftar || user.username}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6b7280]">{user.berkas?.nisn_pendaftar || "-"}</td>
                      <td className="px-6 py-4 text-sm text-[#6b7280]">{user.berkas?.jenis_berkas || "-"}</td>
                      <td className="px-6 py-4">
                        {getStatusBadge(user.berkas?.status_validasi || "NONE")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/admin/pendaftar/${user.id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e3a8a] bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors"
                        >
                          <Eye size={14} />
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">Belum ada data pendaftar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
