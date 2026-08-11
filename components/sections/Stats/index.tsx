import { Band } from "./variants/Band";
import { Badge } from "./variants/Badge";
import { Bento } from "./variants/Bento";
import { Grid } from "./variants/Grid";
import { Photo } from "./variants/Photo";
import { Plain } from "./variants/Plain";
import { Rows } from "./variants/Rows";
import { StickySplit } from "./variants/StickySplit";
import type { VariantMap } from "../variantMap";
import type { StatsSection } from "@/types/site";

/**
 * Роутер секции Stats.
 *
 * У этой секции две независимые оси: variant (раскладка цифр — сюда) и
 * containerVariant (подложка под ними — parts/container.ts, читают
 * только band/grid). Роутер выбирает только первую; подложку band/grid
 * собирают сами из общего хелпера.
 *
 * Как добавить новый дизайн — docs/section-system.md, раздел 7.
 */
const variants: VariantMap<
  StatsSection,
  NonNullable<StatsSection["variant"]>
> = {
  band: Band,
  grid: Grid,
  badge: Badge,
  rows: Rows,
  bento: Bento,
  photo: Photo,
  plain: Plain,
  "sticky-split": StickySplit,
};

export function Stats(props: StatsSection) {
  const requested = props.variant ?? "band";
  const missingImage = requested === "photo" && !props.image;

  if (process.env.NODE_ENV !== "production" && missingImage) {
    console.warn(
      `[Stats] Секция "${props.id}": variant="photo" без image — фото занять нечем, ` +
        `показан "band". Дайте image: "/images/..." или возьмите другой variant. ` +
        `См. docs/section-system.md.`,
    );
  }

  // Тот же откат, что у Hero.resolveHeroLayout: несовместимая комбинация
  // полей не должна оставлять пустой блок вместо секции, только
  // предупреждение в dev.
  const resolved = missingImage ? "band" : requested;
  const Variant = variants[resolved] ?? Band;
  return <Variant {...props} />;
}

export default Stats;
