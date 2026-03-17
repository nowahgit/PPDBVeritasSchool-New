"use client";

import React, { useState } from "react";
import { 
  UserCog, 
  ShieldCheck, 
  Mail, 
  Phone, 
  User, 
  Edit, 
  Trash2, 
  Plus, 
  Loader2,
  Lock,
  ChevronRight
} from "lucide-react";
import { createAdmin, updateAdmin, deleteAdmin } from "./actions";
import DialogCard from "@/components/ui/DialogCard";

export default function AdminTableClient({ initialData }: { initialData: any[] }) {
  const [admins, setAdmins] = useState(initialData);
  const [loading, setLoading] = useState<number | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    nama_panitia: "",
    no_hp: ""
  });

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      nama_panitia: "",
      no_hp: ""
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Password tidak cocok!");
      return;
    }

    setIsActionLoading(true);
    const res = await createAdmin(formData);
    setIsActionLoading(false);

    if (res.success) {
      setShowAddModal(false);
      setShowSuccessModal("Admin berhasil ditambahkan.");
      resetForm();
      // Refresh local data (simplification)
      window.location.reload();
    } else {
      alert(res.message);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Password tidak cocok!");
      return;
    }

    setIsActionLoading(true);
    const res = await updateAdmin(showEditModal.id_panitia, formData);
    setIsActionLoading(false);

    if (res.success) {
      setShowEditModal(null);
      setShowSuccessModal("Data admin berhasil diperbarui.");
      resetForm();
      window.location.reload();
    } else {
      alert(res.message);
    }
  };

  const handleDelete = async () => {
    setIsActionLoading(true);
    const res = await deleteAdmin(showDeleteModal.id_panitia);
    setIsActionLoading(false);

    if (res.success) {
      setShowDeleteModal(null);
      setShowSuccessModal("Admin berhasil dihapus.");
      window.location.reload();
    } else {
      alert(res.message);
    }
  };

  const openEdit = (admin: any) => {
    setFormData({
      username: admin.user.username,
      email: admin.user.email || "",
      password: "",
      confirmPassword: "",
      nama_panitia: admin.nama_panitia,
      no_hp: admin.no_hp
    });
    setShowEditModal(admin);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Data Admin & Panitia</h2>
          <p className="text-sm text-[#6b7280]">Daftar pengguna dengan akses manajemen sistem.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-800 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Tambah Admin
        </button>
      </header>

      <div className="px-8 py-8 flex flex-col gap-6 bg-[#f8fafc]/50 flex-1">
        {/* Table container */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kontak</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Username</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <UserCog size={40} className="text-gray-200" />
                       <p className="text-gray-400 font-medium">Belum ada data admin</p>
                    </div>
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id_panitia} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm uppercase">
                          {admin.nama_panitia.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[#111827]">{admin.nama_panitia}</span>
                          <span className="text-[10px] py-0.5 px-1.5 bg-blue-50 text-blue-600 rounded font-black w-fit uppercase tracking-tighter">Admin</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Mail size={12} className="text-gray-300" />
                          <span className="text-xs">{admin.user.email || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Phone size={12} className="text-gray-300" />
                          <span className="text-xs">{admin.no_hp}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <User size={14} className="text-gray-300" />
                        {admin.user.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEdit(admin)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => setShowDeleteModal(admin)}
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  {showAddModal ? <Plus size={20} /> : <Edit size={20} />}
                </div>
                <div>
                  <h3 className="text-base font-black text-[#111827] uppercase tracking-widest leading-none">
                    {showAddModal ? "Tambah Admin Baru" : "Edit Data Admin"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Lengkapi data akun dan profil admin.</p>
                </div>
              </div>
            </div>

            <form onSubmit={showAddModal ? handleAdd : handleEdit} className="p-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Lengkap</label>
                  <input 
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.nama_panitia}
                    onChange={(e) => setFormData({...formData, nama_panitia: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No. HP</label>
                  <input 
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.no_hp}
                    onChange={(e) => setFormData({...formData, no_hp: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</label>
                <input 
                  required
                  type="email"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Username</label>
                <input 
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {showAddModal ? "Password" : "Password Baru (Opsional)"}
                  </label>
                  <input 
                    required={showAddModal}
                    type="password"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Konfirmasi Password</label>
                  <input 
                    required={showAddModal || formData.password !== ""}
                    type="password"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => { setShowAddModal(false); setShowEditModal(null); }}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isActionLoading}
                  className="flex-[2] px-6 py-3 bg-[#1e3a8a] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2"
                >
                  {isActionLoading ? <Loader2 className="animate-spin" size={18} /> : (showAddModal ? "Simpan Admin" : "Simpan Perubahan")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <DialogCard 
        isOpen={!!showDeleteModal}
        type="error"
        title="Hapus Admin?"
        description={`Akun admin ${showDeleteModal?.nama_panitia} akan dihapus permanen dari sistem.`}
        confirmLabel="Ya, Hapus"
        showConfirm
        isLoading={isActionLoading}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(null)}
      />

      {/* Success Notification */}
      <DialogCard 
        isOpen={!!showSuccessModal}
        type="success"
        title="Berhasil"
        description={showSuccessModal || ""}
        onClose={() => setShowSuccessModal(null)}
      />
    </>
  );
}
