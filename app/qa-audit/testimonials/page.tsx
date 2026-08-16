import { Testimonials } from "@/components/sections/Testimonials";
import { siteConfig } from "@/content/site.config";
import type { TestimonialsSection } from "@/types/site";
import { QaBlock } from "../_lib";

const base = siteConfig.sections.find(
  (s): s is TestimonialsSection => s.type === "testimonials",
)!;

const variants: NonNullable<TestimonialsSection["variant"]>[] = [
  "quotes",
  "cards",
  "bento",
  "rated-cards",
  "spotlight",
  "sticky-split",
  "editorial",
];

export default function QaTestimonialsPage() {
  return (
    <main>
      {variants.map((variant) => (
        <QaBlock key={variant} label={`Testimonials / variant="${variant}"`}>
          <Testimonials {...base} id={`testimonials-${variant}`} variant={variant} />
        </QaBlock>
      ))}
    </main>
  );
}
