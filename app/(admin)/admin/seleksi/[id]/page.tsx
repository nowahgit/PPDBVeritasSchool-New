import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, GraduationCap, Calculator, Award } from "lucide-react";
import { redirect } from "next/navigation";
import SeleksiForm from "@/components/admin/seleksi-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function SeleksiDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = parseInt(params.id);
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { 
      berkas: true,
      seleksi: {
        orderBy: { created_at: "desc" },
        take: 1
      }
    },
  });

  if (!user || user.berkas?.status_validasi !== "VALID") {
    redirect("/admin/seleksi");
  }

  // Get current admin's panitia ID
  if (!session || !session.user) redirect("/login");
  
  const admin = await prisma.admin.findUnique({
    where: { user_id: parseInt((session.user as any).id) }
  });

  if (!admin) {
    // If logged in as PANITIA but hasn't had an Admin record yet, we might need a fallback or create one.
    // For now, let's assume seed data or manual entry exists for panitia.
    return <div className="p-8 text-center text-danger font-bold">Admin record not found. Please contact database administrator.</div>;
  }

  const seleksi = user.seleksi[0] || null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div className="flex items-center gap-4">
        <Link href="/admin/seleksi" className="w-10 h-10 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-fast">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-primary">Input Hasil Seleksi</h1>
          <p className="text-xs text-text-muted font-bold uppercase tracking-tight">Calon Siswa: {user.berkas.nama_pendaftar}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[8px] border border-[#E5E7EB] shadow-subtle text-center">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
              <GraduationCap size={32} />
            </div>
            <h3 className="text-lg font-bold text-primary">{user.berkas.nama_pendaftar}</h3>
            <p className="text-xs text-text-muted font-bold uppercase mb-6">{user.berkas.nisn_pendaftar}</p>
            
            <div className="grid grid-cols-1 gap-3 text-left border-t border-[#F3F4F6] pt-6">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted font-bold">Asal Sekolah:</span>
                <span className="text-primary font-bold">Veritas Prep</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted font-bold">Status Berkas:</span>
                <span className="text-success font-extrabold uppercase">Valid</span>
              </div>
            </div>
          </div>

          <div className="bg-primary p-6 rounded-[8px] shadow-subtle text-white">
            <div className="flex items-center gap-3 mb-4">
              <Calculator size={20} />
              <h4 className="font-bold">Standar Kelulusan</h4>
            </div>
            <ul className="space-y-3 text-xs font-medium text-white/80">
              <li className="flex justify-between items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-1.5 flex-shrink-0"></span>
                <span>Rata-rata nilai rapor minimal 75.00</span>
              </li>
              <li className="flex justify-between items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-1.5 flex-shrink-0"></span>
                <span>Dokumen pendukung (prestasi) memberikan bobot tambahan.</span>
              </li>
              <li className="flex justify-between items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-1.5 flex-shrink-0"></span>
                <span>Hasil akhir ditentukan melalui rapat pleno panitia.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="md:col-span-2">
          <SeleksiForm 
            userId={userId} 
            panitiaId={admin.id_panitia}
            initialData={seleksi}
          />
        </div>
      </div>
    </div>
  );
}
