import { Fragment, type ReactNode } from "react";
import { About } from "@/components/sections/About";
import { CTA } from "@/components/sections/CTA";
import { ContactForm } from "@/components/sections/ContactForm";
import { FAQ } from "@/components/sections/FAQ";
import { Features } from "@/components/sections/Features";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Pricing } from "@/components/sections/Pricing";
import { Stats } from "@/components/sections/Stats";
import { Steps } from "@/components/sections/Steps";
import { Team } from "@/components/sections/Team";
import { Testimonials } from "@/components/sections/Testimonials";
import { presetDefaults, warnFlatVariant } from "@/lib/preset";
import type {
  ContactsConfig,
  IconShape,
  Preset,
  Section,
  SectionType,
  TitleStyle,
} from "@/types/site";

/** Данные сайта, которые нужны секциям помимо их собственных. */
export interface RenderContext {
  contacts: ContactsConfig;
  /** Тариф оформления: от него зависит раскладка секции по умолчанию. */
  preset: Preset;
  /** Сайтвайдный дефолт формы .icon-tile (theme.iconShape) — см. SectionBase.iconShape. */
  iconShape: IconShape;
  /**
   * Сайтвайдный дефолт ThemeConfig.titleStyle — резолв тут не для CSS
   * (тот идёт каскадом через data-title-style на <html>, см. раздел 1
   * docs/section-system.md), а только для dev-warn CTA centered/boxed:
   * им нужно ЗНАТЬ резолвленное значение, чтобы предупредить о ловушке
   * titleStyle, а CSS-каскад сам по себе этого не даёт.
   */
  titleStyle: TitleStyle;
}

type Renderer<K extends SectionType> = (
  section: Extract<Section, { type: K }>,
  context: RenderContext,
) => ReactNode;

/**
 * Реестр: тип секции из конфига → компонент, который её рендерит.
 *
 * Импорты тут статические, и это осознанный выбор, а не недосмотр.
 * next/dynamic для этого реестра не помогает: registry[section.type] —
 * это выбор по строке из данных (site.config.ts), а бандлер решает, что
 * попадёт в чанк, по самому коду, а не по содержимому другого файла —
 * он не умеет доказать, что какой-то тип секции нигде не встретится
 * в конфиге, и потому не выкидывает его код. Проверено на сборке: даже
 * убрав секцию из site.config.ts, её JS остаётся в бандле что на
 * Turbopack, что на Webpack.
 *
 * У большинства секций (Hero, Stats, Features, Steps, Gallery,
 * Testimonials, Team, About, Pricing, CTA) нет собственного клиентского JS
 * вообще — это чистые Server Components, их код и так не попадает в
 * бандл браузера независимо от способа импорта. Единственные тяжёлые
 * по клиентскому JS — FAQ (через Accordion) и ContactForm (форма,
 * Toast, Select): их вес неизбежен, если секция реально есть на
 * странице.
 *
 * Если в конкретном проекте какой-то секции нет и не будет —
 * единственный способ реально не тащить её JS: удалить импорт и
 * строку в registry ниже руками в этом проекте. Автоматически
 * почистить это на основе одного только site.config.ts нельзя без
 * генерации файла под конкретный проект.
 *
 * Чтобы добавить новую секцию:
 * 1. Новый тип в types/site.ts.
 * 2. Папка components/sections/<Название>/ — index.tsx (роутер по
 *    variant) + variants/<Вариант>.tsx. Все секции устроены одинаково,
 *    см. docs/section-system.md, раздел 7.
 * 3. Обычный import сверху + строка в registry ниже. Импортируется
 *    папка, путь резолвится в её index.tsx.
 *
 * Чтобы добавить новый ВАРИАНТ существующей секции, этот файл трогать
 * не нужно вообще: вариант добавляется внутри папки секции.
 *
 * ТАРИФ И ВАРИАНТЫ. Реестр — единственное место, где variant секции
 * подставляется по тарифу: `section.variant ?? presetDefaults(preset).X`.
 * Смысл: секция без variant в конфиге получает раскладку СВОЕГО тарифа
 * (в «Стандарте» — карточную), а не всегда экономовскую табличную.
 * Явно указанный в site.config.ts variant всегда главнее. Резолвим
 * именно тут, а не внутри компонентов: SectionRenderer — серверный, и
 * так таблица «тариф → раскладка» не утекает в клиентский бандл вместе
 * с ContactForm ("use client"), а заодно читается одним куском.
 */
