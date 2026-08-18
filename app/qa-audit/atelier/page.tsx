import type { Metadata } from "next";
import { SectionRenderer } from "@/components/SectionRenderer";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { siteConfig } from "@/content/site.config";
import { buildNav } from "@/lib/seo";
import type { Section } from "@/types/site";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Стенд СЕМЕЙСТВА, а не секции: вся страница собрана вариантом
 * `atelier` — хедер, двенадцать секций и футер.
 *
 * Третий такой стенд после `/qa-audit/editorial` и `/qa-audit/product`,
 * и заведён по той же причине: постраничный стенд показывает раскладку
 * в вакууме, рядом с девятью чужими, и на нём не виден единственный
 * вопрос, ради которого сквозное семейство существует — складывается ли
 * из этих раскладок ОДНА страница.
 *
 * Для `atelier` у этого стенда есть своя, отдельная работа. Приём
 * держится на двух графических элементах, которые повторяются в каждом
 * разделе: короткий штрих под заголовком и решётка на волосяных швах.
 * Проверять надо ровно их накопление — не рассыпается ли штрих в
 * случайную чёрточку к десятому повтору и не сливаются ли четыре
 * разграфлённых блока (цифры, этапы, отзывы, тарифы) в одну клетчатую
 * простыню. Ни того, ни другого на постраничном стенде не видно.
 *
 * Ритм поверхностей тут НАМЕРЕННО берётся из site.config.ts как есть, а
 * не выравнивается под семейство: правило §3 действует и здесь, и на
 * стенде должно быть видно, чего стоит его нарушить.
 */
const atelierSections = siteConfig.sections.map(
  // Приведение — на весь map разом, а не на каждый тип секции: `variant`
  // у каждого из двенадцати членов union свой, и TypeScript при spread'е
  // союза расширяет поле до строки. Проверку это не ослабляет: значение
  // "atelier" входит в union каждой секции (types/site.ts), и если его
  // оттуда убрать, роутер перестанет компилироваться раньше, чем этот
  // файл.
  (section) => ({ ...section, variant: "atelier" }) as Section,
);

export default function QaAtelierPage() {
  const { brand, contacts, theme, header, footer } = siteConfig;
  const nav = buildNav(siteConfig);

  return (
    <>
      <Header
        brandName={brand.name}
        brandMark={brand.mark}
        nav={nav}
        actions={header.actions}
        showThemeToggle={theme.darkModeToggle}
        variant="atelier"
        heroSurface={siteConfig.sections[0]?.surface ?? "paper"}
        hideOnScroll={false}
      />

      <main id="main">
        <SectionRenderer
          sections={atelierSections}
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
        footer={{ ...footer, variant: "atelier" }}
        nav={nav}
      />
    </>
  );
}
