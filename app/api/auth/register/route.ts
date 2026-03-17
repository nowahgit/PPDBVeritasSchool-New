import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  // User Data
  username: z.string().min(4, "Username minimal 4 karakter").max(20, "Username maksimal 20 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  email: z.string().email("Format email tidak valid"),
  jenis_kelamin: z.string().min(1, "Jenis kelamin wajib dipilih"),
  asal_sekolah: z.string().min(1, "Asal sekolah wajib diisi").max(100, "Nama sekolah terlalu panjang"),

  // Berkas Data
  nama_pendaftar: z.string().min(1, "Nama lengkap wajib diisi"),
  nisn_pendaftar: z.string().min(10, "NISN minimal 10 digit"),
  tanggallahir_pendaftar: z.string().min(1, "Tanggal lahir wajib diisi"),
  alamat_pendaftar: z.string().min(1, "Alamat wajib diisi"),
  agama: z.string().min(1, "Agama wajib diisi"),
  nama_ortu: z.string().min(1, "Nama orang tua wajib diisi"),
  pekerjaan_ortu: z.string().min(1, "Pekerjaan orang tua wajib diisi"),
  no_hp_ortu: z.string().min(10, "Nomor HP orang tua tidak valid"),
  alamat_ortu: z.string().min(1, "Alamat orang tua wajib diisi"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      console.log("ZOD VALIDATION ERRORS:", result.error.format());
      const firstError = result.error.issues[0];
      return NextResponse.json(
        { 
          message: firstError.message, 
          errors: result.error.issues 
        },
        { status: 400 }
      );
    }

    const data = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username sudah digunakan" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Use transaction to create both User and Berkas
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: data.username,
          password: hashedPassword,
          email: data.email,
          jenis_kelamin: data.jenis_kelamin,
          asal_sekolah: data.asal_sekolah,
          role: "PENDAFTAR",
        },
      });

      await tx.berkas.create({
        data: {
          user_id: user.id,
          nisn_pendaftar: data.nisn_pendaftar,
          nama_pendaftar: data.nama_pendaftar,
          tanggallahir_pendaftar: new Date(data.tanggallahir_pendaftar),
          alamat_pendaftar: data.alamat_pendaftar,
          agama: data.agama,
          prestasi: "",
          nama_ortu: data.nama_ortu,
          pekerjaan_ortu: data.pekerjaan_ortu,
          no_hp_ortu: data.no_hp_ortu,
          alamat_ortu: data.alamat_ortu,
          jenis_berkas: "UMUM",
          file_path: "", // placeholder for later upload
          status_validasi: "MENUNGGU",
        },
      });

      return user;
    });

    return NextResponse.json(
      { message: "Registrasi berhasil", userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Handle Prisma unique constraint error
    if ((error as any).code === 'P2002') {
      const target = (error as any).meta?.target;
      if (target?.includes('email')) {
        return NextResponse.json({ message: "Email sudah digunakan" }, { status: 400 });
      }
      if (target?.includes('username')) {
        return NextResponse.json({ message: "Username sudah digunakan" }, { status: 400 });
      }
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
