import type { Metadata } from "next";
import { SectionRenderer } from "@/components/SectionRenderer";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { siteConfig } from "@/content/site.config";
import { buildNav } from "@/lib/seo";
import type { Section } from "@/types/site";
import { QaNav } from "../_lib";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Стенд СЕМЕЙСТВА, а не секции: вся страница собрана вариантом
 * `product` — хедер, двенадцать секций и футер.
 *
 * Парный к `/qa-audit/editorial` и заведён по той же причине.
 * Постраничный стенд показывает раскладку в вакууме, рядом с девятью
 * чужими, и на нём не виден единственный вопрос, ради которого сквозное
 * семейство и существует: складывается ли из этих раскладок ОДНА
 * страница. Для `product` он даже острее, чем для `editorial`: там
 * секции держит линейка, а тут — карточка, и двенадцать карточных
 * разделов подряд рискуют слиться в равномерную кашу, если поверхности
 * не чередуются (§3 CLAUDE.md).
 *
 * Ритм поверхностей тут НАМЕРЕННО берётся из site.config.ts как есть, а
 * не выравнивается под семейство: правило §3 действует и здесь, и на
 * стенде должно быть видно, чего стоит его нарушить.
 */
const productSections = siteConfig.sections.map(
  // Приведение — на весь map разом, а не на каждый тип секции: `variant`
  // у каждого из двенадцати членов union свой, и TypeScript при spread'е
  // союза расширяет поле до строки. Проверку это не ослабляет: значение
  // "product" входит в union каждой секции (types/site.ts), и если его
  // оттуда убрать, роутер перестанет компилироваться раньше, чем этот
  // файл.
  (section) => ({ ...section, variant: "product" }) as Section,
);

export default function QaProductPage() {
  const { brand, contacts, theme, header, footer } = siteConfig;
  const nav = buildNav(siteConfig);

  return (
    <>
      <QaNav current="product" />
      <Header
        brandName={brand.name}
        brandMark={brand.mark}
        nav={nav}
        actions={header.actions}
        showThemeToggle={theme.darkModeToggle}
        variant="product"
        heroSurface={siteConfig.sections[0]?.surface ?? "paper"}
        hideOnScroll={false}
      />

      <main id="main">
        <SectionRenderer
          sections={productSections}
          context={{
            contacts,
            preset: theme.preset ?? "econom",
            iconShape: theme.iconShape ?? "circle",
            titleStyle: theme.titleStyle ?? "standard",
          }}
        />
      </main>

      <Footer
        brand={brand}
        contacts={contacts}
        footer={{ ...footer, variant: "product" }}
        nav={nav}
      />
    </>
  );
}
