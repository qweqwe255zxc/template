import { Bento } from "./variants/Bento";
import { Cards } from "./variants/Cards";
import { Editorial } from "./variants/Editorial";
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

   ЭКОНОМ-КЛАСС — весь каталог вариантов, существовавший ДО
   семейства `editorial`: quotes, cards, bento, rated-cards, spotlight, sticky-split.

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
  // Семейство editorial
  editorial: Editorial,
};

export function Testimonials(props: TestimonialsSection) {
  const Variant = variants[props.variant ?? "quotes"] ?? Quotes;
  return <Variant {...props} />;
}

export default Testimonials;
