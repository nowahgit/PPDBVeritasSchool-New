import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "PANITIA") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        berkas: true,
        seleksi: {
          orderBy: { created_at: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET pendaftar detail error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "PANITIA") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    const { username, password, email, asal_sekolah, jenis_kelamin } = await req.json();

    if (!username) {
      return NextResponse.json({ message: "Username wajib diisi" }, { status: 400 });
    }

    // Check if username used by another user
    const existingUsername = await prisma.user.findFirst({
      where: {
        username,
        id: { not: userId }
      }
    });

    if (existingUsername) {
      return NextResponse.json({ message: "Username sudah digunakan" }, { status: 400 });
    }

    // Check email uniqueness if provided
    if (email) {
      const existingEmail = await prisma.user.findFirst({
        where: {
          email,
          id: { not: userId }
        }
      });
      if (existingEmail) {
        return NextResponse.json({ message: "Email sudah digunakan" }, { status: 400 });
      }
    }

    const updateData: any = { 
      username,
      email,
      asal_sekolah,
      jenis_kelamin
    };
    
    if (password && password.trim() !== "") {
      const bcrypt = require("bcryptjs");
      updateData.password = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ message: "Akun pendaftar berhasil diperbarui" });
  } catch (error) {
    console.error("PATCH pendaftar detail error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "PANITIA") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);

    // Delete related records first if not using CASCADE in DB
    // Berkas and Seleksi have foreign keys to User.id
    
    // We can use a transaction to ensure all related data is deleted
    await prisma.$transaction([
      prisma.berkas.deleteMany({ where: { user_id: userId } }),
      prisma.seleksi.deleteMany({ where: { user_id: userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    return NextResponse.json({ message: "Pendaftar berhasil dihapus permanen" });
  } catch (error) {
    console.error("DELETE pendaftar error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
