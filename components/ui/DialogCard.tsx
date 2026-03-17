"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info,
  X 
} from "lucide-react";

export type DialogType = "success" | "warning" | "error" | "info" | "archive";

interface DialogCardProps {
  isOpen: boolean;
  type: DialogType;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onClose: () => void;
  showConfirm?: boolean;
  isLoading?: boolean;
}

const iconConfig = {
  success: {
    icon: <CheckCircle2 size={32} />,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  warning: {
    icon: <AlertTriangle size={32} />,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  error: {
    icon: <XCircle size={32} />,
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  info: {
    icon: <Info size={32} />,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  archive: {
    icon: <span className="text-3xl">📦</span>,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  }
};

export default function DialogCard({
  isOpen,
  type,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  onConfirm,
  onClose,
  showConfirm = false,
  isLoading = false,
}: DialogCardProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full z-10 flex flex-col items-center overflow-hidden"
          >
            {/* Header with Icon */}
            <div className={`p-4 rounded-2xl mb-6 ${iconConfig[type].bg} ${iconConfig[type].color}`}>
              {iconConfig[type].icon}
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center leading-tight">
              {title}
            </h3>
            <p className="text-sm text-gray-500 text-center leading-relaxed mb-8">
              {description}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row-reverse gap-3 w-full">
              {showConfirm && onConfirm ? (
                <>
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`flex-1 ${
                      type === "error" || type === "warning" ? "bg-rose-600 hover:bg-rose-700" : "bg-[#1e3a8a] hover:bg-blue-800"
                    } text-white rounded-xl px-6 py-3 text-sm font-bold transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center`}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      confirmLabel
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 bg-gray-100 text-gray-700 rounded-xl px-6 py-3 text-sm font-bold hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                  >
                    {cancelLabel}
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full bg-gray-900 text-white rounded-xl px-6 py-3 text-sm font-bold hover:bg-gray-800 transition-all transform active:scale-95"
                >
                  OK
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
