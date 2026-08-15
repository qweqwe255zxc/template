import { Features } from "@/components/sections/Features";
import { siteConfig } from "@/content/site.config";
import type { FeaturesSection } from "@/types/site";
import { QaBlock } from "../_lib";

const base = siteConfig.sections.find(
  (s): s is FeaturesSection => s.type === "features",
)!;

const variants: NonNullable<FeaturesSection["variant"]>[] = [
  "table",
  "cards",
  "bento",
  "sticky-split",
  "alternating",
  "compact",
  "editorial",
];

/**
 * alternating построена вокруг item.photo, а в демо-конфиге у Features
 * фото нет — на стенде вариант показывал бы только свой фолбэк без
 * картинок. Фото подставляются ТОЛЬКО этому блоку: положить их в сам
 * site.config нельзя, роутер секции форсирует cards, как только фото
 * появляется хотя бы у одного элемента (см. Features/index.tsx), и
 * остальные пять раскладок на стенде перестали бы рендериться.
 */
const PHOTOS = [
  "/images/steps-1.jpg",
  "/images/steps-2.jpg",
  "/images/steps-3.jpg",
  "/images/steps-4.jpg",
];

const withPhotos = {
  ...base,
  items: base.items.map((item, index) => ({
    ...item,
    photo: PHOTOS[index % PHOTOS.length],
  })),
};

export default function QaFeaturesPage() {
  return (
    <main>
      {variants.map((variant) => (
        <QaBlock key={variant} label={`Features / variant="${variant}"`}>
          <Features
            {...(variant === "alternating" ? withPhotos : base)}
            id={`features-${variant}`}
            variant={variant}
            iconShape={base.iconShape ?? siteConfig.theme.iconShape}
          />
        </QaBlock>
      ))}
    </main>
  );
}
