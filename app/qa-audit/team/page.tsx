import { Team } from "@/components/sections/Team";
import { siteConfig } from "@/content/site.config";
import type { TeamSection } from "@/types/site";
import { QaBlock } from "../_lib";

const base = siteConfig.sections.find(
  (s): s is TeamSection => s.type === "team",
)!;

const variants: NonNullable<TeamSection["variant"]>[] = [
  "columns",
  "rows",
  "cards",
  "photo-cards",
  "badge-avatars",
  "tags-cards",
  "bento",
  "sticky-split",
  "editorial",
  "product",
];

export default function QaTeamPage() {
  return (
    <main>
      {variants.map((variant) => (
        <QaBlock key={variant} label={`Team / variant="${variant}"`}>
          <Team {...base} id={`team-${variant}`} variant={variant} />
        </QaBlock>
      ))}
    </main>
  );
}
