import { About } from "@/components/sections/About";
import { siteConfig } from "@/content/site.config";
import type { AboutSection } from "@/types/site";
import { QaBlock } from "../_lib";

const base = siteConfig.sections.find(
  (s): s is AboutSection => s.type === "about",
)!;

const variants: NonNullable<AboutSection["variant"]>[] = [
  "photo",
  "type-only",
  "split-actions",
  "quiet-split",
  "panel",
  "sticky-split",
];

export default function QaAboutPage() {
  return (
    <main>
      {variants.map((variant) => (
        <QaBlock key={variant} label={`About / variant="${variant}"`}>
          <About
            {...base}
            id={`about-${variant}`}
            variant={variant}
            iconShape={base.iconShape ?? siteConfig.theme.iconShape}
          />
        </QaBlock>
      ))}
      <QaBlock label={`About / variant="photo" photoPosition="left"`}>
        <About
          {...base}
          id="about-photo-left"
          variant="photo"
          photoPosition="left"
          iconShape={base.iconShape ?? siteConfig.theme.iconShape}
        />
      </QaBlock>
    </main>
  );
}
