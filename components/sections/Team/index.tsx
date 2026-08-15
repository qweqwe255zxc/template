import { BadgeAvatars } from "./variants/BadgeAvatars";
import { Bento } from "./variants/Bento";
import { Cards } from "./variants/Cards";
import { Columns } from "./variants/Columns";
import { PhotoCards } from "./variants/PhotoCards";
import { Rows } from "./variants/Rows";
import { TagsCards } from "./variants/TagsCards";
import { StickySplit } from "./variants/StickySplit";
import type { VariantMap } from "../variantMap";
import type { TeamSection } from "@/types/site";

/**
 * Роутер секции Team.
 * Как добавить новый дизайн — docs/section-system.md, раздел 7.
 */
/* --------------------------------------------------------------------------
   ТАРИФНАЯ ПОМЕТКА (временная, поставлена при переносе лендинга
   Sirotov Architects).

   ЭКОНОМ-КЛАСС — весь каталог вариантов этой секции: columns, rows, cards, photo-cards, badge-avatars, tags-cards, bento,
   sticky-split.

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
const variants: VariantMap<TeamSection, NonNullable<TeamSection["variant"]>> = {
  // Эконом-класс
  columns: Columns,
  rows: Rows,
  cards: Cards,
  "photo-cards": PhotoCards,
  "badge-avatars": BadgeAvatars,
  "tags-cards": TagsCards,
  bento: Bento,
  "sticky-split": StickySplit,
};

export function Team(props: TeamSection) {
  const Variant = variants[props.variant ?? "columns"] ?? Columns;
  return <Variant {...props} />;
}

export default Team;
