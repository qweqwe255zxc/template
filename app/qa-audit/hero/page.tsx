import { Hero } from "@/components/sections/Hero";
import { siteConfig } from "@/content/site.config";
import type { HeroSection } from "@/types/site";
import { QaBlock, QaNav } from "../_lib";

const base = siteConfig.sections.find(
  (s): s is HeroSection => s.type === "hero",
)!;

const variants: NonNullable<HeroSection["variant"]>[] = [
  "type-only",
  "split",
  "centered",
  "showcase",
  "poster",
  "service",
  "sticky-split",
  "editorial",
  "product",
  "atelier",
];

export default function QaHeroPage() {
  return (
    <main>
      <QaNav current="hero" />
      {variants.map((variant) => (
        <QaBlock key={variant} label={`Hero / variant="${variant}"`}>
          <Hero
            {...base}
            id={`hero-${variant}`}
            variant={variant}
            iconShape={base.iconShape ?? siteConfig.theme.iconShape}
          />
        </QaBlock>
      ))}
    </main>
  );
}
