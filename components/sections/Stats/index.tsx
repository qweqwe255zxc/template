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
/* --------------------------------------------------------------------------
   ТАРИФНАЯ ПОМЕТКА (временная, поставлена при переносе лендинга
   Sirotov Architects).

   ЭКОНОМ-КЛАСС — весь каталог вариантов этой секции: band, grid, badge, rows, bento, photo, plain, sticky-split.

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
const variants: VariantMap<
  StatsSection,
  NonNullable<StatsSection["variant"]>
> = {
  // Эконом-класс
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
