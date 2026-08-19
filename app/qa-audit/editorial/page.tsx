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
 * Стенд СЕМЕЙСТВА, а не секции: вся страница собрана одним приёмом —
 * хедер, двенадцать секций и футер в варианте `editorial`.
 *
 * Зачем отдельная страница, когда есть постраничные стенды. Постраничный
 * стенд показывает вариант в вакууме, рядом с восемью чужими
 * раскладками, и на нём принципиально не видно того единственного, ради
 * чего сквозное семейство и заводят: держится ли ритм, когда одинаковые
 * колонтитулы идут подряд двенадцать раз, не сливаются ли соседние
 * секции в одну простыню, попадают ли линейки разделов на одну
 * вертикаль (см. CLAUDE.md §2.16).
 *
 * С момента, как семейство закрыто целиком, эта страница — ещё и
 * основной стенд для замеров планки §1.5: все двенадцать раскладок
 * лежат на одном роуте, и пять ширин прогоняются одним проходом, а не
 * двенадцатью.
 *
 * Второй стенд того же рода напрашивается для `sticky-split` — там
 * вопрос «не прыгают ли залипающие заголовки по горизонтали между
 * секциями» тоже нельзя закрыть постранично. Пока не сделан.
 *
 * Ритм поверхностей тут НАМЕРЕННО берётся из site.config.ts как есть, а
 * не выравнивается по семейству: §3 CLAUDE.md действует и здесь, и на
 * стенде должно быть видно, что чередование фонов при одинаковой
 * раскладке становится не менее, а более важным.
 */
const editorialSections = siteConfig.sections.map(
  // Приведение — на весь map разом, а не на каждый тип секции: `variant`
  // у каждого из двенадцати членов union свой, и TypeScript при
  // spread'е союза расширяет поле до строки. Проверку это не ослабляет:
  // значение "editorial" входит в union каждой секции (types/site.ts),
  // и если его оттуда убрать, роутер перестанет компилироваться раньше,
  // чем этот файл.
  (section) => ({ ...section, variant: "editorial" }) as Section,
);

export default function QaEditorialPage() {
  const { brand, contacts, theme, header, footer } = siteConfig;
  const nav = buildNav(siteConfig);

  return (
    <>
      <QaNav current="editorial" />
      <Header
        brandName={brand.name}
        brandMark={brand.mark}
        nav={nav}
        actions={header.actions}
        showThemeToggle={theme.darkModeToggle}
        variant="editorial"
        heroSurface={siteConfig.sections[0]?.surface ?? "paper"}
        hideOnScroll={false}
      />

      <main id="main">
        <SectionRenderer
          sections={editorialSections}
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
        footer={{ ...footer, variant: "editorial" }}
        nav={nav}
      />
    </>
  );
}
