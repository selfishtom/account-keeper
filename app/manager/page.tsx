// app/manager/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import AddSubModal from "@/components/AddSubModal";
import ProgressBar from "@/components/ui/ProgressBar";
import SubsTable from "@/components/SubsTable";

interface SubRecord {
  id: number;
  sub_link: string;
  sub_id: string | null;
  sub_type: string | null; // v2ray or openvpn or wireguard
  config_type: string | null; //url or file
  total_volume_gb: number | null;
  used_volume_gb: number | null;
  usage_percentage: number | null;
  duration_days: number | null;
  status: string | null; //free=Available stock, assigned=Given to a customer, expired=Manually expired or duration passed
  assigned_to: string | null;
  expired_at: Date | null;
  bought_from: string | null;
  notes: string | null;
}

export default function ManagerPage() {
  const [subs, setSubs] = useState<SubRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState({
    current: 0,
    total: 0,
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch subs from API
  const fetchSubs = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/subs");

      if (!response.ok) {
        throw new Error("Failed to fetch subs");
      }

      const data = await response.json();
      setSubs(data.subs || []);
    } catch (error) {
      console.error("Failed to fetch subs:", error);
      setError("خطا در دریافت لینک‌ها");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubs();
  }, [fetchSubs]);

  // Add new sub
  const handleAddSub = async (username: string, subLink: string) => {
    try {
      const response = await fetch("/api/subs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, subLink }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add sub");
      }

      await fetchSubs();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add sub:", error);
      alert("خطا در افزودن لینک");
    }
  };

  // Update single sub
  const handleUpdateSingle = async (id: number) => {
    try {
      const response = await fetch("/api/update-sub", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to update sub");
      }

      await fetchSubs();
    } catch (error) {
      console.error("Failed to update sub:", error);
      throw error;
    }
  };

  // Batch update all subs
  const handleBatchUpdate = async () => {
    if (
      !confirm(
        "آیا از بروزرسانی همه لینک‌ها اطمینان دارید؟ این عملیات ممکن است چند دقیقه طول بکشد.",
      )
    ) {
      return;
    }

    setIsBatchUpdating(true);
    setUpdateProgress({ current: 0, total: subs.length });

    try {
      for (let i = 0; i < subs.length; i++) {
        try {
          await handleUpdateSingle(subs[i].id);
          setUpdateProgress({ current: i + 1, total: subs.length });

          // تاخیر کوتاه بین هر آپدیت
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Failed to update sub ${subs[i].id}:`, error);
        }
      }

      alert("بروزرسانی همه لینک‌ها با موفقیت انجام شد.");
    } catch (error) {
      console.error("Batch update failed:", error);
      alert("خطا در بروزرسانی برخی لینک‌ها");
    } finally {
      setIsBatchUpdating(false);
      setUpdateProgress({ current: 0, total: 0 });
    }
  };

  // Delete sub
  const handleDelete = async (id: number) => {
    if (!confirm("آیا از حذف این لینک اطمینان دارید؟")) return;

    try {
      const response = await fetch(`/api/subs?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchSubs();
      } else {
        throw new Error("Failed to delete sub");
      }
    } catch (error) {
      console.error("Failed to delete sub:", error);
      alert("خطا در حذف لینک");
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                مدیریت لینک‌ها
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {subs.length} لینک ثبت شده
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                disabled={isBatchUpdating}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                افزودن لینک جدید
              </button>

              <button
                onClick={handleBatchUpdate}
                disabled={isBatchUpdating || subs.length === 0}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBatchUpdating ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    در حال بروزرسانی...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                    بروزرسانی همه
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Batch Update Progress */}
        {isBatchUpdating && updateProgress.total > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                پیشرفت بروزرسانی
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {updateProgress.current} از {updateProgress.total}
              </span>
            </div>
            <ProgressBar
              used={updateProgress.current}
              limit={updateProgress.total}
              size="sm"
              showDetails={false}
              showPercentage={true}
            />
          </div>
        )}

        {/* Main Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              لیست لینک‌ها
            </h2>
          </div>

          <SubsTable
            subs={subs}
            onUpdateSingle={handleUpdateSingle}
            onDelete={handleDelete}
            isUpdating={isBatchUpdating}
          />
        </div>

        {/* Add Sub Modal */}
        <AddSubModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddSub}
        />
      </div>
    </div>
  );
}
