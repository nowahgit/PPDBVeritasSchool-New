import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "PANITIA") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { nama_seleksi, nilai_minimum } = await req.json();

    // 1. Get all pendaftar with VALID berkas for this selection name
    const candidates = await prisma.seleksi.findMany({
      where: {
        nama_seleksi: nama_seleksi,
      },
      include: {
        user: {
          include: {
             berkas: true
          }
        }
      }
    });

    // Filter to only those with VALID berkas
    const validCandidates = candidates.filter(c => c.user.berkas?.status_validasi === "VALID");

    let lulusCount = 0;
    let tidakLulusCount = 0;

    // 2. Loop through each and calculate average
    for (const candidate of validCandidates) {
      const average = (
        candidate.nilai_smt1 + 
        candidate.nilai_smt2 + 
        candidate.nilai_smt3 + 
        candidate.nilai_smt4 + 
        candidate.nilai_smt5
      ) / 5;

      const newStatus = average >= nilai_minimum ? "LULUS" : "TIDAK_LULUS";

      await prisma.seleksi.update({
        where: { id_seleksi: candidate.id_seleksi },
        data: {
          status_seleksi: newStatus,
          updated_at: new Date()
        }
      });

      if (newStatus === "LULUS") lulusCount++;
      else tidakLulusCount++;
    }

    return NextResponse.json({
      message: "Seleksi selesai",
      lulus: lulusCount,
      tidak_lulus: tidakLulusCount
    });
  } catch (error) {
    console.error("Run selection error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
