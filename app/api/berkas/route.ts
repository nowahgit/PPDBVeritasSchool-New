import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const berkasSchema = z.object({
  user_id: z.number().optional(), // Allow explicit user_id for admin
  nisn_pendaftar: z.string().min(10),
  nama_pendaftar: z.string().min(3),
  tanggallahir_pendaftar: z.string(),
  alamat_pendaftar: z.string().min(5),
  agama: z.string(),
  prestasi: z.string().optional().nullable(),
  nama_ortu: z.string().min(3),
  pekerjaan_ortu: z.string().min(3),
  no_hp_ortu: z.string().min(10),
  alamat_ortu: z.string().min(5),
  jenis_berkas: z.string(),
  file_path: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = berkasSchema.parse(body);

    let targetUserId = parseInt(session.user.id);

    // If admin is adding/updating, use the user_id from body
    if (session.user.role === "PANITIA" && body.user_id) {
      targetUserId = body.user_id;
    }

    const { user_id, ...restData } = validatedData;

    const berkas = await prisma.berkas.upsert({
      where: { user_id: targetUserId },
      update: {
        ...restData,
        tanggallahir_pendaftar: new Date(validatedData.tanggallahir_pendaftar),
        status_validasi: session.user.role === "PANITIA" ? "VALID" : "MENUNGGU", 
        catatan: null,
      },
      create: {
        ...restData,
        user_id: targetUserId,
        tanggallahir_pendaftar: new Date(validatedData.tanggallahir_pendaftar),
        id_berkas: Math.floor(Math.random() * 1000000), // Manually generate since not autoincrement in model?
        status_validasi: session.user.role === "PANITIA" ? "VALID" : "MENUNGGU",
      },
    });

    return NextResponse.json(berkas, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid data", errors: error.errors }, { status: 400 });
    }
    console.error("Berkas submission error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
