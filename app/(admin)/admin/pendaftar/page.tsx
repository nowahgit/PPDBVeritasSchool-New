import React from "react";
import Link from "next/link";
import { 
  Plus, 
  UserPlus
} from "lucide-react";
import { getPendaftar } from "./actions";
import PendaftarTable from "./PendaftarTable";
import Pagination from "./Pagination";
import FilterBar from "./FilterBar";

export default async function PendaftarListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const search = (searchParams.search as string) || "";
  const status = (searchParams.status as string) || "ALL";

  const { pendaftar, meta } = await getPendaftar({
    page,
    limit,
    search,
    status,
  });

  return (
    <>
      <header className="bg-white border-b border-gray-100 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
            <UserPlus size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              Data Pendaftar
            </h1>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest leading-none">
              Manajemen Pendaftaran Siswa Baru
            </p>
          </div>
        </div>
        
        <Link 
          href="/admin/pendaftar/tambah"
          className="bg-[#1e3a8a] hover:bg-blue-800 text-white px-6 py-3 rounded-xl text-sm font-extrabold flex items-center gap-2.5 transition-all shadow-lg shadow-blue-900/10 active:scale-[0.98] uppercase tracking-tighter"
        >
          <Plus size={18} strokeWidth={3} />
          Registrasi Pendaftar
        </Link>
      </header>

      <div className="px-8 py-8 flex flex-col gap-6 bg-[#f8fafc]/50">
        <FilterBar search={search} status={status} limit={limit} />

        {/* Table Container */}
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <PendaftarTable pendaftar={pendaftar} />
          <Pagination 
            total={meta.total}
            page={meta.page}
            limit={meta.limit}
            totalPages={meta.totalPages}
          />
        </div>
      </div>
    </>
  );
}
