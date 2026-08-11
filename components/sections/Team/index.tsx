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
const variants: VariantMap<TeamSection, NonNullable<TeamSection["variant"]>> = {
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
