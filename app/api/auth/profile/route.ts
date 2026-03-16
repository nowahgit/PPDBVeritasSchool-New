import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { email, jenis_kelamin, asal_sekolah } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email wajib diisi" }, { status: 400 });
    }

    // Check if email already used by another user
    const existing = await prisma.user.findFirst({
      where: { 
        email,
        id: { not: parseInt(session.user.id) }
      },
    });

    if (existing) {
      return NextResponse.json({ message: "Email sudah digunakan" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: { 
        email,
        jenis_kelamin,
        asal_sekolah,
      },
    });

    return NextResponse.json({ message: "Profil berhasil diperbarui" });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
