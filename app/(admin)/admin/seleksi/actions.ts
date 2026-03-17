"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function archiveSelectionPeriod(nama_seleksi: string) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Fetch the Selection Period definition
      const period = await tx.selectionPeriod.findFirst({
        where: { nama: nama_seleksi }
      });

      // 2. Fetch all participants and their results for this period
      const seleksiRecords = await tx.seleksi.findMany({
        where: { nama_seleksi },
        include: {
          user: {
            include: {
              berkas: true
            }
          }
        }
      });

      if (seleksiRecords.length === 0 && !period) {
        throw new Error("Tidak ada data untuk periode ini.");
      }

      // 3. Calculate summary
      const total_pendaftar = seleksiRecords.length;
      const total_lulus = seleksiRecords.filter(s => s.status_seleksi === "LULUS").length;
      const total_tidak_lulus = seleksiRecords.filter(s => s.status_seleksi === "TIDAK_LULUS").length;

      // 4. Create snapshot data
      const data_pendaftar = seleksiRecords.map(s => ({
        id: s.user.id,
        nama: s.user.berkas?.nama_pendaftar || s.user.username,
        email: s.user.email,
        username: s.user.username,
        nisn: s.user.berkas?.nisn_pendaftar,
        nilai: {
          smt1: s.nilai_smt1,
          smt2: s.nilai_smt2,
          smt3: s.nilai_smt3,
          smt4: s.nilai_smt4,
          smt5: s.nilai_smt5,
          rata_rata: (s.nilai_smt1 + s.nilai_smt2 + s.nilai_smt3 + s.nilai_smt4 + s.nilai_smt5) / 5
        },
        status: s.status_seleksi,
        waktu_seleksi: s.waktu_seleksi
      }));

      // 5. Save to ArsipSeleksi (Permanent Snapshot)
      await tx.arsipSeleksi.create({
        data: {
          nama_periode: nama_seleksi,
          deskripsi: period?.deskripsi || `Arsip otomatis untuk periode ${nama_seleksi}`,
          tanggal_buka: period?.tanggal_buka || seleksiRecords[0]?.waktu_seleksi || new Date(),
          tanggal_tutup: period?.tanggal_tutup || seleksiRecords[0]?.waktu_seleksi || new Date(),
          total_pendaftar,
          total_lulus,
          total_tidak_lulus,
          data_pendaftar: JSON.stringify(data_pendaftar),
        }
      });

      // 6. Hard Cleanup (Reset active data to 0)
      const userIds = seleksiRecords.map(s => s.user.id);

      // Delete Seleksi records
      await tx.seleksi.deleteMany({
        where: { nama_seleksi }
      });

      // Delete Berkas for these users (if any)
      if (userIds.length > 0) {
        await tx.berkas.deleteMany({
          where: { user_id: { in: userIds } }
        });

        // Delete Users with role PENDAFTAR (resetting the pendaftar count)
        await tx.user.deleteMany({
          where: { 
            id: { in: userIds },
            role: "PENDAFTAR"
          }
        });
      }

      // Delete the SelectionPeriod record itself
      if (period) {
        await tx.selectionPeriod.delete({
          where: { id: period.id }
        });
      }

      revalidatePath("/admin/seleksi");
      revalidatePath("/admin/seleksi/arsip");
      revalidatePath("/admin/pendaftar");
      revalidatePath("/admin");

      return { success: true, message: "Berhasil diarsipkan" };
    });
  } catch (error: any) {
    console.error("Archive transaction failed:", error);
    return { success: false, message: error.message };
  }
}

export async function getArchivedPeriods() {
  return await prisma.arsipSeleksi.findMany({
    orderBy: { tanggal_arsip: "desc" }
  });
}

export async function getArchiveDetail(id: number) {
  if (!id) throw new Error("ID arsip tidak ditemukan");
  
  return await prisma.arsipSeleksi.findUnique({
    where: { id: Number(id) }
  });
}

export async function deleteArchivePermanently(id: number) {
  await prisma.arsipSeleksi.delete({
    where: { id }
  });
  revalidatePath("/admin/seleksi/arsip");
}

export async function tambahPeriode(data: { nama_seleksi: string; waktu_seleksi: string; nilai_minimum: number }) {
  try {
    // Since SelectionPeriod has tanggal_buka/tutup, we'll use waktu_seleksi for both or as needed.
    // We'll store the min score in the description for now as a reference.
    const date = new Date(data.waktu_seleksi);
    
    await prisma.selectionPeriod.create({
      data: {
        nama: data.nama_seleksi,
        deskripsi: `Nilai Minimum: ${data.nilai_minimum}`,
        tanggal_buka: date,
        tanggal_tutup: date, // Placeholder
      }
    });

    revalidatePath("/admin/seleksi");
    revalidatePath("/admin/seleksi/periode");
    revalidatePath("/admin");
    
    return { success: true };
  } catch (error: any) {
    console.error("Tambah periode error:", error);
    return { success: false, message: error.message };
  }
}
