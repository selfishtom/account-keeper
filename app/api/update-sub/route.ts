// app/api/update-sub/route.ts
import { NextRequest, NextResponse } from "next/server";
import { updateSubData, getSubById } from "@/lib/db";
import { extractLinkData } from "@/lib/puppeteer";

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
      total_volume_gb: data.total_volume_gb || undefined,
      used_volume_gb: data.used_volume_gb || undefined,
      duration_days: data.duration_days || undefined,
    });

    return NextResponse.json({
      message: "Sub updated successfully",
      data: {
        id,
        username: data.username,
        total_volume_gb: data.total_volume_gb,
        used_volume_gb: data.used_volume_gb,
        duration_days: data.duration_days,
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
