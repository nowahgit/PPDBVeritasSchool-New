import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "PANITIA") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { nama_panitia, no_hp } = await req.json();

    if (!nama_panitia || !no_hp) {
      return NextResponse.json({ message: "Nama dan No HP wajib diisi" }, { status: 400 });
    }

    const userId = parseInt((session.user as any).id);

    await prisma.admin.upsert({
      where: { user_id: userId },
      update: {
        nama_panitia,
        no_hp,
      },
      create: {
        user_id: userId,
        nama_panitia,
        no_hp,
      },
    });

    return NextResponse.json({ message: "Profil admin berhasil diperbarui" });
  } catch (error) {
    console.error("Update admin profile error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "PANITIA") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt((session.user as any).id);

    const admin = await prisma.admin.findUnique({
      where: { user_id: userId },
    });

    if (!admin) {
      return NextResponse.json({ message: "Admin profile not found" }, { status: 404 });
    }

    return NextResponse.json(admin);
  } catch (error) {
    console.error("GET admin profile error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
