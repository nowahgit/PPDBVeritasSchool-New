"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const Pagination = ({ total, page, limit, totalPages }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleLimitChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newLimit);
    params.set("page", "1"); // reset to page 1
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between bg-white gap-4">
      <div className="flex items-center gap-4">
        <p className="text-xs text-[#6b7280] font-medium uppercase tracking-wider">
          Menampilkan <span className="text-[#111827] font-bold">{(page - 1) * limit + 1}</span> -{" "}
          <span className="text-[#111827] font-bold">
            {Math.min(page * limit, total)}
          </span>{" "}
          dari <span className="text-[#111827] font-bold">{total}</span> Pendaftar
        </p>
        
        <div className="flex items-center gap-2 ml-4">
          <label className="text-xs text-[#6b7280] font-bold uppercase tracking-wider">Show:</label>
          <select 
            className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs font-semibold text-[#111827] focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={limit}
            onChange={(e) => handleLimitChange(e.target.value)}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1.5 font-bold">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        
        <div className="flex items-center gap-1">
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            // Short logic to show some pages
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= page - 1 && pageNum <= page + 1)
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`min-w-[32px] h-8 flex items-center justify-center rounded text-xs transition-colors ${
                    pageNum === page
                      ? "bg-[#1e3a8a] text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-blue-400"
                  }`}
                >
                  {pageNum}
                </button>
              );
            } else if (
              (pageNum === 2 && page > 3) ||
              (pageNum === totalPages - 1 && page < totalPages - 2)
            ) {
              return <span key={pageNum} className="px-1 text-gray-400">...</span>;
            }
            return null;
          })}
        </div>

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
