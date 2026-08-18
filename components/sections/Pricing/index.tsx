import { Atelier } from "./variants/Atelier";
import { Banner } from "./variants/Banner";
import { Cards } from "./variants/Cards";
import { Dark } from "./variants/Dark";
import { Editorial } from "./variants/Editorial";
import { Product } from "./variants/Product";
import { Glass } from "./variants/Glass";
import { Matrix } from "./variants/Matrix";
import { Playful } from "./variants/Playful";
import { Quote } from "./variants/Quote";
import { Ribbon } from "./variants/Ribbon";
import { Split } from "./variants/Split";
import { Table } from "./variants/Table";
import { StickySplit } from "./variants/StickySplit";
import type { VariantMap } from "../variantMap";
import type { PricingSection } from "@/types/site";

/**
 * Роутер секции Pricing.
 *
 * Как и Features, роутер ФОРСИРУЕТ Cards, если хотя бы у одного плана
 * задан photo: табличная сетка с border-top/border-l не умеет выравнивать
 * фото произвольной высоты. См. docs/section-system.md, раздел 2.
 *
 * Как добавить новый дизайн — docs/section-system.md, раздел 7.
 */
/* --------------------------------------------------------------------------
   ТАРИФНАЯ ПОМЕТКА (временная, поставлена при переносе лендинга
   Sirotov Architects). «Тариф» здесь — класс шаблона, не тариф клиента
   из items ниже.

   ЭКОНОМ-КЛАСС — весь каталог вариантов, существовавший ДО семейств
   `editorial`, `product` и `atelier`: table, cards, ribbon, split, dark, playful, quote, glass,
   banner, matrix, sticky-split.

   EDITORIAL — новое семейство: печатная сетка, линейки, нумерованные
   колонтитулы, крупный заголовок в верхнем регистре. Общая шапка
   семейства — components/ui/EditorialHeader.tsx.

   Семейство закрыто целиком: вариант `editorial` есть у всех
   двенадцати секций и у Header/Footer, то есть сайт этим приёмом
   собирается без примеси карточных раскладок.

   PRODUCT — карточки и метрики: каждый блок в Card, у каждого раздела
   измеримый показатель, числа tabular. Общая шапка семейства —
   components/ui/ProductHeader.tsx. Тоже закрыто целиком.

   ATELIER — разграфлённый бланк: решётка на волосяных швах
   (components/ui/SeamGrid.tsx), короткий акцентный штрих под заголовком
   раздела, плитка квадратов встык. Общая шапка семейства —
   components/ui/AtelierHeader.tsx. Тоже закрыто целиком.

   Пометка НАМЕРЕННО лежит отдельно от тарифной механики шаблона:
   theme.preset ("econom"/"standard"), PRESET_DEFAULTS в lib/preset.ts и
   блоки [data-preset] в theme/tokens.css не тронуты вообще. Чтобы
   вернуть как было, достаточно снять этот комментарий, строки
   `editorial`/`product`/`atelier` из карты ниже и значения из union в
   types/site.ts.
   -------------------------------------------------------------------------- */
const variants: VariantMap<
  PricingSection,
  NonNullable<PricingSection["variant"]>
> = {
  // Эконом-класс
  table: Table,
  cards: Cards,
  ribbon: Ribbon,
  split: Split,
  dark: Dark,
  playful: Playful,
  quote: Quote,
  glass: Glass,
  banner: Banner,
  matrix: Matrix,
  "sticky-split": StickySplit,
  // Семейство editorial
  editorial: Editorial,
  // Семейство product
  product: Product,
  // Семейство atelier
  atelier: Atelier,
};

export function Pricing(props: PricingSection) {
  const variant = props.variant ?? "table";
  const hasPhoto = props.items.some((plan) => plan.photo);

  // product из форсирования исключён: он, как и cards, рисует план через
  // PlanContent внутри Card и прокидывает mediaAspectClassName, то есть
  // фото у него работает штатно. Форс существовал ради табличных и
  // панельных раскладок, где бокс с фото выравнивать нечем, — но для
  // сквозного семейства он означал бы, что одна секция страницы молча
  // выпадает из приёма из-за поля в конфиге.
  const forcedToCards = hasPhoto && variant !== "product";

  if (process.env.NODE_ENV !== "production" && forcedToCards && variant !== "cards") {
    console.warn(
      `[Pricing] Секция "${props.id}": variant="${variant}" не поддерживает photo — форсирован variant="cards".`,
    );
  }

  const Variant = forcedToCards ? Cards : (variants[variant] ?? Table);
  return <Variant {...props} />;
}

export default Pricing;
