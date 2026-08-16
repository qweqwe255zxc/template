import { Stats } from "@/components/sections/Stats";
import { siteConfig } from "@/content/site.config";
import type { StatsSection } from "@/types/site";
import { QaBlock } from "../_lib";

const base = siteConfig.sections.find(
  (s): s is StatsSection => s.type === "stats",
)!;

const variants: NonNullable<StatsSection["variant"]>[] = [
  "band",
  "grid",
  "badge",
  "rows",
  "bento",
  "photo",
  "plain",
  "sticky-split",
  "editorial",
  "product",
];

export default function QaStatsPage() {
  return (
    <main>
      {variants.map((variant) => (
        <QaBlock key={variant} label={`Stats / variant="${variant}"`}>
          <Stats
            {...base}
            id={`stats-${variant}`}
            variant={variant}
            containerVariant={
              variant === "band" || variant === "grid" ? "elevated" : undefined
            }
            iconShape={base.iconShape ?? siteConfig.theme.iconShape}
          />
        </QaBlock>
      ))}
    </main>
  );
}
