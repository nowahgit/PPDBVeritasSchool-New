"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  ChevronRight,
  Menu,
  X,
  User,
  FileText,
  ClipboardCheck,
  Settings,
  LogOut,
  GraduationCap
} from "lucide-react";
import DialogCard from "@/components/ui/DialogCard";

const MenuItem = ({ href, icon, name, active, onClick }: any) => (
  <Link
    href={href}
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-150 text-sm font-medium ${
      active 
      ? "bg-[#1e3a8a] text-white" 
      : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`}
  >
    {icon}
    <span>{name}</span>
    {active && <ChevronRight size={14} className="ml-auto" />}
  </Link>
);

export default function PendaftarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (status === "loading") return null;
  if (!session) {
    window.location.href = "/login";
    return null;
  }

  const pendaftarName = session?.user?.username || "Pendaftar";
  const pendaftarInitial = pendaftarName.charAt(0).toUpperCase();
  const currentPath = mounted ? pathname : "";

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Data Diri", href: "/dashboard/data-diri", icon: <User size={20} /> },
    { name: "Berkas Saya", href: "/dashboard/berkas", icon: <FileText size={20} /> },
    { name: "Status Seleksi", href: "/dashboard/status-seleksi", icon: <ClipboardCheck size={20} /> },
    { name: "Pengaturan", href: "/dashboard/pengaturan", icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#111827] hidden lg:flex flex-col z-50">
        <div className="px-6 py-5 border-b border-gray-800">
          <h1 className="text-white font-semibold text-lg tracking-tight">Veritas School</h1>
          <p className="text-gray-400 text-xs text-xs font-medium">Portal Pendaftar</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <MenuItem 
              key={item.href}
              href={item.href}
              name={item.name}
              icon={item.icon}
              active={currentPath === item.href}
            />
          ))}
        </nav>

        <div className="mt-auto border-t border-gray-800 px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
              {pendaftarInitial}
            </div>
            <span className="text-sm text-white font-medium truncate">{pendaftarName}</span>
          </div>
          <button 
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-gray-800"
            title="Keluar"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative font-nunito">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-2">
            <h1 className="text-[#111827] font-bold text-base">Veritas Pendaftar</h1>
          </div>
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-gray-500 hover:text-[#111827]"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={() => setIsMobileOpen(false)}
              />
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-64 h-full bg-[#111827] fixed inset-y-0 left-0 z-[70] flex flex-col lg:hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center">
                  <div>
                    <h1 className="text-white font-semibold text-lg">Veritas School</h1>
                    <p className="text-gray-400 text-xs">Portal Pendaftar</p>
                  </div>
                  <button onClick={() => setIsMobileOpen(false)} className="text-white">
                    <X size={20} />
                  </button>
                </div>
                <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto no-scrollbar">
                  {menuItems.map((item) => (
                    <MenuItem 
                      key={item.href}
                      href={item.href}
                      name={item.name}
                      icon={item.icon}
                      active={currentPath === item.href}
                      onClick={() => setIsMobileOpen(false)}
                    />
                  ))}
                </nav>
                <div className="border-t border-gray-800 p-4">
                   <button 
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex items-center gap-3 w-full text-gray-400 hover:text-white p-2"
                  >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Keluar</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <DialogCard
          isOpen={showLogoutConfirm}
          type="warning"
          title="Keluar dari portal?"
          description="Sesi anda akan berakhir. Pastikan data pendaftaran anda sudah tersimpan."
          confirmLabel="Ya, Keluar"
          showConfirm
          onConfirm={() => signOut({ callbackUrl: "/login" })}
          onClose={() => setShowLogoutConfirm(false)}
        />

        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
