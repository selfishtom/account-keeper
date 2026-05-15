// app/api/cron-update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllSubs, updateSubData } from "@/lib/db";
import { extractLinkData } from "@/lib/puppeteer";

export async function POST(request: NextRequest) {
  try {
    const subs = await getAllSubs();
    let updatedCount = 0;
    let failedCount = 0;

    // آپدیت تک‌تک با تاخیر
    for (const sub of subs) {
      try {
        const data = await extractLinkData(sub.sub_link);

        await updateSubData(sub.id, {
          username: data.username || undefined,
          total_volume_gb: data.total_volume_gb || undefined,
          used_volume_gb: data.used_volume_gb || undefined,
          duration_days: data.duration_days || undefined,
        });

        updatedCount++;

        // تاخیر ۲ ثانیه‌ای بین هر آپدیت برای جلوگیری از بلاک شدن
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to update subscription ${sub.id}:`, error);
        failedCount++;
      }
    }

    return NextResponse.json({
      message: "Batch update completed",
      updatedCount,
      failedCount,
      total: subs.length,
    });
  } catch (error) {
    return NextResponse.json({ error: "Batch update failed" }, { status: 500 });
  }
}
