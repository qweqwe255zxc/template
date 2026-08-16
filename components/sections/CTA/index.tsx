import { Band } from "./variants/Band";
import { Boxed } from "./variants/Boxed";
import { Centered } from "./variants/Centered";
import { Editorial } from "./variants/Editorial";
import { Product } from "./variants/Product";
import { Left } from "./variants/Left";
import { Panel } from "./variants/Panel";
import { Quiet } from "./variants/Quiet";
import { StickySplit } from "./variants/StickySplit";
import type { VariantMap } from "../variantMap";
import type { CtaSection, TitleStyle } from "@/types/site";

/**
 * Роутер секции CTA. Единственный блок на странице с акцентной заливкой
 * фона — специально держим его в одном экземпляре. Внутри по минимуму:
 * заголовок, строка, кнопка, ничего лишнего.
 *
 * number и nav секция не читает: варианты их не деструктурируют, задать
 * в конфиге можно, эффекта не будет. eyebrow читают centered/left/boxed/
 * panel (эйброу пилюлей или точкой) — band/quiet его не показывают.
 *
 * Как добавить новый дизайн — docs/section-system.md, раздел 7.
 */
/* --------------------------------------------------------------------------
   ТАРИФНАЯ ПОМЕТКА (временная, поставлена при переносе лендинга
   Sirotov Architects).

   ЭКОНОМ-КЛАСС — весь каталог вариантов, существовавший ДО семейств
   `editorial` и `product`: band, quiet, centered, left, boxed, panel, sticky-split.

   EDITORIAL — новое семейство: печатная сетка, линейки, нумерованные
   колонтитулы, крупный заголовок в верхнем регистре. Общая шапка
   семейства — components/ui/EditorialHeader.tsx.

   Семейство закрыто целиком: вариант `editorial` есть у всех
   двенадцати секций и у Header/Footer, то есть сайт этим приёмом
   собирается без примеси карточных раскладок.

   PRODUCT — карточки и метрики: каждый блок в Card, у каждого раздела
   измеримый показатель, числа tabular. Общая шапка семейства —
   components/ui/ProductHeader.tsx. Тоже закрыто целиком.

   Пометка НАМЕРЕННО лежит отдельно от тарифной механики шаблона:
   theme.preset ("econom"/"standard"), PRESET_DEFAULTS в lib/preset.ts и
   блоки [data-preset] в theme/tokens.css не тронуты вообще. Чтобы
   вернуть как было, достаточно снять этот комментарий, строки
   `editorial`/`product` из карты ниже и значения из union в
   types/site.ts.
   -------------------------------------------------------------------------- */
const variants: VariantMap<CtaSection, NonNullable<CtaSection["variant"]>> = {
  // Эконом-класс
  band: Band,
  quiet: Quiet,
  centered: Centered,
  left: Left,
  boxed: Boxed,
  panel: Panel,
  "sticky-split": StickySplit,
  // Семейство editorial
  editorial: Editorial,
  // Семейство product
  product: Product,
};

/**
 * centered/boxed кладут .section-title прямо на <h2> внутри своей же
 * text-center обёртки — унаследованный text-align проигрывает явному
 * значению на самом элементе, поэтому без theme.titleStyle: "centered"
 * (сайтвайдно или на этой секции) заголовок молча теряет центрирование
 * и крупный кегль (docs/section-system.md, раздел 1, «Важная ловушка»).
 * resolvedTitleStyle — уже посчитанный SectionRenderer.tsx резолв
 * (section.titleStyle ?? theme.titleStyle) специально для этой проверки:
 * сам рендер по-прежнему держится на CSS-каскаде data-title-style, этот
 * проп нужен только чтобы предупредить в dev, а не чтобы на него рисовать.
 */
const TITLE_STYLE_SENSITIVE: NonNullable<CtaSection["variant"]>[] = ["centered", "boxed"];

interface CTAProps extends CtaSection {
  resolvedTitleStyle?: TitleStyle;
}

export function CTA({ resolvedTitleStyle, ...props }: CTAProps) {
  const resolved = props.variant ?? "band";
  const Variant = variants[resolved] ?? Band;

  if (
    process.env.NODE_ENV !== "production" &&
    TITLE_STYLE_SENSITIVE.includes(resolved) &&
    resolvedTitleStyle !== "centered"
  ) {
    console.warn(
      `[CTA] Секция "${props.id}": variant="${resolved}" без theme.titleStyle: "centered" ` +
        `(сайтвайдно) или titleStyle: "centered" (на этой секции) — заголовок потеряет ` +
        `центрирование и уменьшится до text-h2. См. docs/section-system.md, раздел 1.`,
    );
  }

  return <Variant {...props} />;
}

export default CTA;
