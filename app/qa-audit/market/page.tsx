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
 * `market` — хедер, двенадцать секций и футер.
 *
 * Четвёртый такой стенд после `/qa-audit/editorial`, `/qa-audit/product`
 * и `/qa-audit/atelier`, и заведён по той же причине: постраничный стенд
 * показывает раскладку в вакууме, рядом с десятью чужими, и на нём не
 * виден единственный вопрос, ради которого сквозное семейство
 * существует — складывается ли из этих раскладок ОДНА страница.
 *
 * Для `market` у стенда две своих работы, обе про накопление.
 *
 * ПЕРВАЯ — акцент. Это единственное семейство, где цветной сам
 * заголовок раздела, и цветными же идут цифры, иконки, кавычки в
 * отзывах и навигация в хедере. Постранично каждое из этих решений
 * выглядит уместно; вопрос в том, не превращается ли к десятому разделу
 * страница в равномерно оранжевую кашу, где акцент перестал что-либо
 * выделять. Ответить на это можно только прокруткой целиком.
 *
 * ВТОРАЯ — бегущая строка. Полоса в конфиге стоит у трёх секций, и это
 * ровно то число, при котором она работает отбивкой. Здесь видно, как
 * три полосы делят страницу на части, — и видно, во что превратится
 * страница, если поставить `ticker` всем двенадцати.
 *
 * Ритм поверхностей тут НАМЕРЕННО берётся из site.config.ts как есть, а
 * не выравнивается под семейство: правило §3 действует и здесь, и на
 * стенде должно быть видно, чего стоит его нарушить.
 */
const marketSections = siteConfig.sections.map(
  // Приведение — на весь map разом, а не на каждый тип секции: `variant`
  // у каждого из двенадцати членов union свой, и TypeScript при spread'е
  // союза расширяет поле до строки. Проверку это не ослабляет: значение
  // "market" входит в union каждой секции (types/site.ts), и если его
  // оттуда убрать, роутер перестанет компилироваться раньше, чем этот
  // файл.
  (section) => ({ ...section, variant: "market" }) as Section,
);

export default function QaMarketPage() {
  const { brand, contacts, theme, header, footer } = siteConfig;
  const nav = buildNav(siteConfig);

  return (
    <>
      <QaNav current="market" />
      <Header
        brandName={brand.name}
        brandMark={brand.mark}
        nav={nav}
        actions={header.actions}
        showThemeToggle={theme.darkModeToggle}
        variant="market"
        heroSurface={siteConfig.sections[0]?.surface ?? "paper"}
        hideOnScroll={false}
      />

      <main id="main">
        <SectionRenderer
          sections={marketSections}
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
        footer={{ ...footer, variant: "market" }}
        nav={nav}
      />
    </>
  );
}
