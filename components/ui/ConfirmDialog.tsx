"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, HelpCircle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmVariant: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  confirmVariant,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] px-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm shadow-xl"
          />

          {/* Dialog Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="relative bg-white rounded-xl shadow-lg p-6 max-w-sm w-full z-10 flex flex-col items-center"
          >
            {/* Close Button (Optional but good for UX) */}
            <button 
              onClick={onCancel}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Icon */}
            <div className={`p-3 rounded-full ${
              confirmVariant === "danger" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-700"
            }`}>
              {confirmVariant === "danger" ? (
                <AlertTriangle size={24} />
              ) : (
                <HelpCircle size={24} />
              )}
            </div>

            {/* Content */}
            <h3 className="text-base font-semibold text-gray-900 mt-3 text-center">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-1 text-center">
              {message}
            </p>

            {/* Buttons */}
            <div className="flex gap-3 mt-6 w-full">
              <button
                onClick={onCancel}
                className="flex-1 border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  confirmVariant === "danger" 
                    ? "bg-red-600 hover:bg-red-700 shadow-md shadow-red-900/10" 
                    : "bg-[#1e3a8a] hover:bg-blue-800 shadow-md shadow-blue-900/10"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
