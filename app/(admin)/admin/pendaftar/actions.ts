import { prisma } from "@/lib/prisma";
import { StatusValidasi } from "@prisma/client";

export async function getPendaftar({
  page = 1,
  limit = 10,
  search = "",
  status = "ALL",
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  const skip = (page - 1) * limit;

  const where: any = {
    role: "PENDAFTAR",
    berkas: {
      ...(status !== "ALL" && {
        status_validasi: status as StatusValidasi,
      }),
      ...(search && {
        OR: [
          {
            nama_pendaftar: {
              contains: search,
            },
          },
          {
            nisn_pendaftar: {
              contains: search,
            },
          },
        ],
      }),
    },
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        asal_sekolah: true,
        jenis_kelamin: true,
        berkas: {
          select: {
            nisn_pendaftar: true,
            nama_pendaftar: true,
            status_validasi: true,
            jenis_berkas: true,
          },
        },
        seleksi: {
          select: {
            nama_seleksi: true,
            nilai_smt1: true,
            nilai_smt2: true,
            nilai_smt3: true,
            nilai_smt4: true,
            nilai_smt5: true,
            status_seleksi: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        id: "desc",
      },
    }),
    prisma.user.count({ where }),
  ]);

  const pendaftarWithAvg = users.map((user) => {
    const seleksi = user.seleksi[0];
    const rataRata = seleksi
      ? (seleksi.nilai_smt1 +
          seleksi.nilai_smt2 +
          seleksi.nilai_smt3 +
          seleksi.nilai_smt4 +
          seleksi.nilai_smt5) /
        5
      : null;

    return {
      ...user,
      rata_rata: rataRata,
    };
  });

  return {
    pendaftar: pendaftarWithAvg,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
