import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "PANITIA") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const id_berkas = parseInt(id);
    const { status_validasi, catatan } = await req.json();

    const updatedBerkas = await prisma.berkas.update({
      where: { id_berkas },
      data: {
        status_validasi,
        catatan,
        tanggal_validasi: new Date(),
      },
    });

    return NextResponse.json(updatedBerkas);
  } catch (error) {
    console.error("Validation update error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
