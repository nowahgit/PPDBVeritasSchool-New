"use client";

import { Search, Filter } from "lucide-react";

interface FilterBarProps {
  search: string;
  status: string;
  limit: number;
}

const FilterBar = ({ search, status, limit }: FilterBarProps) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
      <form className="relative flex-1 w-full" action="/admin/pendaftar">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
        <input 
          name="search"
          defaultValue={search}
          type="text" 
          placeholder="Cari Nama Pendaftar atau NISN..." 
          className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900"
        />
        <input type="hidden" name="status" value={status} />
        <input type="hidden" name="limit" value={limit} />
      </form>

      <form action="/admin/pendaftar" className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <input type="hidden" name="search" value={search} />
        <input type="hidden" name="limit" value={limit} />
        
        <div className="flex items-center gap-3 bg-slate-50/50 border border-slate-200/60 rounded-xl px-4 py-2 group focus-within:border-blue-500 focus-within:bg-white transition-all flex-1 min-w-[200px]">
          <Filter className="text-slate-400" size={16} />
          <select 
            name="status"
            defaultValue={status}
            onChange={(e) => e.target.form?.requestSubmit()}
            className="bg-transparent border-none py-1.5 px-0 text-sm focus:ring-0 focus:outline-none font-bold text-slate-700 w-full"
          >
            <option value="ALL">Status Validasi</option>
            <option value="MENUNGGU">Menunggu</option>
            <option value="VALID">Valid</option>
            <option value="DITOLAK">Ditolak</option>
          </select>
        </div>
        
        <button 
          type="submit"
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-all uppercase tracking-tight"
        >
          Filter
        </button>
      </form>
    </div>
  );
};

export default FilterBar;
