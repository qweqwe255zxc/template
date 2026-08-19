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
 * `sticky-split` — двенадцать секций между собой, хедер и футер
 * оставлены как в site.config.ts (у `sticky-split` нет своего варианта
 * хедера/футера — приём касается только заголовков разделов, см.
 * CLAUDE.md §2.15).
 *
 * Первый стенд семейства по счёту в каталоге §2.15–2.18, но заведён
 * последним — раньше существовали только `/qa-audit/editorial`,
 * `/qa-audit/product`, `/qa-audit/atelier`. Причина та же, что у них:
 * постраничный стенд показывает раскладку в вакууме и не отвечает на
 * единственный вопрос, ради которого сквозное семейство есть, — не
 * прыгает ли ось 4/12 между соседними разделами при прокрутке.
 *
 * Для `sticky-split` эта проверка не про заливки и не про декор, а про
 * пиксели: `components/ui/StickySplit.tsx` держит ось для всех секций
 * одним компонентом именно затем, чтобы на этом стенде она не
 * расходилась. Смотреть плавную прокрутку сверху вниз целиком — если
 * левая колонка дёргается по горизонтали между разделами, это баг оси,
 * а не одного варианта.
 *
 * Ритм поверхностей тут НАМЕРЕННО берётся из site.config.ts как есть, а
 * не выравнивается под семейство: правило §3 действует и здесь, и на
 * стенде должно быть видно, чего стоит его нарушить.
 */
const stickySplitSections = siteConfig.sections.map(
  // Приведение — на весь map разом, а не на каждый тип секции: `variant`
  // у каждого из двенадцати членов union свой, и TypeScript при spread'е
  // союза расширяет поле до строки. Проверку это не ослабляет: значение
  // "sticky-split" входит в union каждой секции (types/site.ts), и если
  // его оттуда убрать, роутер перестанет компилироваться раньше, чем
  // этот файл.
  (section) => ({ ...section, variant: "sticky-split" }) as Section,
);

export default function QaStickySplitPage() {
  const { brand, contacts, theme, header, footer } = siteConfig;
  const nav = buildNav(siteConfig);

  return (
    <>
      <QaNav current="sticky-split" />
      <Header
        brandName={brand.name}
        brandMark={brand.mark}
        nav={nav}
        actions={header.actions}
        showThemeToggle={theme.darkModeToggle}
        variant={header.variant}
        heroSurface={siteConfig.sections[0]?.surface ?? "paper"}
        hideOnScroll={false}
      />

      <main id="main">
        <SectionRenderer
          sections={stickySplitSections}
          context={{
            contacts,
            preset: theme.preset ?? "econom",
            iconShape: theme.iconShape ?? "circle",
            titleStyle: theme.titleStyle ?? "standard",
          }}
        />
      </main>

      <Footer brand={brand} contacts={contacts} footer={footer} nav={nav} />
    </>
  );
}
