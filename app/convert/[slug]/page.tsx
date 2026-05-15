import puppeteer from "puppeteer-core";
import Input from "@/components/ui/Input";
import BackButton from "@/components/ui/BackButton";

export default async function Home({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  var items: (string | null)[] = [];

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
  try {
    await page.goto("https://jet.alaedin.org/sub/" + slug, {
      waitUntil: "domcontentloaded",
      timeout: 5000,
    });

    items = await page.$$eval(".link-input", (els) =>
      els.map((el) => el.getAttribute("value")),
    );
  } catch {
    items = [];
  }

  await browser.close();

  const name = "Spades VPN-";

  return (
    <>
      <ul>
        {items.length > 0 &&
          items.map((item, index) => (
            <li className="text-black" key={index}>
              <Input
                type="text"
                className="px-8 py-4 my-2 bg-gray-700 text-white"
                value={item?.replace("AlaedinJet", name)}
                readOnly
              />
            </li>
          ))}
      </ul>
      {items.length == 0 && (
        <>
          <div className="text-red-500 bg-amber-300 p-5">Link Can't load .</div>
        </>
      )}
      <BackButton />
    </>
  );
}
