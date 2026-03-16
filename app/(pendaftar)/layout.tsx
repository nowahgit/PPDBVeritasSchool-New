import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import WelcomeRedirect from "@/components/auth/WelcomeRedirect";

export default async function PendaftarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "PENDAFTAR") {
    // If Admin/Panitia tries to access pendaftar route, handle accordingly
    // Usually redirect to /admin or login
    return <>{children}</>; 
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
    include: { berkas: true }
  });

  const hasBerkas = !!user?.berkas;

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col pt-16 font-nunito">
      <WelcomeRedirect hasBerkas={hasBerkas} />
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
