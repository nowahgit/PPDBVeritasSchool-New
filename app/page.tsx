import HeroSection from "@/components/HeroSection";
import AdmissionPaths from "@/components/AdmissionPaths";
import RegistrationTimeline from "@/components/RegistrationTimeline";
import FAQSection from "@/components/FAQSection";
import JadwalSeleksi from "@/components/JadwalSeleksi";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { prisma } from "@/lib/prisma";

export default async function LandingPage() {
  const jadwalData = await prisma.seleksi.findMany({
    where: {
      waktu_seleksi: {
        gte: new Date(),
      },
    },
    orderBy: {
      waktu_seleksi: "asc",
    },
    select: {
      id_seleksi: true,
      nama_seleksi: true,
      waktu_seleksi: true,
      status_seleksi: true,
    },
    distinct: ["nama_seleksi"],
  });

  return (
    <div className="bg-white selection:bg-blue-100 selection:text-primary">
      <Navbar />

      <main>
        <section id="beranda">
          <HeroSection />
        </section>

        <section id="persyaratan">
          <AdmissionPaths />
        </section>

        <section id="alur">
          <RegistrationTimeline />
        </section>

        <JadwalSeleksi jadwal={jadwalData} />

        <section id="faq">
          <FAQSection />
        </section>
      </main>

      <Footer />
    </div>
  );
}
