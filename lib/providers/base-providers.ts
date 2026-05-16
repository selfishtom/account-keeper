// lib/providers/base-provider.ts

export interface ProviderConfig {
  name: string; // نام تامین‌کننده
  domain: string; // دامنه اصلی
  slugPrefix?: string; // پیشوند slug (اختیاری)
}

export interface ExtractedData {
  username: string | null;
  status: string | null;
  dataLimit: string | null;
  dataUsed: string | null;
  expirationDate: string | null;
  daysRemaining: string | null;
  links: string[];
  raw?: any; // داده خام برای استفاده‌های بعدی
}

export abstract class BaseProvider {
  protected config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  // تشخیص اینکه این provider می‌تونه این slug رو پردازش کنه
  abstract canHandle(subLink: string): boolean;

  // استخراج داده‌ها
  abstract extractData(subLink: string): Promise<ExtractedData>;

  // ساخت URL کامل
  protected buildUrl(sublink: string): string {
    return sublink;
  }

  // fetch مشترک با تنظیمات پایه
  protected async fetchWithTimeout(
    url: string,
    timeout: number = 15000,
  ): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.5",
          "Cache-Control": "no-cache",
        },
        next: { revalidate: 3600 },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.text();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // دریافت نام provider
  getName(): string {
    return this.config.name;
  }
}
