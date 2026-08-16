import { BadgeAvatars } from "./variants/BadgeAvatars";
import { Bento } from "./variants/Bento";
import { Cards } from "./variants/Cards";
import { Columns } from "./variants/Columns";
import { Editorial } from "./variants/Editorial";
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

   ЭКОНОМ-КЛАСС — весь каталог вариантов, существовавший ДО
   семейства `editorial`: columns, rows, cards, photo-cards, badge-avatars, tags-cards, bento,
   sticky-split.

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
  // Семейство editorial
  editorial: Editorial,
};

export function Team(props: TeamSection) {
  const Variant = variants[props.variant ?? "columns"] ?? Columns;
  return <Variant {...props} />;
}

export default Team;
