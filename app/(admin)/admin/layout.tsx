"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { 
      name: "Dashboard", 
      href: "/admin", 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      name: "Daftar Pendaftar", 
      href: "/admin/pendaftar", 
      icon: <Users size={20} /> 
    },
    { 
      name: "Periode Seleksi", 
      href: "/admin/seleksi", 
      icon: <ClipboardList size={20} /> 
    },
    { 
      name: "Pengaturan", 
      href: "/admin/settings", 
      icon: <Settings size={20} /> 
    },
  ];

  const adminName = session?.user?.username || "Admin";
  const adminInitial = adminName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#f9fafb] flex">
      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#111827] hidden lg:flex flex-col z-50">
        {/* Sidebar Header */}
        <div className="px-6 py-5 border-b border-gray-800">
          <h1 className="text-white font-semibold text-lg tracking-tight">Veritas School</h1>
          <p className="text-gray-400 text-xs">Admin Panel</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-150 text-sm font-medium ${
                  isActive 
                  ? "bg-[#1e3a8a] text-white" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
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
            onClick={() => setShowLogoutConfirm(true)}
            className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-gray-800"
            title="Keluar"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-2">
            <h1 className="text-[#111827] font-bold text-base">Veritas Admin</h1>
          </div>
          <button 
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-gray-500 hover:text-[#111827]"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <div 
              className="w-64 h-full bg-[#111827] flex flex-col"
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
              <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === item.href 
                      ? "bg-[#1e3a8a] text-white" 
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
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
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={showLogoutConfirm}
          title="Keluar dari akun?"
          message="Kamu akan keluar dari sesi ini. Pastikan semua data sudah tersimpan sebelum keluar."
          confirmLabel="Ya, Keluar"
          confirmVariant="danger"
          onConfirm={() => signOut({ callbackUrl: "/login" })}
          onCancel={() => setShowLogoutConfirm(false)}
        />

        {/* Page Content Container */}
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
