// components/Modal.tsx
"use client";

import { useEffect, useRef } from "react";
import Input from "@/components/ui/Input";
import ProgressBar from "./ui/ProgressBar";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  dataLimit: string;
  dataUsed: string;
  links: (string | null | undefined)[];
  isLoading: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  links,
  isLoading,
  dataLimit,
  dataUsed,
  username,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // بستن با دکمه Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // بستن با کلیک بیرون Modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            لینک‌های استخراج شده
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none"
            aria-label="بستن"
          >
            ✕
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            <span className="mr-3 text-gray-600 dark:text-gray-300">
              در حال دریافت لینک‌ها...
            </span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && links.length === 0 && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg text-center">
            لینکی دریافت نشد یا لینک معتبر نیست.
          </div>
        )}

        {/* Username */}
        {!isLoading && username != "Unknown User" && (
          <div className="mb-4 text-gray-700 dark:text-gray-300">
            <strong>کاربر:</strong> {username}
          </div>
        )}

        {!isLoading && dataLimit != "N/A" && dataUsed != "N/A" && (
          <ProgressBar
            used={parseFloat(dataUsed)}
            limit={parseFloat(dataLimit)}
            showDetails={true}
            showPercentage={true}
            size="md"
            variant="bar" // یا "circle"
            animate={true}
            className="mb-4"
          />
        )}

        {/* Links List */}
        {!isLoading && links.length > 0 && (
          <ul className="space-y-2">
            {links.map(
              (link, index) =>
                link && (
                  <li key={index}>
                    <Input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600"
                      value={link}
                      readOnly
                    />
                  </li>
                ),
            )}
          </ul>
        )}

        {/* Close Button */}
        {!isLoading && (
          <button
            onClick={onClose}
            className="mt-6 w-full bg-gray-800 dark:bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            بستن
          </button>
        )}
      </div>
    </div>
  );
}
