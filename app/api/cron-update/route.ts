// app/api/cron-update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllLinks, updateLinkData } from "@/lib/db";
import { extractLinkData } from "@/lib/puppeteer";

export async function POST(request: NextRequest) {
  try {
    const links = await getAllLinks();
    let updatedCount = 0;
    let failedCount = 0;

    // آپدیت تک‌تک با تاخیر
    for (const link of links) {
      try {
        const data = await extractLinkData(link.slug);

        await updateLinkData(link.id, {
          data_limit: data.dataLimit || undefined,
          data_used: data.dataUsed || undefined,
          expire_days: data.expireDays || undefined,
        });

        updatedCount++;

        // تاخیر ۲ ثانیه‌ای بین هر آپدیت برای جلوگیری از بلاک شدن
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to update link ${link.id}:`, error);
        failedCount++;
      }
    }

    return NextResponse.json({
      message: "Batch update completed",
      updatedCount,
      failedCount,
      total: links.length,
    });
  } catch (error) {
    return NextResponse.json({ error: "Batch update failed" }, { status: 500 });
  }
}
