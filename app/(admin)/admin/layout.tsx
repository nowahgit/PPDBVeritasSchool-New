"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Database,
  UserCheck,
  Settings,
  LogOut
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

const CollapsibleMenu = ({ name, icon, isOpen, setIsOpen, items, pathname }: any) => {
  const hasActiveChild = items.some((item: any) => pathname === item.href);
  
  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-150 text-sm font-medium ${
          hasActiveChild ? "text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
        }`}
      >
        {icon}
        <span>{name}</span>
        <div className={`ml-auto transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDown size={14} />
        </div>
      </button>
      
      {isOpen && (
        <div className="ml-6 flex flex-col gap-1 mt-1 border-l border-gray-800 pl-3">
          {items.map((item: any) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ${
                pathname === item.href 
                ? "text-white bg-[#1e3a8a]/40" 
                : "text-gray-500 hover:text-gray-300 hover:bg-gray-800"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // States for collapsible menus
  const [isDataOpen, setIsDataOpen] = useState(true);
  const [isSeleksiOpen, setIsSeleksiOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-expand parents based on pathname
  useEffect(() => {
    if (pathname && (pathname.includes("/admin/pendaftar") || pathname.includes("/admin/data"))) {
      setIsDataOpen(true);
    }
    if (pathname && pathname.includes("/admin/seleksi")) {
      setIsSeleksiOpen(true);
    }
  }, [pathname]);

  const adminName = session?.user?.username || "Admin";
  const adminInitial = adminName.charAt(0).toUpperCase();

  // Use a stable path for comparison to avoid hydration mismatch
  const currentPath = mounted ? pathname : "";

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#111827] hidden lg:flex flex-col z-50">
        {/* Sidebar Header */}
        <div className="px-6 py-5 border-b border-gray-800">
          <h1 className="text-white font-semibold text-lg tracking-tight">Veritas School</h1>
          <p className="text-gray-400 text-xs">Admin Panel</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto no-scrollbar">
          <MenuItem 
            href="/admin" 
            name="Dashboard" 
            icon={<LayoutDashboard size={20} />} 
            active={currentPath === "/admin"} 
          />

          <CollapsibleMenu 
            name="Data" 
            icon={<Database size={20} />}
            isOpen={isDataOpen}
            setIsOpen={setIsDataOpen}
            pathname={currentPath}
            items={[
              { name: "Data Pendaftar", href: "/admin/pendaftar" },
              { name: "Data Admin", href: "/admin/data/admin" },
            ]}
          />

          <CollapsibleMenu 
            name="Seleksi" 
            icon={<UserCheck size={20} />}
            isOpen={isSeleksiOpen}
            setIsOpen={setIsSeleksiOpen}
            pathname={currentPath}
            items={[
              { name: "Periode Seleksi", href: "/admin/seleksi" },
              { name: "Arsip Seleksi", href: "/admin/seleksi/arsip" },
            ]}
          />

          <MenuItem 
            href="/admin/settings" 
            name="Pengaturan" 
            icon={<Settings size={20} />} 
            active={currentPath === "/admin/settings"} 
          />
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto border-t border-gray-800 px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
              {adminInitial}
            </div>
            <span className="text-sm text-white font-medium truncate">{adminName}</span>
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
            <h1 className="text-[#111827] font-bold text-base">Veritas Admin</h1>
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
                    <p className="text-gray-400 text-xs">Admin Panel</p>
                  </div>
                  <button onClick={() => setIsMobileOpen(false)} className="text-white">
                    <X size={20} />
                  </button>
                </div>
                <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto no-scrollbar">
                  <MenuItem 
                    href="/admin" 
                    name="Dashboard" 
                    icon={<LayoutDashboard size={20} />} 
                    active={currentPath === "/admin"} 
                    onClick={() => setIsMobileOpen(false)}
                  />

                  <CollapsibleMenu 
                    name="Data" 
                    icon={<Database size={20} />}
                    isOpen={isDataOpen}
                    setIsOpen={setIsDataOpen}
                    pathname={currentPath}
                    items={[
                      { name: "Data Pendaftar", href: "/admin/pendaftar" },
                      { name: "Data Admin", href: "/admin/data/admin" },
                    ]}
                  />

                  <CollapsibleMenu 
                    name="Seleksi" 
                    icon={<UserCheck size={20} />}
                    isOpen={isSeleksiOpen}
                    setIsOpen={setIsSeleksiOpen}
                    pathname={currentPath}
                    items={[
                      { name: "Periode Seleksi", href: "/admin/seleksi" },
                      { name: "Arsip Seleksi", href: "/admin/seleksi/arsip" },
                    ]}
                  />

                  <MenuItem 
                    href="/admin/settings" 
                    name="Pengaturan" 
                    icon={<Settings size={20} />} 
                    active={currentPath === "/admin/settings"} 
                    onClick={() => setIsMobileOpen(false)}
                  />
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
          title="Keluar dari akun?"
          description="Kamu akan keluar dari sesi ini. Pastikan semua data sudah tersimpan sebelum keluar."
          confirmLabel="Ya, Keluar"
          showConfirm
          onConfirm={() => signOut({ callbackUrl: "/login" })}
          onClose={() => setShowLogoutConfirm(false)}
        />

        {/* Page Content Container */}
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
