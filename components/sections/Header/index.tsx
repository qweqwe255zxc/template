import { Atelier } from "./variants/Atelier";
import { Market } from "./variants/Market";
import { Bold } from "./variants/Bold";
import { Centered } from "./variants/Centered";
import { Classic } from "./variants/Classic";
import { Compact } from "./variants/Compact";
import { Default } from "./variants/Default";
import { Editorial } from "./variants/Editorial";
import { Product } from "./variants/Product";
import { Glass } from "./variants/Glass";
import { Monogram } from "./variants/Monogram";
import { Split } from "./variants/Split";
import type { VariantMap } from "../variantMap";
import type { HeaderProps } from "./types";
import type { HeaderVariant } from "@/types/site";

/**
 * Роутер хедера. Собственного поля variant у site.config.sections нет
 * (Header не проходит через SectionRenderer), ручка приходит из
 * siteConfig.header.variant — см. types/site.ts.
 *
 * Сам роутер серверный, клиентский только вариант: стейт меню и слушатель
 * скролла живут в variants/*.tsx и parts/useHeaderState.ts, поэтому
 * в клиентский бандл не уезжает ничего лишнего.
 *
 * Как добавить новый дизайн — docs/section-system.md, раздел 7.
 */
/* --------------------------------------------------------------------------
   ТАРИФНАЯ ПОМЕТКА (временная, поставлена при переносе лендинга
   Sirotov Architects).

   ЭКОНОМ-КЛАСС — весь каталог вариантов, существовавший ДО
   семейств `editorial`, `product`, `atelier` и `market`: default, bold, classic, compact, monogram, centered, glass, split.

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
const variants: VariantMap<HeaderProps, HeaderVariant> = {
  // Эконом-класс
  default: Default,
  bold: Bold,
  classic: Classic,
  compact: Compact,
  monogram: Monogram,
  centered: Centered,
  glass: Glass,
  split: Split,
  // Семейство editorial
  editorial: Editorial,
  // Семейство product
  product: Product,
  // Семейство atelier
  atelier: Atelier,
  // Семейство market
  market: Market,
};

export function Header(props: HeaderProps) {
  const Variant = variants[props.variant ?? "default"] ?? Default;
  return <Variant {...props} />;
}

export default Header;
