"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogIn, UserPlus, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export const Navbar = () => {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/#beranda" },
    { name: "Persyaratan", href: "/#persyaratan" },
    { name: "Alur", href: "/#alur" },
    { name: "Jadwal", href: "/#jadwal" },
    { name: "FAQ", href: "/#faq" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-sm border-b border-gray-100 py-3 shadow-sm" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center max-w-5xl">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-xl font-extrabold text-[#1e3a8a] tracking-tight">
            Veritas<span className="text-[#111827]">School</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs font-bold text-gray-700 hover:text-primary transition-all duration-200 uppercase tracking-wider"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <Link
                href={session.user.role === "PANITIA" ? "/admin" : "/dashboard"}
                className="flex items-center gap-2 text-xs font-bold text-primary px-5 py-2 rounded-full border border-primary/20 hover:bg-primary/5 transition-all"
              >
                <User size={14} />
                <span className="uppercase tracking-widest">Dashboard</span>
              </Link>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="text-xs font-bold text-gray-500 hover:text-red-600 px-3 py-2 transition-all uppercase tracking-widest"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-bold text-gray-700 px-5 py-2 rounded-full hover:bg-gray-100 transition-all uppercase tracking-widest"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 text-xs font-bold bg-[#1e3a8a] text-white px-6 py-2.5 rounded-full transition-all hover:bg-[#1e3a8a]/90 shadow-md shadow-blue-100 uppercase tracking-widest"
              >
                <UserPlus size={14} />
                <span>Daftar</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-100 p-6 absolute top-full left-0 right-0 shadow-lg"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-bold text-gray-700 uppercase tracking-widest"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-gray-100" />
              {session ? (
                <div className="flex flex-col gap-3">
                  <Link
                    href={session.user.role === "PANITIA" ? "/admin" : "/dashboard"}
                    className="flex items-center justify-center gap-2 text-sm font-bold text-primary p-3 rounded-xl border border-primary/20"
                  >
                    <User size={18} />
                    <span>DASHBOARD</span>
                  </Link>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="p-3 text-sm font-bold text-red-500 uppercase tracking-widest"
                  >
                    KELUAR
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    className="p-3 text-center text-sm font-bold text-gray-700 uppercase tracking-widest"
                  >
                    MASUK
                  </Link>
                  <Link
                    href="/register"
                    className="bg-primary text-white p-4 rounded-xl text-center text-sm font-bold shadow-lg uppercase tracking-widest"
                  >
                    DAFTAR SEKARANG
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Keluar dari akun?"
        message="Kamu akan keluar dari sesi ini. Pastikan semua data sudah tersimpan sebelum keluar."
        confirmLabel="Ya, Keluar"
        confirmVariant="danger"
        onConfirm={() => signOut({ callbackUrl: "/login" })}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </nav>
  );
};
