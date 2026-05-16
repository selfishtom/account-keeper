// lib/providers/alaedin.ts
import {
  BaseProvider,
  ExtractedData,
  ProviderConfig,
} from "@/lib/providers/base-providers";

export class AlaedinProvider extends BaseProvider {
  constructor() {
    super({
      name: "Alaedin",
      domain: "jet.alaedin.org",
    });
  }

  canHandle(subLink: string): boolean {
    // تشخیص بر اساس دامنه
    return subLink.includes("alaedin.org") || subLink.includes("jet.alaedin");
  }

  async extractData(subLink: string): Promise<ExtractedData> {
    const data: ExtractedData = {
      username: null,
      status: null,
      dataLimit: null,
      dataUsed: null,
      expirationDate: null,
      daysRemaining: null,
      links: [],
    };

    const url = this.buildUrl(subLink);

    // این provider چون Cloudflare داره، نیاز به Puppeteer داره
    // اما طبق درخواست شما، اینجا با fetch معمولی هندل می‌کنیم
    const text = await this.fetchWithTimeout(url);

    // Extract username
    const usernameMatch = text.match(
      /Username:<\/span>\s*<span>([^<]+)<\/span>/,
    );
    let username = null;
    username = usernameMatch ? usernameMatch[1].trim() : null;
    username = username?.match(/AlaedinJet\s*(\S+)/i)?.[1] || username;
    if (usernameMatch) data.username = username;

    // Extract status
    const statusMatch = text.match(
      /Status:<\/span>\s*<span class="status ([^"]+)">([^<]+)<\/span>/,
    );
    if (statusMatch) data.status = statusMatch[2].trim();

    // Extract data limit
    const limitMatch = text.match(
      /Data Limit:<\/span>\s*<span>([^<]+)<\/span>/,
    );
    if (limitMatch) data.dataLimit = limitMatch[1].trim().split(" ")[0];

    // Extract data used
    const usedMatch = text.match(/Data Used:<\/span>\s*<span>([^<]+)<\/span>/);
    if (usedMatch) data.dataUsed = usedMatch[1].trim().split(" ")[0];

    // Extract expiration date and days remaining
    const expMatch = text.match(
      /Expiration Date:<\/span>\s*<span>\s*([^<]+)\s*\(([^)]+)\)/,
    );
    if (expMatch) {
      data.expirationDate = expMatch[1].trim();
      data.daysRemaining = expMatch[2].trim().split(" ")[0];
    }

    // Extract subscription links
    const linkRegex = /<input[^>]+value="(vless:\/\/[^"]+)"/g;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(text)) !== null) {
      data.links.push(linkMatch[1]);
    }

    return data;
  }
}
