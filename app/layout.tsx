import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import "@/lib/env";
import { AuthProvider } from "@/components/providers/auth-provider";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Veritas School - Penerimaan Peserta Didik Baru",
  description: "Website Pendaftaran Siswa Baru Veritas School",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${nunito.variable} scroll-smooth`}>
      <body className={nunito.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
