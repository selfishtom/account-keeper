// components/ui/ProgressBar.tsx
"use client";

import { useEffect, useState } from "react";

interface ProgressBarProps {
  used: number;
  limit: number;
  showDetails?: boolean;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "bar" | "circle";
  className?: string;
  animate?: boolean;
}

export default function ProgressBar({
  used,
  limit,
  showDetails = true,
  showPercentage = true,
  size = "md",
  variant = "bar",
  className = "",
  animate = true,
}: ProgressBarProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const percentage = Math.min((used / limit) * 100, 100);
  const remaining = Math.max(limit - used, 0);

  // انیمیشن برای progress bar
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimatedWidth(percentage), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedWidth(percentage);
    }
  }, [percentage, animate]);

  // تعیین رنگ بر اساس درصد مصرف
  const getColorClass = () => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  // تعیین رنگ متن بر اساس درصد مصرف
  const getTextColorClass = () => {
    if (percentage >= 90) return "text-red-700 dark:text-red-300";
    if (percentage >= 70) return "text-yellow-700 dark:text-yellow-300";
    return "text-green-700 dark:text-green-300";
  };

  // تعیین رنگ پس‌زمینه بر اساس درصد مصرف
  const getBgClass = () => {
    if (percentage >= 90)
      return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
    if (percentage >= 70)
      return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
    return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
  };

  // تعیین سایز
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "h-2";
      case "lg":
        return "h-6";
      default:
        return "h-4";
    }
  };

  // Progress Bar افقی
  if (variant === "bar") {
    return (
      <div className={`${getBgClass()} p-4 rounded-xl border ${className}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          {showPercentage && (
            <span className={`text-sm font-bold ${getTextColorClass()}`}>
              {percentage.toFixed(1)}%
            </span>
          )}
          {showDetails && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {used} / {limit} GB
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
          <div
            className={`${getSizeClass()} ${getColorClass()} rounded-full transition-all duration-1000 ease-out relative`}
            style={{ width: `${animatedWidth}%` }}
          >
            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />

            {/* Stripes for high usage */}
            {percentage >= 75 && (
              <div className="absolute inset-0 opacity-20">
                <div className="h-full w-full bg-stripes animate-stripes" />
              </div>
            )}

            {/* Percentage inside bar */}
            {showPercentage && percentage > 15 && size !== "sm" && (
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white drop-shadow-md">
                {percentage.toFixed(0)}%
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        {showDetails && (
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">کل</p>
              <p className="font-bold text-gray-800 dark:text-gray-200">
                {limit} GB
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">مصرف</p>
              <p className="font-bold text-red-600 dark:text-red-400">
                {used} GB
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                باقی‌مانده
              </p>
              <p className="font-bold text-green-600 dark:text-green-400">
                {remaining.toFixed(1)} GB
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Circular Progress
  if (variant === "circle") {
    const radius = size === "sm" ? 30 : size === "lg" ? 50 : 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (animatedWidth / 100) * circumference;
    const svgSize = radius * 2 + 20;

    return (
      <div
        className={`${getBgClass()} p-6 rounded-xl border ${className} text-center`}
      >
        <div
          className="relative mx-auto mb-4"
          style={{ width: svgSize, height: svgSize }}
        >
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={size === "sm" ? "6" : "8"}
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={size === "sm" ? "6" : "8"}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={`transition-all duration-1000 ${getColorClass().replace("bg-", "text-")}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${getTextColorClass()}`}>
              {percentage.toFixed(0)}%
            </span>
            <span className="text-xs text-gray-500">مصرف</span>
          </div>
        </div>

        {showDetails && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">کل:</span>
              <span className="font-bold">{limit} GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">مصرف:</span>
              <span className="font-bold text-red-500">{used} GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                باقی‌مانده:
              </span>
              <span className="font-bold text-green-500">
                {remaining.toFixed(1)} GB
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
