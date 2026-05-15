// lib/puppeteer.ts
import puppeteer from "puppeteer-core";

interface LinkData {
  username?: string;
  total_volume_gb: number | null;
  used_volume_gb: number | null;
  duration_days: number | null;
}

export async function extractLinkData(link: string): Promise<LinkData> {
  const browser = await puppeteer.launch({
    executablePath:
      process.env.CHROME_PATH ||
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    );

    await page.goto(link, {
      waitUntil: "domcontentloaded",
      timeout: 5000,
    });

    const username = await page.$eval(".info-item:nth-child(1)", (el) => {
      const text = el.textContent?.trim() || "";
      const match = text.match(/AlaedinJet\s*(\S+)/i);
      return match ? match[0] : null;
    });

    // استخراج Data Limit
    const dataLimitText = await page.$eval(".info-item:nth-child(3)", (el) => {
      const text = el.textContent?.trim() || "0";
      const number = text.match(/[\d.]+/)?.[0] || "0";
      return number;
    });
    const dataLimit = dataLimitText ? parseFloat(dataLimitText) : null;

    // استخراج Data Used
    const dataUsedText = await page.$eval(".info-item:nth-child(4)", (el) => {
      const text = el.textContent?.trim() || "0";
      const number = text.match(/[\d.]+/)?.[0] || "0";
      return number;
    });
    const dataUsed = dataUsedText ? parseFloat(dataUsedText) : null;

    // استخراج روزهای باقی‌مانده
    const expireDaysText = await page.$eval(".info-item:nth-child(5)", (el) => {
      const text = el.textContent?.trim() || "0";
      const number = text.match(/\((\d+)\s*days?\s*remaining\)/i)?.[1] || "0";
      return number;
    });
    const duration_days = expireDaysText ? parseInt(expireDaysText) : null;

    // console.log("Extracted Data:", {
    //   username: username || undefined,
    //   total_volume_gb: dataLimit,
    //   used_volume_gb: dataUsed,
    //   duration_days: duration_days,
    // });

    return {
      username: username || undefined,
      total_volume_gb: dataLimit,
      used_volume_gb: dataUsed,
      duration_days: duration_days,
    };
  } finally {
    await browser.close();
  }
}
