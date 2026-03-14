import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "PANITIA") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(params.id);

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
