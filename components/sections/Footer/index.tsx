import { Bold } from "./variants/Bold";
import { Centered } from "./variants/Centered";
import { Classic } from "./variants/Classic";
import { Compact } from "./variants/Compact";
import { Default } from "./variants/Default";
import { Monogram } from "./variants/Monogram";
import { Split } from "./variants/Split";
import type { VariantMap } from "../variantMap";
import type { FooterProps } from "./types";
import type { FooterVariant } from "@/types/site";

/**
 * Роутер футера. Вариант — поле footer.variant (FooterConfig в
 * types/site.ts), а не отдельный проп: конфиг футера остаётся одним
 * объектом, как и остальные его поля (note, legal, links, columns...).
 *
 * Как добавить новый дизайн — docs/section-system.md, раздел 7.
 */
/* --------------------------------------------------------------------------
   ТАРИФНАЯ ПОМЕТКА (временная, поставлена при переносе лендинга
   Sirotov Architects).

   ЭКОНОМ-КЛАСС — весь каталог вариантов этой секции: default, bold, classic, compact, monogram, centered, split.

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
const variants: VariantMap<FooterProps, FooterVariant> = {
  // Эконом-класс
  default: Default,
  bold: Bold,
  classic: Classic,
  compact: Compact,
  monogram: Monogram,
  centered: Centered,
  split: Split,
};

export function Footer(props: FooterProps) {
  const Variant = variants[props.footer.variant ?? "default"] ?? Default;
  return <Variant {...props} />;
}

export default Footer;
