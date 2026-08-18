import { CTA } from "@/components/sections/CTA";
import { siteConfig } from "@/content/site.config";
import type { CtaSection } from "@/types/site";
import { QaBlock } from "../_lib";

const base = siteConfig.sections.find(
  (s): s is CtaSection => s.type === "cta",
)!;

const variants: NonNullable<CtaSection["variant"]>[] = [
  "band",
  "quiet",
  "centered",
  "left",
  "boxed",
  "panel",
  "sticky-split",
  "editorial",
  "product",
  "atelier",
];

export default function QaCtaPage() {
  return (
    <main>
      {variants.map((variant) => (
        <QaBlock key={variant} label={`CTA / variant="${variant}"`}>
          <CTA {...base} id={`cta-${variant}`} variant={variant} />
        </QaBlock>
      ))}
    </main>
  );
}
