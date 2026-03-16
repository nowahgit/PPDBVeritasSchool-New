import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);

    // Pendaftar only can see their own berkas
    if (session.user.role === "PENDAFTAR" && parseInt(session.user.id) !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const berkas = await prisma.berkas.findUnique({
      where: { user_id: userId },
    });

    if (!berkas) {
      return NextResponse.json({ message: "Berkas tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(berkas);
  } catch (error) {
    console.error("GET berkas by id error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "PANITIA") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const id_berkas = parseInt(id);
    const body = await req.json();

    const updated = await prisma.berkas.update({
      where: { id_berkas },
      data: {
        ...body,
        ...(body.tanggallahir_pendaftar && {
          tanggallahir_pendaftar: new Date(body.tanggallahir_pendaftar),
        }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH berkas error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
