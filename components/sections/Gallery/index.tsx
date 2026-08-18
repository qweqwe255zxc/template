import { Atelier } from "./variants/Atelier";
import { CardsIcon } from "./variants/CardsIcon";
import { Editorial } from "./variants/Editorial";
import { Product } from "./variants/Product";
import { Grid } from "./variants/Grid";
import { PhotoBento } from "./variants/PhotoBento";
import { PhotoGrid } from "./variants/PhotoGrid";
import { Table } from "./variants/Table";
import { StickySplit } from "./variants/StickySplit";
import type { VariantMap } from "../variantMap";
import type { GallerySection } from "@/types/site";

/**
 * Роутер секции Gallery (кейсы/работы). Единственный тёмный блок на
 * странице (в table/grid — surface="ink" по умолчанию; карточные
 * фото-варианты держат обычный surface="surface", см. каждый файл).
 *
 * Как добавить новый дизайн — docs/section-system.md, раздел 7.
 */
/* --------------------------------------------------------------------------
   ТАРИФНАЯ ПОМЕТКА (временная, поставлена при переносе лендинга
   Sirotov Architects).

   ЭКОНОМ-КЛАСС — весь каталог вариантов, существовавший ДО семейств
   `editorial`, `product` и `atelier`: table, grid, cards-icon, photo-grid, photo-bento,
   sticky-split.

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
  GallerySection,
  NonNullable<GallerySection["variant"]>
> = {
  // Эконом-класс
  table: Table,
  grid: Grid,
  "cards-icon": CardsIcon,
  "photo-grid": PhotoGrid,
  "photo-bento": PhotoBento,
  "sticky-split": StickySplit,
  // Семейство editorial
  editorial: Editorial,
  // Семейство product
  product: Product,
  // Семейство atelier
  atelier: Atelier,
};

export function Gallery(props: GallerySection) {
  const Variant = variants[props.variant ?? "table"] ?? Table;
  return <Variant {...props} />;
}

export default Gallery;
