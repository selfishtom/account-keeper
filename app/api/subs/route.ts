// app/api/links/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllSubs, createSub } from "@/lib/db";

export async function GET() {
  try {
    const subs = await getAllSubs();
    return NextResponse.json({ subs });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch subs" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, subLink } = await request.json();

    if (!username || !subLink) {
      return NextResponse.json(
        { error: "Username and subLink are required" },
        { status: 400 },
      );
    }

    const id = await createSub(subLink, username);
    return NextResponse.json({ id, message: "Sub added successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add sub" }, { status: 500 });
  }
}
