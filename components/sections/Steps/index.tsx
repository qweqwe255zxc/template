import { Cards } from "./variants/Cards";
import { Cascade } from "./variants/Cascade";
import { NumberedCards } from "./variants/NumberedCards";
import { Rail } from "./variants/Rail";
import { Split } from "./variants/Split";
import { Stack } from "./variants/Stack";
import { TimelineHorizontal } from "./variants/TimelineHorizontal";
import { TimelineVertical } from "./variants/TimelineVertical";
import { StickySplit } from "./variants/StickySplit";
import type { VariantMap } from "../variantMap";
import type { StepsSection } from "@/types/site";

/**
 * Роутер секции Steps.
 * Как добавить новый дизайн — docs/section-system.md, раздел 7.
 */
const variants: VariantMap<
  StepsSection,
  NonNullable<StepsSection["variant"]>
> = {
  rail: Rail,
  stack: Stack,
  "timeline-vertical": TimelineVertical,
  cards: Cards,
  cascade: Cascade,
  "timeline-horizontal": TimelineHorizontal,
  split: Split,
  "numbered-cards": NumberedCards,
  "sticky-split": StickySplit,
};

export function Steps(props: StepsSection) {
  const requested = props.variant ?? "rail";
  const missingImage = requested === "split" && !props.image;

  if (process.env.NODE_ENV !== "production" && missingImage) {
    console.warn(
      `[Steps] Секция "${props.id}": variant="split" без image — фото занять нечем, ` +
        `показан "rail". Дайте image: "/images/..." или возьмите другой variant. ` +
        `См. docs/section-system.md.`,
    );
  }

  // Раньше при отсутствии image Split.tsx рендерил null — раздел молча
  // исчезал со страницы вместо того, чтобы показать хоть что-то. Тот же
  // принцип отката, что у Hero.resolveHeroLayout: несовместимая комбинация
  // полей не должна давать пустой блок, только предупреждение в dev.
  const resolved = missingImage ? "rail" : requested;
  const Variant = variants[resolved] ?? Rail;
  return <Variant {...props} />;
}

export default Steps;
