import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "PANITIA") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const pendaftar = await prisma.user.findMany({
      where: { role: "PENDAFTAR" },
      include: {
        berkas: true,
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(pendaftar);
  } catch (error) {
    console.error("GET pendaftar error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "PANITIA") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { username, password, email, jenis_kelamin, asal_sekolah } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Username sudah digunakan" }, { status: 400 });
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        jenis_kelamin,
        asal_sekolah,
        role: "PENDAFTAR",
      },
    });

    return NextResponse.json({ message: "Pendaftar berhasil ditambahkan", userId: user.id }, { status: 201 });
  } catch (error) {
    console.error("POST pendaftar error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
