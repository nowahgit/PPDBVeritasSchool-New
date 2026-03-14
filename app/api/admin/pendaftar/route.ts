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
