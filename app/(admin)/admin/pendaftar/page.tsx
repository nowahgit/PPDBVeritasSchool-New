"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical
} from "lucide-react";

interface Pendaftar {
  id: number;
  username: string;
  berkas: {
    nama_pendaftar: string;
    nisn_pendaftar: string;
    jenis_berkas: string;
    status_validasi: string;
    tanggal_pendaftaran?: string; // Assume created_at if not in berkas
  } | null;
  created_at: string;
}

export default function PendaftarListPage() {
  const [data, setData] = useState<Pendaftar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("SEMUA");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/pendaftar");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to fetch pendaftar", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = data.filter((item) => {
    const nameMatch = (item.berkas?.nama_pendaftar || item.username)
      .toLowerCase()
      .includes(search.toLowerCase());
    const nisnMatch = item.berkas?.nisn_pendaftar?.includes(search) || false;
    const statusMatch = statusFilter === "SEMUA" || item.berkas?.status_validasi === statusFilter;
    
    return (nameMatch || nisnMatch) && statusMatch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VALID":
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">VALID</span>;
      case "DITOLAK":
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">DITOLAK</span>;
      case "MENUNGGU":
        return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded">MENUNGGU</span>;
      default:
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded">BELUM ISI</span>;
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Daftar Pendaftar</h2>
          <p className="text-sm text-[#6b7280]">Manajemen seluruh berkas pendaftaran siswa baru.</p>
        </div>
        <Link 
          href="/admin/pendaftar/tambah"
          className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-blue-800 transition-colors"
        >
          <Plus size={16} />
          Tambah Pendaftar
        </Link>
      </header>

      <div className="px-8 py-6 flex flex-col gap-4">
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari Nama atau NISN..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1e3a8a] transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 shrink-0">
            <Filter className="text-gray-400 ml-1" size={16} />
            <select 
              className="bg-transparent border-none py-2 px-2 text-sm focus:ring-0 focus:outline-none font-medium text-[#111827]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="SEMUA">Semua Status</option>
              <option value="MENUNGGU">Menunggu</option>
              <option value="VALID">Valid</option>
              <option value="DITOLAK">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shrink-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f9fafb] border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-bold text-[#6b7280] uppercase tracking-wider w-12 text-center">No</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">Nama Lengkap</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">NISN</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">Jalur</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-[#6b7280] uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#1e3a8a] rounded-full animate-spin"></div>
                        <p className="text-sm font-medium text-gray-500">Memuat data...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-[#6b7280] font-medium text-center">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#111827]">{item.berkas?.nama_pendaftar || item.username}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6b7280]">{item.berkas?.nisn_pendaftar || "-"}</td>
                      <td className="px-6 py-4 text-sm text-[#6b7280]">{item.berkas?.jenis_berkas || "-"}</td>
                      <td className="px-6 py-4">
                        {getStatusBadge(item.berkas?.status_validasi || "NONE")}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6b7280]">
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/admin/pendaftar/${item.id}`}
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
                    <td colSpan={7} className="px-6 py-20 text-center text-sm text-gray-400">Pendaftar tidak ditemukan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Placeholder */}
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-[#f9fafb]">
            <p className="text-xs text-[#6b7280] font-medium">Menampilkan {filteredData.length} pendaftar</p>
            <div className="flex items-center gap-2">
              <button disabled className="p-1 rounded border border-gray-200 bg-white text-gray-300 disabled:opacity-50">
                <ChevronLeft size={16} />
              </button>
              <button disabled className="p-1 rounded border border-gray-200 bg-white text-gray-300 disabled:opacity-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
