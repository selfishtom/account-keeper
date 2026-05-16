// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // فقط مسیرهای /manager رو محافظت کن
  if (request.nextUrl.pathname.startsWith("/manager")) {
    const authToken = request.cookies.get("auth_token");

    // اگر توکن وجود نداشت، هدایت به صفحه لاگین
    if (!authToken) {
      const loginUrl = new URL("/login", request.url);
      // اضافه کردن آدرس فعلی برای برگشت بعد از لاگین
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // اگر کاربر لاگین کرده و میخواد به /login بره، هدایت به /manager
  if (request.nextUrl.pathname === "/login") {
    const authToken = request.cookies.get("auth_token");
    if (authToken) {
      return NextResponse.redirect(new URL("/manager", request.url));
    }
  }

  return NextResponse.next();
}

// تنظیم مسیرهایی که Middleware روی اون‌ها اعمال بشه
export const config = {
  matcher: ["/manager/:path*", "/login"],
};
