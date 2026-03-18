import React from "react";
import Link from "next/link";
import { 
  Archive, 
  ExternalLink, 
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  ArrowRight
} from "lucide-react";
import { getArchivedPeriods } from "../actions";

export const dynamic = 'force-dynamic'

export default async function ArsipSeleksiPage() {
  const archives = await getArchivedPeriods();

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Arsip Seleksi</h2>
          <p className="text-sm text-[#6b7280]">Riwayat data seleksi yang telah selesai dan diarsipkan.</p>
        </div>
      </header>

      <div className="px-8 py-8 flex flex-col gap-6 bg-[#f8fafc]/50 flex-1">
        {archives.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-20 text-center shadow-sm">
            <Archive size={64} className="text-gray-100 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-400">Belum ada arsip</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
              Silakan selesaikan periode seleksi aktif dan gunakan tombol "Arsipkan" untuk memindahkannya ke sini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {archives.map((archive) => (
              <div key={archive.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                {/* Card Header */}
                <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <Archive size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#111827]">{archive.nama_periode}</h3>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Calendar size={12} />
                          Diarsipkan pada {new Date(archive.tanggal_arsip).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <Link 
                      href={`/admin/seleksi/arsip/${archive.id}`}
                      className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Lihat Detail"
                    >
                      <ExternalLink size={18} />
                    </Link>
                  </div>
                </div>

                {/* Card Stats */}
                <div className="p-6 grid grid-cols-3 gap-4 border-b border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</span>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-gray-400" />
                      <span className="text-lg font-black text-[#111827]">{archive.total_pendaftar}</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-green-500/70 uppercase tracking-widest mb-1">Lulus</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-green-500" />
                      <span className="text-lg font-black text-green-600">{archive.total_lulus}</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-rose-500/70 uppercase tracking-widest mb-1">Gagal</span>
                    <div className="flex items-center gap-2">
                       <XCircle size={14} className="text-rose-500" />
                       <span className="text-lg font-black text-rose-600">{archive.total_tidak_lulus}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <Link 
                  href={`/admin/seleksi/arsip/${archive.id}`}
                  className="px-6 py-4 bg-white hover:bg-gray-50 flex items-center justify-between transition-colors group/link"
                >
                  <span className="text-xs font-bold text-[#111827]">Lihat rincian pendaftar</span>
                  <ArrowRight size={14} className="text-gray-300 group-hover/link:translate-x-1 group-hover/link:text-blue-600 transition-all" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
