"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, Printer } from "lucide-react";
import { deleteArchivePermanently } from "../../actions";
import DialogCard from "@/components/ui/DialogCard";

export default function ArchiveDetailClient({ id }: { id: number }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    setShowConfirm(false);
    try {
      await deleteArchivePermanently(id);
      router.push("/admin/seleksi/arsip");
      router.refresh();
    } catch (error) {
       alert("Gagal menghapus arsip.");
       setIsDeleting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <button 
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <Printer size={14} />
        Cetak Laporan (PDF)
      </button>

      <button 
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100 transition-colors disabled:opacity-50"
      >
        {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        Hapus Permanen
      </button>

      <DialogCard
        isOpen={showConfirm}
        type="error"
        title="Hapus Arsip Permanen?"
        description="Data arsip ini akan dihapus selamanya dari database dan tidak dapat dikembalikan. Apakah Anda yakin?"
        confirmLabel="Ya, Hapus Selamanya"
        showConfirm
        onConfirm={handleDelete}
        onClose={() => setShowConfirm(false)}
      />
    </>
  );
}
