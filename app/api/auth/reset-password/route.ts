import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ message: "Token dan password wajib diisi" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        reset_token: token,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Token tidak valid" }, { status: 400 });
    }

    if (user.reset_token_expiry && user.reset_token_expiry < new Date()) {
      return NextResponse.json({ message: "Token kadaluarsa" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
      },
    });

    return NextResponse.json({ message: "Password berhasil diubah" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
