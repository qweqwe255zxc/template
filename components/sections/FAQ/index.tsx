import { Categorized } from "./variants/Categorized";
import { Narrow } from "./variants/Narrow";
import { SplitSidebar } from "./variants/SplitSidebar";
import { Wide } from "./variants/Wide";
import { StickySplit } from "./variants/StickySplit";
import type { VariantMap } from "../variantMap";
import type { FaqSection } from "@/types/site";

/**
 * Роутер секции FAQ.
 * Как добавить новый дизайн — docs/section-system.md, раздел 7.
 */
const variants: VariantMap<FaqSection, NonNullable<FaqSection["variant"]>> = {
    narrow: Narrow,
    wide: Wide,
    "split-sidebar": SplitSidebar,
    categorized: Categorized,
  "sticky-split": StickySplit,
};

export function FAQ(props: FaqSection) {
    const Variant = variants[props.variant ?? "narrow"] ?? Narrow;
    return <Variant {...props} />;
}

export default FAQ;
