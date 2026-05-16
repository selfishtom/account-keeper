// app/api/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "رمز عبور الزامی است" },
        { status: 400 },
      );
    }

    // بررسی رمز عبور
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "رمز عبور اشتباه است" },
        { status: 401 },
      );
    }

    // ساخت توکن امن با crypto استاندارد
    const token = crypto.randomBytes(48).toString("hex");

    // ذخیره توکن در کوکی
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // ۷ روز
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "با موفقیت وارد شدید",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "خطای سیستمی. لطفاً دوباره تلاش کنید." },
      { status: 500 },
    );
  }
}

// بررسی وضعیت لاگین
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token");

    return NextResponse.json({
      isAuthenticated: !!token,
    });
  } catch (error) {
    return NextResponse.json({
      isAuthenticated: false,
    });
  }
}

// خروج از حساب
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");

    return NextResponse.json({
      success: true,
      message: "با موفقیت خارج شدید",
    });
  } catch (error) {
    return NextResponse.json({ error: "خطا در خروج" }, { status: 500 });
  }
}
