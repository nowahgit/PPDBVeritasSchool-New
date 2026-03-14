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

    const body = await req.json();
    const { 
      user_id, 
      nama_seleksi, 
      waktu_seleksi,
      nilai_smt1,
      nilai_smt2,
      nilai_smt3,
      nilai_smt4,
      nilai_smt5
    } = body;

    // Check if seleksi record already exists for this user
    const existing = await prisma.seleksi.findFirst({
      where: { user_id }
    });

    if (existing) {
      const updated = await prisma.seleksi.update({
        where: { id_seleksi: existing.id_seleksi },
        data: {
          nilai_smt1,
          nilai_smt2,
          nilai_smt3,
          nilai_smt4,
          nilai_smt5,
          updated_at: new Date()
        }
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.seleksi.create({
        data: {
          id_seleksi: Math.floor(Math.random() * 1000000), // Random ID since it's not autoincrement in model? Wait, schema says Int @id @default(autoincrement()) usually but here it just says Int @id
          id_panitia: parseInt(session.user.id),
          user_id,
          nama_seleksi,
          waktu_seleksi: new Date(waktu_seleksi),
          nilai_smt1,
          nilai_smt2,
          nilai_smt3,
          nilai_smt4,
          nilai_smt5,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error("POST seleksi error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
