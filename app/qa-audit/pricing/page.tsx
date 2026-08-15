import { Pricing } from "@/components/sections/Pricing";
import { siteConfig } from "@/content/site.config";
import type { PricingSection } from "@/types/site";
import { QaBlock } from "../_lib";

const base = siteConfig.sections.find(
  (s): s is PricingSection => s.type === "pricing",
)!;

const variants: NonNullable<PricingSection["variant"]>[] = [
  "table",
  "cards",
  "ribbon",
  "split",
  "dark",
  "playful",
  "quote",
  "glass",
  "banner",
  "matrix",
  "sticky-split",
  "editorial",
];

export default function QaPricingPage() {
  return (
    <main>
      {variants.map((variant) => (
        <QaBlock key={variant} label={`Pricing / variant="${variant}"`}>
          <Pricing
            {...base}
            id={`pricing-${variant}`}
            variant={variant}
            iconShape={base.iconShape ?? siteConfig.theme.iconShape}
          />
        </QaBlock>
      ))}
    </main>
  );
}
