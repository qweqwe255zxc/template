import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { revealDelay } from "@/lib/reveal";
import { ASPECT_PAIR_3_4, fillLastRowAspectClasses, fillLastRowClasses } from "@/lib/gridFill";
import { cn } from "@/lib/cn";
import { MemberContent } from "../parts/MemberContent";
import { TeamBannerBlock } from "../parts/TeamBannerBlock";
import type { TeamSection } from "@/types/site";

const GRID_BREAKPOINTS = [
  { prefix: "sm:", cols: 2 },
  { prefix: "lg:", cols: 3 },
  { prefix: "xl:", cols: 4 },
] as const;

/**
 * Та же сетка, что у photo-cards/badge-avatars/tags-cards (sm:2 → lg:3 →
 * xl:4 — промежуточная ступень на 768px обязательна, иначе на планшете
 * сетка прыгает сразу в 3 колонки и последний неполный ряд растягивается
 * непропорционально), каждый человек в Card variant="framed". Вариант по
 * умолчанию в «Стандарте»: единственная раскладка команды, где есть
 * объект, способный принять глубину тарифа.
 */
export function Cards(props: TeamSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    items,
    banner,
    fillLastRow = true,
  } = props;
  const spanClasses = fillLastRow ? fillLastRowClasses(items.length, GRID_BREAKPOINTS) : [];
  const aspectClasses = fillLastRow
    ? fillLastRowAspectClasses(items.length, GRID_BREAKPOINTS, ASPECT_PAIR_3_4)
    : [];

  return (
    <Section id={id} surface={surface}>
      <Container>
        <SectionHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
        />

        <ul className="mt-14 grid gap-gutter sm:grid-cols-2 md:mt-20 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((member, index) => (
            <li key={member.name} className={cn(spanClasses[index])}>
              <Card variant="framed" className="flex h-full flex-col">
                <div
                  className="flex flex-1 flex-col"
                  data-reveal
                  style={revealDelay(index)}
                >
                  <MemberContent
                    member={member}
                    mediaAspectClassName={aspectClasses[index]}
                  />
                </div>
              </Card>
            </li>
          ))}
        </ul>

        {banner ? (
          <TeamBannerBlock banner={banner} tone={banner.tone ?? "soft"} className="mt-12 md:mt-16" />
        ) : null}
      </Container>
    </Section>
  );
}

export default Cards;
