"use client";

import Link from "next/link";
import { Eye, FileText, UserIcon, MoreVertical } from "lucide-react";

interface Pendaftar {
  id: number;
  username: string;
  asal_sekolah: string | null;
  jenis_kelamin: string | null;
  berkas: {
    nama_pendaftar: string;
    nisn_pendaftar: string;
    status_validasi: string;
  } | null;
  rata_rata: number | null;
  seleksi: {
    status_seleksi: string;
  }[];
}

interface PendaftarTableProps {
  pendaftar: Pendaftar[];
}

const PendaftarTable = ({ pendaftar }: PendaftarTableProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VALID":
        return <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-sm border border-emerald-200">VALID</span>;
      case "DITOLAK":
        return <span className="px-2.5 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-black rounded-sm border border-rose-200">DITOLAK</span>;
      case "MENUNGGU":
        return <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black rounded-sm border border-amber-200">MENUNGGU</span>;
      default:
        return <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-black rounded-sm border border-gray-200 uppercase">{status}</span>;
    }
  };

  const getSeleksiBadge = (status: string) => {
    switch (status) {
      case "LULUS":
        return <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-sm border border-indigo-200">LULUS</span>;
      case "TIDAK_LULUS":
        return <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] font-black rounded-sm border border-zinc-200 uppercase">GAGAL</span>;
      default:
        return <span className="px-2.5 py-0.5 bg-gray-100 text-gray-400 text-[10px] font-black rounded-sm border border-gray-200 uppercase">{status}</span>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#f8fafc] border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-center">No</th>
            <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Informasi Pendaftar</th>
            <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-center">NISN</th>
            <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-center">Gender</th>
            <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-center">Validasi</th>
            <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-center">Seleksi</th>
            <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-center">Rata²</th>
            <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {pendaftar.length > 0 ? (
            pendaftar.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-6 py-5 text-sm text-slate-400 font-bold text-center">{idx + 1}</td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 leading-none mb-1 group-hover:text-blue-700 transition-colors">
                      {item.berkas?.nama_pendaftar || item.username}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 leading-none">
                      {item.asal_sekolah || "Sekolah tidak diisi"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm font-semibold text-slate-600 text-center uppercase tracking-tight">
                  {item.berkas?.nisn_pendaftar || "-"}
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                    item.jenis_kelamin === 'L' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'
                  }`}>
                    {item.jenis_kelamin || "-"}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  {getStatusBadge(item.berkas?.status_validasi || "NONE")}
                </td>
                <td className="px-6 py-5 text-center">
                  {getSeleksiBadge(item.seleksi[0]?.status_seleksi || "WAITING")}
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`text-sm font-bold ${
                    item.rata_rata ? (item.rata_rata >= 80 ? 'text-emerald-600' : 'text-slate-700') : 'text-slate-300'
                  }`}>
                    {item.rata_rata ? item.rata_rata.toFixed(1) : "-"}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      href={`/admin/pendaftar/${item.id}`}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-600 px-3.5 py-2 rounded-md transition-all uppercase tracking-tighter"
                    >
                      <Eye size={14} />
                      Detail
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="px-6 py-24 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pendaftar Tidak Ditemukan</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PendaftarTable;
