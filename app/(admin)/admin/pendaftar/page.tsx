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

export const dynamic = 'force-dynamic'

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
