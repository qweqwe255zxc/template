import { Header } from "@/components/sections/Header";
import { siteConfig } from "@/content/site.config";
import { buildNav } from "@/lib/seo";
import type { HeaderVariant } from "@/types/site";
import { QaLabel, QaNav } from "../_lib";

const nav = buildNav(siteConfig);

const variants: HeaderVariant[] = [
  "default",
  "bold",
  "classic",
  "compact",
  "monogram",
  "centered",
  "glass",
  "split",
  "editorial",
  "product",
  "atelier",
  "market",
];

/**
 * Header — все варианты `fixed inset-x-0 top-0` (позиционируются
 * относительно вьюпорта, а не относительно родителя с position:relative).
 * transform на обёртке создаёт containing block для position:fixed
 * потомков (см. спецификацию CSS Transforms), поэтому каждый вариант
 * рисуется внутри своего фиксированного по высоте окна, а не наезжает
 * на соседей у самого верха страницы.
 */
export default function QaHeaderPage() {
  return (
    <main>
      <QaNav current="header" />
      {variants.map((variant) => (
        <div key={variant}>
          <QaLabel>{`Header / variant="${variant}"`}</QaLabel>
          <div
            style={{
              position: "relative",
              height: 220,
              overflow: "hidden",
              borderBottom: "2px solid #000",
              transform: "translateZ(0)",
            }}
          >
            <Header
              brandName={siteConfig.brand.name}
              brandMark={siteConfig.brand.mark}
              nav={nav}
              actions={siteConfig.header.actions}
              showThemeToggle={siteConfig.theme.darkModeToggle ?? false}
              variant={variant}
              heroSurface="paper"
              transparentBeforeScroll={false}
              hideOnScroll={false}
            />
          </div>
        </div>
      ))}
    </main>
  );
}
