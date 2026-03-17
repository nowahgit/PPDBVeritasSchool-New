"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateDataDiri(formData: any) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const userId = Number(session.user.id);

  try {
    await prisma.$transaction(async (tx) => {
      // Update User table
      await tx.user.update({
        where: { id: userId },
        data: {
          email: formData.email,
          jenis_kelamin: formData.jenis_kelamin,
          asal_sekolah: formData.asal_sekolah,
        }
      });

      // Update Berkas table
      await tx.berkas.update({
        where: { user_id: userId },
        data: {
          nama_pendaftar: formData.nama_pendaftar,
          nisn_pendaftar: formData.nisn_pendaftar,
          tanggallahir_pendaftar: new Date(formData.tanggallahir_pendaftar),
          alamat_pendaftar: formData.alamat_pendaftar,
          agama: formData.agama,
          prestasi: formData.prestasi,
          nama_ortu: formData.nama_ortu,
          pekerjaan_ortu: formData.pekerjaan_ortu,
          no_hp_ortu: formData.no_hp_ortu,
          alamat_ortu: formData.alamat_ortu,
        }
      });
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/data-diri");
    return { success: true };
  } catch (error: any) {
    console.error("Update data diri error:", error);
    return { success: false, message: error.message };
  }
}

export async function updatePassword(formData: any) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const userId = Number(session.user.id);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(formData.oldPassword, user.password);
    if (!isMatch) return { success: false, message: "Password lama tidak cocok" };

    const hashedPassword = await bcrypt.hash(formData.newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function uploadBerkas(filePath: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const userId = Number(session.user.id);

  try {
    await prisma.berkas.update({
      where: { user_id: userId },
      data: {
        file_path: filePath,
        status_validasi: "MENUNGGU",
      }
    });

    revalidatePath("/dashboard/berkas");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
