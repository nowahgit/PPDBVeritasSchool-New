"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section
      id="beranda"
      className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden bg-white"
    >
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content (Text) */}
          <div className="lg:col-span-7 flex flex-col items-start gap-8">
            <div className="flex flex-col gap-6">

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] leading-[1.15] tracking-tight">
                Membentuk Karakter Unggul <br /> & Akademik Berkualitas
              </h1>

              {/* Sub-headline */}
              <p className="text-sm md:text-base text-[#6b7280] max-w-xl font-medium leading-relaxed">
                Sekolah menengah atas unggulan yang memadukan keunggulan akademik dengan pembentukan karakter yang kokoh untuk masa depan gemilang.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white px-8 py-3.5 rounded-full font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-900/10 active:scale-95"
              >
                Daftar Sekarang
              </Link>
              <Link
                href="#persyaratan"
                className="bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-blue-50 px-8 py-3.5 rounded-full font-bold text-sm transition-all duration-200 active:scale-95"
              >
                Persyaratan
              </Link>
            </div>
          </div>

          {/* Right Content (Image) */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 w-full aspect-[1080/1350]  overflow-hidden group">
              <img 
                src="/image/HERO-IMAGE.png" 
                alt="Veritas School pendaftar" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            
          </div>

        </div>
      </div>
      
    </section>
  );
};

export default HeroSection;
