import { Banner } from "./variants/Banner";
import { Cards } from "./variants/Cards";
import { Dark } from "./variants/Dark";
import { Glass } from "./variants/Glass";
import { Matrix } from "./variants/Matrix";
import { Playful } from "./variants/Playful";
import { Quote } from "./variants/Quote";
import { Ribbon } from "./variants/Ribbon";
import { Split } from "./variants/Split";
import { Table } from "./variants/Table";
import { StickySplit } from "./variants/StickySplit";
import type { VariantMap } from "../variantMap";
import type { PricingSection } from "@/types/site";

/**
 * Роутер секции Pricing.
 *
 * Как и Features, роутер ФОРСИРУЕТ Cards, если хотя бы у одного плана
 * задан photo: табличная сетка с border-top/border-l не умеет выравнивать
 * фото произвольной высоты. См. docs/section-system.md, раздел 2.
 *
 * Как добавить новый дизайн — docs/section-system.md, раздел 7.
 */
const variants: VariantMap<
  PricingSection,
  NonNullable<PricingSection["variant"]>
> = {
  table: Table,
  cards: Cards,
  ribbon: Ribbon,
  split: Split,
  dark: Dark,
  playful: Playful,
  quote: Quote,
  glass: Glass,
  banner: Banner,
  matrix: Matrix,
  "sticky-split": StickySplit,
};

export function Pricing(props: PricingSection) {
  const variant = props.variant ?? "table";
  const hasPhoto = props.items.some((plan) => plan.photo);

  if (process.env.NODE_ENV !== "production" && hasPhoto && variant === "table") {
    console.warn(
      `[Pricing] Секция "${props.id}": variant="table" не поддерживает photo — форсирован variant="cards".`,
    );
  }

  const Variant = hasPhoto ? Cards : (variants[variant] ?? Table);
  return <Variant {...props} />;
}

export default Pricing;
