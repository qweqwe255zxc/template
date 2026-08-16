import { Footer } from "@/components/sections/Footer";
import { siteConfig } from "@/content/site.config";
import { buildNav } from "@/lib/seo";
import type { FooterVariant } from "@/types/site";
import { QaLabel } from "../_lib";

const nav = buildNav(siteConfig);

const variants: FooterVariant[] = [
  "default",
  "bold",
  "classic",
  "compact",
  "monogram",
  "centered",
  "split",
  "editorial",
];

export default function QaFooterPage() {
  return (
    <main>
      {variants.map((variant) => (
        <div key={variant}>
          <QaLabel>{`Footer / variant="${variant}"`}</QaLabel>
          <Footer
            brand={siteConfig.brand}
            contacts={siteConfig.contacts}
            footer={{ ...siteConfig.footer, variant }}
            nav={nav}
          />
        </div>
      ))}
    </main>
  );
}
