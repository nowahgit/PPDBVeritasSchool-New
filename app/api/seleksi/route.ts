import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Pendaftar only sees their own; PANITIA sees all
    if (session.user.role === "PENDAFTAR") {
      const seleksi = await prisma.seleksi.findFirst({
        where: { user_id: parseInt(session.user.id) },
        orderBy: { created_at: "desc" },
      });
      return NextResponse.json(seleksi);
    }

    // PANITIA: return all
    const seleksi = await prisma.seleksi.findMany({
      include: { user: { select: { id: true, username: true } } },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(seleksi);
  } catch (error) {
    console.error("GET seleksi error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

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
          id_seleksi: Math.floor(Math.random() * 1000000),
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
