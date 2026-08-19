import { Atelier } from "./variants/Atelier";
import { Market } from "./variants/Market";
import { Editorial } from "./variants/Editorial";
import { Product } from "./variants/Product";
import { Panel } from "./variants/Panel";
import { Photo } from "./variants/Photo";
import { QuietSplit } from "./variants/QuietSplit";
import { SplitActions } from "./variants/SplitActions";
import { TypeOnly } from "./variants/TypeOnly";
import { StickySplit } from "./variants/StickySplit";
import type { VariantMap } from "../variantMap";
import type { AboutSection } from "@/types/site";

/**
 * Роутер секции About («о нас» / «о месте»).
 * Как добавить новый дизайн — docs/section-system.md, раздел 7.
 */
/* --------------------------------------------------------------------------
   ТАРИФНАЯ ПОМЕТКА (временная, поставлена при переносе лендинга
   Sirotov Architects).

   ЭКОНОМ-КЛАСС — весь каталог вариантов, существовавший ДО
   семейств `editorial`, `product`, `atelier` и `market`: photo, type-only, split-actions, quiet-split, panel, sticky-split.

   EDITORIAL — печатная сетка: линейки, нумерованные колонтитулы,
   крупный заголовок в верхнем регистре. Общая шапка семейства —
   components/ui/EditorialHeader.tsx.

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

   MARKET — уличная вывеска: заголовок раздела капслоком и АКЦЕНТНЫМ
   цветом с двойным шевроном под ним, плоские карточки без теней и
   рамок, бегущая строка (`SectionBase.ticker`) отбивкой между
   разделами. Общая шапка семейства — components/ui/MarketHeader.tsx,
   полоса — components/ui/Ticker.tsx. Тоже закрыто целиком.

   Пометка НАМЕРЕННО лежит отдельно от тарифной механики шаблона:
   theme.preset ("econom"/"standard"), PRESET_DEFAULTS в lib/preset.ts и
   блоки [data-preset] в theme/tokens.css не тронуты вообще. Чтобы
   вернуть как было, достаточно снять этот комментарий, строки
   `editorial`/`product`/`atelier`/`market` из карты ниже и значения из union в
   types/site.ts.
   -------------------------------------------------------------------------- */
const variants: VariantMap<
  AboutSection,
  NonNullable<AboutSection["variant"]>
> = {
  // Эконом-класс
  photo: Photo,
  "type-only": TypeOnly,
  "split-actions": SplitActions,
  "quiet-split": QuietSplit,
  panel: Panel,
  "sticky-split": StickySplit,
  // Семейство editorial
  editorial: Editorial,
  // Семейство product
  product: Product,
  // Семейство atelier
  atelier: Atelier,
  // Семейство market
  market: Market,
};

// editorial тоже здесь: без фотографии от него остаётся одна текстовая
// колонка 7/12, то есть type-only с пустой половиной справа — ровно тот
// случай, ради которого этот откат и заведён.
const PHOTO_REQUIRED_VARIANTS = new Set([
  "photo",
  "split-actions",
  "quiet-split",
  "panel",
  "editorial",
]);

export function About(props: AboutSection) {
  const requested = props.variant ?? "photo";
  const needsPhoto = PHOTO_REQUIRED_VARIANTS.has(requested) && !props.photo;

  if (process.env.NODE_ENV !== "production" && needsPhoto) {
    console.warn(
      `[About] Секция "${props.id}": variant="${requested}" без photo — фото занять нечем, ` +
        `показан "type-only". Дайте photo: "/images/..." или возьмите другой variant. ` +
        `См. docs/section-system.md.`,
    );
  }

  const resolved = needsPhoto ? "type-only" : requested;
  const Variant = variants[resolved] ?? Photo;
  return <Variant {...props} />;
}

export default About;
