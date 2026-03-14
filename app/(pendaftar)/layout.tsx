import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PendaftarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col pt-16 font-nunito">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
