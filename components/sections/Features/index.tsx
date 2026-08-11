import { Alternating } from "./variants/Alternating";
import { Bento } from "./variants/Bento";
import { Cards } from "./variants/Cards";
import { Compact } from "./variants/Compact";
import { StickySplit } from "./variants/StickySplit";
import { Table } from "./variants/Table";
import type { VariantMap } from "../variantMap";
import type { FeaturesSection } from "@/types/site";

/**
 * Роутер секции Features. Первая смена фона на странице (белая
 * поверхность вместо бумаги).
 *
 * Помимо выбора варианта роутер делает одну содержательную вещь: если
 * хотя бы у одного элемента задан photo, он ФОРСИРУЕТ Cards, что бы ни
 * стояло в конфиге — но только если стоял вариант БЕЗ карточки (table:
 * там рамки рисует grid, и он не умеет выравнивать фото произвольной
 * высоты, сетка расползается). cards и bento уже держат каждый item в
 * `Card`, туда photo встаёт без проблем. Правило обязательное, см.
 * docs/section-system.md, раздел 2.
 *
 * Раньше здесь было пять вариантов — `cards-cta` и `table-links`
 * поглощены `cards`/`table` как дубликаты (отличались только опциональной
 * ссылкой на элементе, которая и так читается из `item.link`). Не заводить
 * их обратно отдельными `variant`.
 *
 * Как добавить новый дизайн — docs/section-system.md, раздел 7.
 */
const variants: VariantMap<
  FeaturesSection,
  NonNullable<FeaturesSection["variant"]>
> = {
  table: Table,
  cards: Cards,
  bento: Bento,
  "sticky-split": StickySplit,
  alternating: Alternating,
  compact: Compact,
};

/**
 * Раскладки, которые не умеют показывать photo и потому форсируются в
 * cards, если фото задано. alternating сюда НЕ входит — она построена
 * вокруг фото. bento и cards держат каждый item в Card, туда фото
 * встаёт само.
 */
const GRID_ONLY: NonNullable<FeaturesSection["variant"]>[] = [
  "table",
  "sticky-split",
  "compact",
];

export function Features(props: FeaturesSection) {
  const variant = props.variant ?? "table";
  const hasPhoto = props.items.some((item) => item.photo);
  const needsForce = hasPhoto && GRID_ONLY.includes(variant);

  if (process.env.NODE_ENV !== "production" && needsForce) {
    console.warn(
      `[Features] Секция "${props.id}": variant="${variant}" не поддерживает photo — форсирован variant="cards".`,
    );
  }

  const Variant = needsForce ? Cards : (variants[variant] ?? Table);
  return <Variant {...props} />;
}

export default Features;
