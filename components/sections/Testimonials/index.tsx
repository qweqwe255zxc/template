import { Bento } from "./variants/Bento";
import { Cards } from "./variants/Cards";
import { Quotes } from "./variants/Quotes";
import { RatedCards } from "./variants/RatedCards";
import { Spotlight } from "./variants/Spotlight";
import { StickySplit } from "./variants/StickySplit";
import type { VariantMap } from "../variantMap";
import type { TestimonialsSection } from "@/types/site";

/**
 * Роутер секции Testimonials.
 * Как добавить новый дизайн — docs/section-system.md, раздел 7.
 */
/* --------------------------------------------------------------------------
   ТАРИФНАЯ ПОМЕТКА (временная, поставлена при переносе лендинга
   Sirotov Architects).

   ЭКОНОМ-КЛАСС — весь каталог вариантов этой секции: quotes, cards, bento, rated-cards, spotlight, sticky-split.

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
const variants: VariantMap<
  TestimonialsSection,
  NonNullable<TestimonialsSection["variant"]>
> = {
  // Эконом-класс
  quotes: Quotes,
  cards: Cards,
  bento: Bento,
  "rated-cards": RatedCards,
  spotlight: Spotlight,
  "sticky-split": StickySplit,
};

export function Testimonials(props: TestimonialsSection) {
  const Variant = variants[props.variant ?? "quotes"] ?? Quotes;
  return <Variant {...props} />;
}

export default Testimonials;
