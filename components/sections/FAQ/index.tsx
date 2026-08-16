import { Categorized } from "./variants/Categorized";
import { Editorial } from "./variants/Editorial";
import { Narrow } from "./variants/Narrow";
import { SplitSidebar } from "./variants/SplitSidebar";
import { Wide } from "./variants/Wide";
import { StickySplit } from "./variants/StickySplit";
import type { VariantMap } from "../variantMap";
import type { FaqSection } from "@/types/site";

/**
 * Роутер секции FAQ.
 * Как добавить новый дизайн — docs/section-system.md, раздел 7.
 */
/* --------------------------------------------------------------------------
   ТАРИФНАЯ ПОМЕТКА (временная, поставлена при переносе лендинга
   Sirotov Architects).

   ЭКОНОМ-КЛАСС — весь каталог вариантов, существовавший ДО
   семейства `editorial`: narrow, wide, split-sidebar, categorized, sticky-split.

   EDITORIAL — печатная сетка: линейки, нумерованные колонтитулы,
   крупный заголовок в верхнем регистре. Общая шапка семейства —
   components/ui/EditorialHeader.tsx.

   Семейство закрыто целиком: вариант `editorial` есть у всех
   двенадцати секций и у Header/Footer, то есть сайт этим приёмом
   собирается без примеси карточных раскладок.

   Пометка НАМЕРЕННО лежит отдельно от тарифной механики шаблона:
   theme.preset ("econom"/"standard"), PRESET_DEFAULTS в lib/preset.ts и
   блоки [data-preset] в theme/tokens.css не тронуты вообще. Чтобы
   вернуть как было, достаточно снять этот комментарий, строку
   `editorial` из карты ниже и значение из union в types/site.ts.
   -------------------------------------------------------------------------- */
const variants: VariantMap<FaqSection, NonNullable<FaqSection["variant"]>> = {
  // Эконом-класс
    narrow: Narrow,
    wide: Wide,
    "split-sidebar": SplitSidebar,
    categorized: Categorized,
  "sticky-split": StickySplit,
  // Семейство editorial
  editorial: Editorial,
};

export function FAQ(props: FaqSection) {
    const Variant = variants[props.variant ?? "narrow"] ?? Narrow;
    return <Variant {...props} />;
}

export default FAQ;
