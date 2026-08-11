import { ActionGroup } from "@/components/ui/ActionGroup";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CtaEyebrow } from "../parts/CtaEyebrow";
import type { CtaSection } from "@/types/site";

/**
 * Всё по левому краю в одну колонку: эйброу точкой, заголовок, лид,
 * кнопки строкой под ним. Без второй колонки под actions — для страниц,
 * где призыв ближе к обычному текстовому блоку, чем к афише.
 */
export function Left(props: CtaSection) {
  const { id, surface = "accent", eyebrow, title, lead, actions = [], note } = props;

  return (
    <Section id={id} surface={surface} spacing="lg">
      <Container>
        {/* max-w-[52rem]: у 42rem три action (кнопка+кнопка+текстовая
            ссылка) не помещались в строку и ссылка переносилась под низ —
            заголовку и лиду это ширины не убавляет, у них свой max-w. */}
        <div className="max-w-[52rem]">
          <CtaEyebrow eyebrow={eyebrow} variant="dot" />

          {title ? (
            <h2 className={`max-w-[18ch] font-heading text-h1 ${eyebrow ? "mt-4" : ""}`} data-reveal>
              {title}
            </h2>
          ) : null}

          {lead ? (
            <p className="mt-5 max-w-[48ch] text-lead text-fg-muted" data-reveal>
              {lead}
            </p>
          ) : null}

          {/* items-baseline: variant="quiet" — текстовая ссылка без своего
              бокса (h-auto), рядом с обычными кнопками (h-12) центр по
              боксу держал её заметно выше подписи кнопок. */}
          <ActionGroup actions={actions} align="start" className="mt-8" />

          {note ? <p className="mt-5 text-small text-fg-muted">{note}</p> : null}
        </div>
      </Container>
    </Section>
  );
}

export default Left;
