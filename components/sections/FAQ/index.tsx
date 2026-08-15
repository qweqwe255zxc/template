import { Categorized } from "./variants/Categorized";
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

   ЭКОНОМ-КЛАСС — весь каталог вариантов этой секции: narrow, wide, split-sidebar, categorized, sticky-split.

   EDITORIAL — семейство печатной сетки (линейки, нумерованные
   колонтитулы, крупный заголовок в верхнем регистре) у этой секции ПОКА
   НЕ СДЕЛАНО: первым заходом перенесены шесть ключевых секций — Hero,
   Features, Steps, Gallery, Pricing, CTA. Общая шапка семейства —
   components/ui/EditorialHeader.tsx.

   Пометка НАМЕРЕННО лежит отдельно от тарифной механики шаблона:
   theme.preset ("econom"/"standard"), PRESET_DEFAULTS в lib/preset.ts и
   блоки [data-preset] в theme/tokens.css не тронуты вообще. Чтобы
   вернуть как было, достаточно снять этот комментарий.
   -------------------------------------------------------------------------- */
const variants: VariantMap<FaqSection, NonNullable<FaqSection["variant"]>> = {
  // Эконом-класс
    narrow: Narrow,
    wide: Wide,
    "split-sidebar": SplitSidebar,
    categorized: Categorized,
  "sticky-split": StickySplit,
};

export function FAQ(props: FaqSection) {
    const Variant = variants[props.variant ?? "narrow"] ?? Narrow;
    return <Variant {...props} />;
}

export default FAQ;
