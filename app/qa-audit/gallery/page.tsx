import { Gallery } from "@/components/sections/Gallery";
import { siteConfig } from "@/content/site.config";
import type { GallerySection } from "@/types/site";
import { QaBlock } from "../_lib";

const base = siteConfig.sections.find(
  (s): s is GallerySection => s.type === "gallery",
)!;

const variants: NonNullable<GallerySection["variant"]>[] = [
  "table",
  "grid",
  "cards-icon",
  "photo-grid",
  "photo-bento",
  "sticky-split",
  "editorial",
  "product",
];

export default function QaGalleryPage() {
  return (
    <main>
      {variants.map((variant) => (
        <QaBlock key={variant} label={`Gallery / variant="${variant}"`}>
          <Gallery
            {...base}
            id={`gallery-${variant}`}
            variant={variant}
            iconShape={base.iconShape ?? siteConfig.theme.iconShape}
          />
        </QaBlock>
      ))}
    </main>
  );
}
