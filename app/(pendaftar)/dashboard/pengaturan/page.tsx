import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PengaturanForm from "./PengaturanForm";

export default async function PengaturanPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PENDAFTAR") {
    redirect("/login");
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[#111827]">Pengaturan Akun</h1>
          <p className="text-sm text-[#6b7280]">Kelola keamanan dan kata sandi akun kamu.</p>
        </div>
      </header>

      <div className="px-8 py-6 flex flex-col gap-6 font-nunito">
        <div className="max-w-2xl">
          <PengaturanForm />
        </div>
      </div>
    </>
  );
}
