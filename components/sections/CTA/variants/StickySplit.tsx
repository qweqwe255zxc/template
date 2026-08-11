import { ActionGroup } from "@/components/ui/ActionGroup";
import { Section } from "@/components/ui/Section";
import { StickySplit as SplitLayout } from "@/components/ui/StickySplit";
import { CtaEyebrow } from "../parts/CtaEyebrow";
import type { CtaSection } from "@/types/site";

/**
 * Призыв на оси 4/8 — парный вариант к `sticky-split` остальных секций,
 * чтобы страница, собранная этим приёмом, и заканчивалась на той же
 * вертикали.
 *
 * БЕЗ залипания: блок короче экрана, липнуть не к чему. От `band`
 * отличается именно осью — там 7/5 с заголовком в широкой колонке, тут
 * 4/8, как у всех соседей. Разница в пропорции заметна ровно тогда,
 * когда секции стоят подряд: заголовки всех разделов встают на одну
 * линию, включая последний.
 */
export function StickySplit(props: CtaSection) {
  const { id, surface = "accent", eyebrow, title, lead, actions = [], note } = props;

  return (
    <Section id={id} surface={surface} spacing="lg">
      <SplitLayout
        sticky={false}
        title={title}
        aside={eyebrow ? <CtaEyebrow eyebrow={eyebrow} variant="dot" /> : undefined}
      >
        {lead ? (
          <p className="max-w-[56ch] text-lead text-fg-muted" data-reveal>
            {lead}
          </p>
        ) : null}

        <ActionGroup actions={actions} align="start" className="mt-9" />

        {note ? <p className="mt-6 max-w-[62ch] text-small text-fg-muted">{note}</p> : null}
      </SplitLayout>
    </Section>
  );
}

export default StickySplit;
