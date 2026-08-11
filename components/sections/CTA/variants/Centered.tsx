import { ActionGroup } from "@/components/ui/ActionGroup";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CtaEyebrow } from "../parts/CtaEyebrow";
import type { CtaSection } from "@/types/site";

/**
 * Эйброу пилюлей, заголовок и кнопки по центру — в одну колонку, а не
 * в две (title слева/actions справа), как у band/quiet. Для призыва,
 * который должен читаться афишей, а не строкой с кнопкой в углу.
 */
export function Centered(props: CtaSection) {
  const { id, surface = "accent", eyebrow, title, lead, actions = [], note } = props;

  return (
    <Section id={id} surface={surface} spacing="lg">
      <Container>
        <div className="mx-auto max-w-[46rem] text-center">
          <CtaEyebrow eyebrow={eyebrow} variant="badge" className="flex justify-center" />

          {/* mx-auto обязателен. .section-title задаёт max-width
              (--title-max-width) и margin-inline: 0, поэтому в text-center
              бокс заголовка прижимался к левому краю колонки, а по центру
              шёл только текст внутри него — эйброу и лид центрировались,
              а заголовок стоял левее их оси. */}
          {title ? (
            <h2
              className={`mx-auto font-heading section-title ${eyebrow ? "mt-4" : ""}`}
              data-reveal
            >
              {title}
            </h2>
          ) : null}

          {lead ? (
            <p className="mx-auto mt-5 max-w-[48ch] text-lead text-fg-muted" data-reveal>
              {lead}
            </p>
          ) : null}

          <ActionGroup actions={actions} align="center" className="mt-9" />

          {note ? <p className="mt-5 text-small text-fg-muted">{note}</p> : null}
        </div>
      </Container>
    </Section>
  );
}

export default Centered;
