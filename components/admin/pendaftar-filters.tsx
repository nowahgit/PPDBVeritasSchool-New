"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Search as SearchIcon } from "lucide-react";

interface PendaftarFiltersProps {
  initialSearch: string;
  initialStatus: string;
}

export default function PendaftarFilters({ initialSearch, initialStatus }: PendaftarFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    router.push(`/admin/pendaftar?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    router.push(`/admin/pendaftar?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 relative">
        <form onSubmit={handleSearchSubmit}>
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            name="search"
            defaultValue={initialSearch}
            type="text" 
            placeholder="Cari Nama atau NISN..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-[8px] text-sm focus:ring-2 focus:ring-primary/10 focus:outline-none transition-fast shadow-subtle"
          />
        </form>
      </div>
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
        <select 
          className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-[8px] text-sm focus:ring-2 focus:ring-primary/10 focus:outline-none transition-fast appearance-none shadow-subtle cursor-pointer"
          onChange={(e) => handleStatusChange(e.target.value)}
          defaultValue={initialStatus}
        >
          <option value="">Semua Status Berkas</option>
          <option value="MENUNGGU">MENUNGGU</option>
          <option value="VALID">VALID</option>
          <option value="DITOLAK">DITOLAK</option>
        </select>
      </div>
    </div>
  );
}
