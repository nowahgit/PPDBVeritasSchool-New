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

    // Grouping manually since Prisma groupby is limited for what we want
    // We want the name, the earliest date, and count of participants
    const allSeleksi = await prisma.seleksi.findMany({
      orderBy: { nama_seleksi: "asc" }
    });

    const groups: Record<string, any> = {};

    allSeleksi.forEach(s => {
      if (!groups[s.nama_seleksi]) {
        groups[s.nama_seleksi] = {
          nama_seleksi: s.nama_seleksi,
          waktu_seleksi: s.waktu_seleksi,
          count: 0
        };
      }
      groups[s.nama_seleksi].count++;
    });

    return NextResponse.json(Object.values(groups));
  } catch (error) {
    console.error("GET selection periods error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
