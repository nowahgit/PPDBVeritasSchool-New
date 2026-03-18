import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import BerkasClient from "./BerkasClient";

export const dynamic = 'force-dynamic'

export default async function BerkasPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PENDAFTAR") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    include: {
      berkas: true,
    },
  });

  if (!user || !user.berkas) return null;

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[#111827]">Berkas Saya</h1>
          <p className="text-sm text-[#6b7280]">Status validasi dan unggah berkas pendaftaran.</p>
        </div>
      </header>

      <div className="px-8 py-6 flex flex-col gap-6 font-nunito">
        <BerkasClient berkas={user.berkas} />
      </div>
    </>
  );
}
