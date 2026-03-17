import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ChevronLeft, 
  Trash2, 
  Download, 
  Printer, 
  FileJson,
  Users,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { getArchiveDetail } from "../../actions";
import ArchiveDetailClient from "./ArchiveDetailClient";

export default async function ArsipDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  
  if (isNaN(id)) notFound();

  const archive = await getArchiveDetail(id);

  if (!archive) {
    notFound();
  }

  const pendaftarData = JSON.parse(archive.data_pendaftar as string);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/admin/seleksi/arsip" className="text-gray-400 hover:text-[#1e3a8a] transition-colors p-2 hover:bg-gray-50 rounded-lg">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h2 className="text-lg font-semibold text-[#111827]">{archive.nama_periode}</h2>
            <p className="text-sm text-[#6b7280]">Detail arsip seleksi otomatis.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ArchiveDetailClient id={archive.id} />
        </div>
      </header>

      <div className="px-8 py-8 flex flex-col gap-8 bg-[#f8fafc]/50 flex-1 print-area">
        {/* Summary Header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Peserta</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-[#111827]">{archive.total_pendaftar}</span>
              <Users className="text-gray-200" size={32} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-green-500">
            <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-2">Diterima</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-green-600">{archive.total_lulus}</span>
              <CheckCircle2 className="text-green-100" size={32} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-rose-500">
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Tidak Diterima</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-rose-600">{archive.total_tidak_lulus}</span>
              <XCircle className="text-rose-100" size={32} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Dibuat Pada</p>
            <p className="text-sm font-bold text-[#111827] mt-2">
              {new Date(archive.tanggal_arsip).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
            <h3 className="text-sm font-black text-[#111827] uppercase tracking-widest">Daftar Pendaftar (Snapshot)</h3>
            <span className="px-3 py-1 bg-gray-200 text-gray-600 text-[10px] font-black rounded-full uppercase">Read Only</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-12 text-center">No</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pendaftar</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">NISN</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Rata-rata Nilai</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Keputusan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {pendaftarData.map((p: any, idx: number) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-center text-gray-400 font-medium">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#111827]">{p.nama}</span>
                        <span className="text-xs text-gray-400">{p.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{p.nisn || "-"}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-black text-[#1e3a8a]">{p.nilai.rata_rata.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {p.status === "LULUS" ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest">Lulus</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest">Tidak Lulus</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
