import { CardsIcon } from "./variants/CardsIcon";
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
const variants: VariantMap<
  GallerySection,
  NonNullable<GallerySection["variant"]>
> = {
  table: Table,
  grid: Grid,
  "cards-icon": CardsIcon,
  "photo-grid": PhotoGrid,
  "photo-bento": PhotoBento,
  "sticky-split": StickySplit,
};

export function Gallery(props: GallerySection) {
  const Variant = variants[props.variant ?? "table"] ?? Table;
  return <Variant {...props} />;
}

export default Gallery;
