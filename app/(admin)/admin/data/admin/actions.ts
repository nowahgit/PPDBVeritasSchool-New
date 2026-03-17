"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getAdminData() {
  const admins = await prisma.admin.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
        },
      },
    },
    orderBy: {
      nama_panitia: "asc",
    },
  });

  return admins;
}

export async function createAdmin(data: any) {
  try {
    const { username, password, email, nama_panitia, no_hp } = data;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      throw new Error("Username atau Email sudah terdaftar.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username,
          password: hashedPassword,
          email,
          role: "PANITIA",
        },
      });

      await tx.admin.create({
        data: {
          user_id: user.id,
          nama_panitia,
          no_hp,
        },
      });
    });

    revalidatePath("/admin/data/admin");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateAdmin(id_panitia: number, data: any) {
  try {
    const { username, password, email, nama_panitia, no_hp } = data;

    const admin = await prisma.admin.findUnique({
      where: { id_panitia },
    });

    if (!admin) throw new Error("Admin tidak ditemukan.");

    const updateData: any = {
      username,
      email,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: admin.user_id },
        data: updateData,
      });

      await tx.admin.update({
        where: { id_panitia },
        data: {
          nama_panitia,
          no_hp,
        },
      });
    });

    revalidatePath("/admin/data/admin");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteAdmin(id_panitia: number) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id_panitia },
    });

    if (!admin) throw new Error("Admin tidak ditemukan.");

    await prisma.$transaction(async (tx) => {
      await tx.admin.delete({
        where: { id_panitia },
      });

      await tx.user.delete({
        where: { id: admin.user_id },
      });
    });

    revalidatePath("/admin/data/admin");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
