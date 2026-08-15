import { Bold } from "./variants/Bold";
import { Centered } from "./variants/Centered";
import { Classic } from "./variants/Classic";
import { Compact } from "./variants/Compact";
import { Default } from "./variants/Default";
import { Glass } from "./variants/Glass";
import { Monogram } from "./variants/Monogram";
import { Split } from "./variants/Split";
import type { VariantMap } from "../variantMap";
import type { HeaderProps } from "./types";
import type { HeaderVariant } from "@/types/site";

/**
 * Роутер хедера. Собственного поля variant у site.config.sections нет
 * (Header не проходит через SectionRenderer), ручка приходит из
 * siteConfig.header.variant — см. types/site.ts.
 *
 * Сам роутер серверный, клиентский только вариант: стейт меню и слушатель
 * скролла живут в variants/*.tsx и parts/useHeaderState.ts, поэтому
 * в клиентский бандл не уезжает ничего лишнего.
 *
 * Как добавить новый дизайн — docs/section-system.md, раздел 7.
 */
/* --------------------------------------------------------------------------
   ТАРИФНАЯ ПОМЕТКА (временная, поставлена при переносе лендинга
   Sirotov Architects).

   ЭКОНОМ-КЛАСС — весь каталог вариантов этой секции: default, bold, classic, compact, monogram, centered, glass, split.

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
const variants: VariantMap<HeaderProps, HeaderVariant> = {
  // Эконом-класс
  default: Default,
  bold: Bold,
  classic: Classic,
  compact: Compact,
  monogram: Monogram,
  centered: Centered,
  glass: Glass,
  split: Split,
};

export function Header(props: HeaderProps) {
  const Variant = variants[props.variant ?? "default"] ?? Default;
  return <Variant {...props} />;
}

export default Header;
