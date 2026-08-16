import { Cards } from "./variants/Cards";
import { Cascade } from "./variants/Cascade";
import { Editorial } from "./variants/Editorial";
import { Product } from "./variants/Product";
import { NumberedCards } from "./variants/NumberedCards";
import { Rail } from "./variants/Rail";
import { Split } from "./variants/Split";
import { Stack } from "./variants/Stack";
import { TimelineHorizontal } from "./variants/TimelineHorizontal";
import { TimelineVertical } from "./variants/TimelineVertical";
import { StickySplit } from "./variants/StickySplit";
import type { VariantMap } from "../variantMap";
import type { StepsSection } from "@/types/site";

/**
 * Роутер секции Steps.
 * Как добавить новый дизайн — docs/section-system.md, раздел 7.
 */
/* --------------------------------------------------------------------------
   ТАРИФНАЯ ПОМЕТКА (временная, поставлена при переносе лендинга
   Sirotov Architects).

   ЭКОНОМ-КЛАСС — весь каталог вариантов, существовавший ДО семейств
   `editorial` и `product`: rail, stack, timeline-vertical, cards, cascade,
   timeline-horizontal, split, numbered-cards, sticky-split.

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
const variants: VariantMap<
  StepsSection,
  NonNullable<StepsSection["variant"]>
> = {
  // Эконом-класс
  rail: Rail,
  stack: Stack,
  "timeline-vertical": TimelineVertical,
  cards: Cards,
  cascade: Cascade,
  "timeline-horizontal": TimelineHorizontal,
  split: Split,
  "numbered-cards": NumberedCards,
  "sticky-split": StickySplit,
  // Семейство editorial
  editorial: Editorial,
  // Семейство product
  product: Product,
};

export function Steps(props: StepsSection) {
  const requested = props.variant ?? "rail";
  const missingImage = requested === "split" && !props.image;

  if (process.env.NODE_ENV !== "production" && missingImage) {
    console.warn(
      `[Steps] Секция "${props.id}": variant="split" без image — фото занять нечем, ` +
        `показан "rail". Дайте image: "/images/..." или возьмите другой variant. ` +
        `См. docs/section-system.md.`,
    );
  }

  // Раньше при отсутствии image Split.tsx рендерил null — раздел молча
  // исчезал со страницы вместо того, чтобы показать хоть что-то. Тот же
  // принцип отката, что у Hero.resolveHeroLayout: несовместимая комбинация
  // полей не должна давать пустой блок, только предупреждение в dev.
  const resolved = missingImage ? "rail" : requested;
  const Variant = variants[resolved] ?? Rail;
  return <Variant {...props} />;
}

export default Steps;
