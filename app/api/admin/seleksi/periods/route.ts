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

    // 1. Fetch defined periods
    const definedPeriods = await prisma.selectionPeriod.findMany({
      orderBy: { created_at: "desc" }
    });

    // 2. Fetch all active seleksi records to count participants and handle legacy periods
    const allSeleksi = await prisma.seleksi.findMany({
      where: { is_archived: false },
      orderBy: { nama_seleksi: "asc" }
    });

    const groups: Record<string, any> = {};

    // First, populate with defined periods
    definedPeriods.forEach(p => {
      groups[p.nama] = {
        nama_seleksi: p.nama,
        waktu_seleksi: p.tanggal_buka,
        count: 0
      };
    });

    // Then add participant counts (and handle periods that might not be in SelectionPeriod but are in Seleksi)
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
