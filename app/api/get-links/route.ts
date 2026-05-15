// app/api/get-links/route.ts
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const browser = await puppeteer.launch({
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: true,
    });

    const page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    );

    let username: string = "";
    let items: (string | null)[] = [];
    let DataLimit: string = "";
    let DataUsed: string = "";

    try {
      await page.goto("https://jet.alaedin.org/sub/" + slug, {
        waitUntil: "domcontentloaded",
        timeout: 5000,
      });
      username = await page.$eval(".info-item:first-child", (el) => {
        const text = el.textContent?.trim() || "Unknown User";
        const match = text.match(/AlaedinJet(\d+)/);
        return match ? match[1] : "Unknown User";
      });

      items = await page.$$eval(".link-input", (els) =>
        els.map((el) => el.getAttribute("value")),
      );
      DataLimit = await page.$eval(".info-item:nth-child(3)", (el) => {
        const text = el.textContent?.trim() || "0";
        const number = text.match(/[\d.]+/)?.[0] || "0";
        return number;
      });
      DataUsed = await page.$eval(".info-item:nth-child(4)", (el) => {
        const text = el.textContent?.trim() || "0";
        const number = text.match(/[\d.]+/)?.[0] || "0";
        return number;
      });
    } catch {
      username = "Unknown User";
      items = [];
      DataLimit = "N/A";
      DataUsed = "N/A";
    } finally {
      await browser.close();
    }

    const name = "Spades VPN-";
    const processedItems = items.map((item) =>
      item?.replace("AlaedinJet", name),
    );

    return NextResponse.json({
      username,
      links: processedItems,
      DataLimit,
      DataUsed,
    });
  } catch (error) {
    console.error("Puppeteer error:", error);
    return NextResponse.json(
      { error: "Failed to fetch links" },
      { status: 500 },
    );
  }
}
