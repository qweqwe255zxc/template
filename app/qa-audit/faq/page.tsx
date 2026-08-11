import { FAQ } from "@/components/sections/FAQ";
import { siteConfig } from "@/content/site.config";
import type { FaqSection } from "@/types/site";
import { QaBlock } from "../_lib";

const base = siteConfig.sections.find(
  (s): s is FaqSection => s.type === "faq",
)!;

const variants: NonNullable<FaqSection["variant"]>[] = [
  "narrow",
  "wide",
  "split-sidebar",
  "categorized",
  "sticky-split",
];

export default function QaFaqPage() {
  return (
    <main>
      {variants.map((variant) => (
        <QaBlock key={variant} label={`FAQ / variant="${variant}"`}>
          <FAQ
            {...base}
            id={`faq-${variant}`}
            variant={variant}
            iconShape={base.iconShape ?? siteConfig.theme.iconShape}
          />
        </QaBlock>
      ))}
    </main>
  );
}
