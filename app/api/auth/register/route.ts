import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  username: z.string().min(4).max(20),
  password: z.string().min(6),
  email: z.string().email().optional(),
  jenis_kelamin: z.enum(["Laki-laki", "Perempuan"]).optional(),
  asal_sekolah: z.string().max(100).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Registration body:", body);
    const { username, password, email, jenis_kelamin, asal_sekolah } = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username sudah digunakan" },
        { status: 400 }
      );
    }

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

    return NextResponse.json(
      { message: "Registrasi berhasil", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Data tidak valid", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);

    // Handle Prisma unique constraint error
    if ((error as any).code === 'P2002') {
      const target = (error as any).meta?.target;
      if (target?.includes('email')) {
        return NextResponse.json({ message: "Email sudah digunakan" }, { status: 400 });
      }
      if (target?.includes('username')) {
        return NextResponse.json({ message: "Username sudah digunakan" }, { status: 400 });
      }
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
