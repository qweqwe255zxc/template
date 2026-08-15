import { Panel } from "./variants/Panel";
import { Photo } from "./variants/Photo";
import { QuietSplit } from "./variants/QuietSplit";
import { SplitActions } from "./variants/SplitActions";
import { TypeOnly } from "./variants/TypeOnly";
import { StickySplit } from "./variants/StickySplit";
import type { VariantMap } from "../variantMap";
import type { AboutSection } from "@/types/site";

/**
 * Роутер секции About («о нас» / «о месте»).
 * Как добавить новый дизайн — docs/section-system.md, раздел 7.
 */
/* --------------------------------------------------------------------------
   ТАРИФНАЯ ПОМЕТКА (временная, поставлена при переносе лендинга
   Sirotov Architects).

   ЭКОНОМ-КЛАСС — весь каталог вариантов этой секции: photo, type-only, split-actions, quiet-split, panel, sticky-split.

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
  AboutSection,
  NonNullable<AboutSection["variant"]>
> = {
  // Эконом-класс
  photo: Photo,
  "type-only": TypeOnly,
  "split-actions": SplitActions,
  "quiet-split": QuietSplit,
  panel: Panel,
  "sticky-split": StickySplit,
};

const PHOTO_REQUIRED_VARIANTS = new Set(["photo", "split-actions", "quiet-split", "panel"]);

export function About(props: AboutSection) {
  const requested = props.variant ?? "photo";
  const needsPhoto = PHOTO_REQUIRED_VARIANTS.has(requested) && !props.photo;

  if (process.env.NODE_ENV !== "production" && needsPhoto) {
    console.warn(
      `[About] Секция "${props.id}": variant="${requested}" без photo — фото занять нечем, ` +
        `показан "type-only". Дайте photo: "/images/..." или возьмите другой variant. ` +
        `См. docs/section-system.md.`,
    );
  }

  const resolved = needsPhoto ? "type-only" : requested;
  const Variant = variants[resolved] ?? Photo;
  return <Variant {...props} />;
}

export default About;
