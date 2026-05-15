// components/AddLinkModal.tsx
"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (username: string, subLink: string) => Promise<void>;
}

export default function AddSubModal({
  isOpen,
  onClose,
  onAdd,
}: AddLinkModalProps) {
  const [username, setUsername] = useState("");
  const [subLink, setSubLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !subLink) return;

    setIsLoading(true);
    try {
      await onAdd(username, subLink);
      setUsername("");
      setSubLink("");
      onClose();
    } catch (error) {
      console.error("Failed to add link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          افزودن لینک جدید
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              نام کاربر
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              لینک Sub
            </label>
            <input
              type="text"
              value={subLink}
              onChange={(e) => setSubLink(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="https://..."
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? "در حال افزودن..." : "افزودن"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
