// app/api/update-sub/route.ts
import { NextRequest, NextResponse } from "next/server";
import { updateSubData, getSubById } from "@/lib/db";
import { extractLinkData } from "@/lib/scraper";

export async function PATCH(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Sub ID is required" },
        { status: 400 },
      );
    }

    // دریافت لینک از دیتابیس
    const sub = await getSubById(id);
    if (!sub) {
      return NextResponse.json({ error: "Sub not found" }, { status: 404 });
    }

    // استخراج داده‌های جدید با Puppeteer
    const data = await extractLinkData(sub.sub_link);

    // آپدیت دیتابیس
    await updateSubData(id, {
      username: data.username || undefined,
      total_volume_gb: Number(data.dataLimit) || undefined,
      used_volume_gb: Number(data.dataUsed) || undefined,
      duration_days: Number(data.daysRemaining) || undefined,
    });

    return NextResponse.json({
      message: "Sub updated successfully",
      data: {
        id,
        username: data.username,
        total_volume_gb: Number(data.dataLimit),
        used_volume_gb: Number(data.dataUsed),
        duration_days: Number(data.daysRemaining),
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update sub" },
      { status: 500 },
    );
  }
}
