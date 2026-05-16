// lib/providers/index.ts
import { BaseProvider } from "@/lib/providers/base-providers";
import { AlaedinProvider } from "@/lib/providers/alaedin";
// import { JsonProvider } from "./provider-json";
// import { HtmlProvider } from "./provider-html";

// همه provider‌ها اینجا ثبت بشن
const providers: BaseProvider[] = [
  new AlaedinProvider(),
  //   new JsonProvider(),
  //   new HtmlProvider(),
];

export function getProvider(subLink: string): BaseProvider | null {
  for (const provider of providers) {
    if (provider.canHandle(subLink)) {
      return provider;
    }
  }
  return null;
}

export { BaseProvider, providers };