const registry: { [K in SectionType]: Renderer<K> } = {
  hero: (section, { preset }) => (
    <Hero {...section} variant={section.variant ?? presetDefaults(preset).hero} />
  ),
  stats: (section, { preset, iconShape }) => (
    <Stats
      {...section}
      variant={section.variant ?? presetDefaults(preset).stats}
      containerVariant={
        section.containerVariant ?? presetDefaults(preset).statsContainer
      }
      iconShape={section.iconShape ?? iconShape}
    />
  ),
  features: (section, { preset, iconShape }) => (
    <Features
      {...section}
      variant={section.variant ?? presetDefaults(preset).features}
      iconShape={section.iconShape ?? iconShape}
    />
  ),
  steps: (section, { preset, iconShape }) => (
    <Steps
      {...section}
      variant={section.variant ?? presetDefaults(preset).steps}
      iconShape={section.iconShape ?? iconShape}
    />
  ),
  gallery: (section, { preset, iconShape }) => (
    <Gallery
      {...section}
      variant={section.variant ?? presetDefaults(preset).gallery}
      iconShape={section.iconShape ?? iconShape}
    />
  ),
  testimonials: (section, { preset }) => (
    <Testimonials
      {...section}
      variant={section.variant ?? presetDefaults(preset).testimonials}
    />
  ),
  team: (section, { preset }) => (
    <Team {...section} variant={section.variant ?? presetDefaults(preset).team} />
  ),
  about: (section, { iconShape }) => (
    <About {...section} iconShape={section.iconShape ?? iconShape} />
  ),
  faq: (section, { preset, iconShape }) => (
    <FAQ
      {...section}
      variant={section.variant ?? presetDefaults(preset).faq}
      iconShape={section.iconShape ?? iconShape}
    />
  ),
  pricing: (section, { preset, iconShape }) => (
    <Pricing
      {...section}
      variant={section.variant ?? presetDefaults(preset).pricing}
      iconShape={section.iconShape ?? iconShape}
    />
  ),
  cta: (section, { titleStyle }) => (
    <CTA {...section} resolvedTitleStyle={section.titleStyle ?? titleStyle} />
  ),
  contact: (section, { contacts, preset, iconShape }) => (
    <ContactForm
      {...section}
      variant={section.variant ?? presetDefaults(preset).contact}
      layout={section.layout ?? presetDefaults(preset).contactLayout}
      contacts={contacts}
      iconShape={section.iconShape ?? iconShape}
    />
  ),
};

interface SectionRendererProps {
  sections: Section[];
  context: RenderContext;
}

export function SectionRenderer({ sections, context }: SectionRendererProps) {
  return (
    <>
      {sections.map((section) => {
        const render = registry[section.type] as Renderer<SectionType>;

        // Дефолт тарифа помогает только там, где variant в конфиге не
        // указан вовсе. А конфиг обычно копируют с примера, где variant
        // проставлен везде — и «Стандарт» снова собирается из плоских
        // раскладок. Про это говорим вслух в dev, с готовой заменой.
        warnFlatVariant(
          context.preset,
          section.type,
          section.id,
          "variant" in section ? section.variant : undefined,
          section.type === "stats"
            ? {
                key: "containerVariant",
                value: section.containerVariant,
                flat: "flat",
                use: 'containerVariant: "elevated"',
              }
            : section.type === "contact"
              ? {
                  key: "layout",
                  value: section.layout,
                  flat: "plain",
                  use: 'layout: "cardContainer"',
                }
              : undefined,
        );

        if (!render) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(
              `[SectionRenderer] Нет компонента для типа секции: ${section.type}`,
            );
          }
          return null;
        }

        // titleStyle — переопределение per-секцию (SectionBase.titleStyle):
        // без него data-title-style на <html> и так наследуется по DOM
        // на любую глубину (см. theme/tokens.css), обёртка не нужна.
        // Оборачиваем div'ом, а не пропом до Section: у ~40 файлов
        // вариантов разная сигнатура пропов, а CSS custom properties
        // наследуются через любой промежуточный элемент без разницы.
        return (
          <Fragment key={section.id}>
            {section.titleStyle ? (
              <div data-title-style={section.titleStyle}>
                {render(section, context)}
              </div>
            ) : (
              render(section, context)
            )}
          </Fragment>
        );
      })}
    </>
  );
}

export default SectionRenderer;
