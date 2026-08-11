import { Section } from "@/components/ui/Section";
import { StickySplit as SplitLayout } from "@/components/ui/StickySplit";
import { revealDelay } from "@/lib/reveal";
import { MemberContent } from "../parts/MemberContent";
import type { TeamSection } from "@/types/site";

/**
 * Команда сеткой справа от залипающего заголовка — член семейства
 * `sticky-split` (общая ось 4/8, см. `ui/StickySplit`).
 *
 * Две колонки на sm и три на xl, а не четыре: правая колонка тут 8/12,
 * и четвёртый человек в ряду сжимал бы карточку до ~200px — портрет
 * 3/4 в такой ширине превращается в марку, а фамилия с ролью уезжают в
 * три строки.
 */
export function StickySplit(props: TeamSection) {
  const { id, surface = "paper", number, eyebrow, title, lead, items } = props;

  return (
    <Section id={id} surface={surface}>
      <SplitLayout number={number} eyebrow={eyebrow} title={title} lead={lead}>
        <ul className="grid gap-x-gutter gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((member, index) => (
            <li key={member.name} data-reveal style={revealDelay(index)}>
              <MemberContent member={member} />
            </li>
          ))}
        </ul>
      </SplitLayout>
    </Section>
  );
}

export default StickySplit;
