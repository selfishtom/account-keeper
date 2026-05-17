// components/LinksTable.tsx
"use client";

import { useState } from "react";
import ProgressBar from "@/components/ui/ProgressBar";

interface SubRecord {
  id: number;
  sub_link: string;
  sub_id: string | null;
  sub_type: string | null; // v2ray or openvpn or wireguard
  config_type: string | null; // url or file
  total_volume_gb: number | null;
  used_volume_gb: number | null;
  usage_percentage: number | null;
  duration_days: number | null;
  status: string | null; // free=Available stock, assigned=Given to a customer, expired=Manually expired or duration passed
  assigned_to: string | null;
  expired_at: Date | null;
  bought_from: string | null;
  notes: string | null;
  full_name?: string | null;
}

interface SubsTableProps {
  subs: SubRecord[];
  onUpdateSingle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isUpdating: boolean;
}

export default function SubsTable({
  subs,
  onUpdateSingle,
  onDelete,
  isUpdating,
}: SubsTableProps) {
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleUpdateSingle = async (id: number) => {
    setUpdatingId(id);
    try {
      await onUpdateSingle(id);
    } finally {
      setUpdatingId(null);
    }
  };

  if (subs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        هیچ لینکی وجود ندارد. لطفاً یک لینک اضافه کنید.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="p-4 text-right">نام کاربر</th>
            <th className="p-4 text-right">مصرف حجم</th>
            <th className="p-4 text-right">روزهای باقی‌مانده</th>
            <th className="p-4 text-right">عملیات</th>
            {/* <th className="p-4 text-right">آخرین بروزرسانی</th> */}
          </tr>
        </thead>
        <tbody>
          {subs.map((sub) => (
            <tr
              key={sub.id}
              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              {/* نام کاربر */}
              <td className="p-4 font-medium">
                {sub.full_name == null ? "N.A" : sub.full_name} - {sub.sub_id}
              </td>

              {/* Progress Bar */}
              <td className="p-4 min-w-[250px]">
                {sub.total_volume_gb && sub.used_volume_gb !== null ? (
                  <ProgressBar
                    used={sub.used_volume_gb}
                    limit={sub.total_volume_gb}
                    size="sm"
                    showDetails={true}
                    showPercentage={true}
                  />
                ) : (
                  <span className="text-gray-400">No Data</span>
                )}
              </td>

              {/* روزهای باقی‌مانده */}
              <td className="p-4">
                {sub.duration_days !== null ? (
                  <span
                    className={`font-bold ${
                      sub.duration_days <= 3
                        ? "text-red-500"
                        : sub.duration_days <= 7
                          ? "text-yellow-500"
                          : "text-green-500"
                    }`}
                  >
                    {sub.duration_days} روز
                  </span>
                ) : (
                  <span className="text-gray-400">زمان به اتمام رسیده</span>
                )}
              </td>

              {/* دکمه‌های عملیات */}
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateSingle(sub.id)}
                    disabled={isUpdating || updatingId === sub.id}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
                  >
                    {updatingId === sub.id ? (
                      <span className="flex items-center gap-1">
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        آپدیت
                      </span>
                    ) : (
                      "بروزرسانی"
                    )}
                  </button>

                  {/* <button
                    onClick={() => onDelete(sub.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    حذف
                  </button> */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
