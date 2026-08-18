import { Steps } from "@/components/sections/Steps";
import { siteConfig } from "@/content/site.config";
import type { StepsSection } from "@/types/site";
import { QaBlock } from "../_lib";

const base = siteConfig.sections.find(
  (s): s is StepsSection => s.type === "steps",
)!;

const variants: NonNullable<StepsSection["variant"]>[] = [
  "rail",
  "stack",
  "timeline-vertical",
  "cards",
  "cascade",
  "timeline-horizontal",
  "split",
  "numbered-cards",
  "sticky-split",
  "editorial",
  "product",
  "atelier",
];

export default function QaStepsPage() {
  return (
    <main>
      {variants.map((variant) => (
        <QaBlock key={variant} label={`Steps / variant="${variant}"`}>
          <Steps
            {...base}
            id={`steps-${variant}`}
            variant={variant}
            iconShape={base.iconShape ?? siteConfig.theme.iconShape}
          />
        </QaBlock>
      ))}
    </main>
  );
}
