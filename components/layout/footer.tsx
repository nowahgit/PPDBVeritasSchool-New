import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Youtube, Facebook } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#111827] text-white pt-24 pb-12 font-sans">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Logo & Vision */}
          <div className="md:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-1 group">
              <span className="text-2xl font-black text-white tracking-tighter">
                Veritas<span className="text-[#1e3a8a] bg-white px-1 rounded ml-1">School</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm font-medium">
              Membentuk generasi pembelajar yang unggul dalam karakter, iman, dan ilmu pengetahuan untuk menghadapi tantangan masa depan dengan integritas tinggi.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#1e3a8a] transition-all">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#1e3a8a] transition-all">
                <Youtube size={18} />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#1e3a8a] transition-all">
                <Facebook size={18} />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[3px] text-gray-500">Navigasi</h4>
            <ul className="space-y-3">
              <li><Link href="/#beranda" className="text-gray-400 hover:text-white transition-all text-sm font-medium">Beranda</Link></li>
              <li><Link href="/#persyaratan" className="text-gray-400 hover:text-white transition-all text-sm font-medium">Persyaratan</Link></li>
              <li><Link href="/#alur" className="text-gray-400 hover:text-white transition-all text-sm font-medium">Alur Pendaftaran</Link></li>
              <li><Link href="/#jadwal" className="text-gray-400 hover:text-white transition-all text-sm font-medium">Jadwal Seleksi</Link></li>
              <li><Link href="/#faq" className="text-gray-400 hover:text-white transition-all text-sm font-medium">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[3px] text-gray-500">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400">
                <Mail size={16} className="text-[#1e3a8a]" />
                <span className="text-sm font-medium">info@veritasschool.sch.id</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone size={16} className="text-[#1e3a8a]" />
                <span className="text-sm font-medium">(021) 1234 5678</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={16} className="text-[#1e3a8a] flex-shrink-0 mt-1" />
                <span className="text-sm leading-relaxed font-medium">
                  Jl. Pendidikan No. 123, <br /> Kota Pintar, Indonesia
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-600 font-bold uppercase tracking-widest italic">
            © 2025 Veritas School. Educating Hearts & Minds.
          </p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[2px] text-gray-600">
            <Link href="#" className="hover:text-white transition-all">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-white transition-all">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
