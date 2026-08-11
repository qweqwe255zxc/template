import { ActionGroup } from "@/components/ui/ActionGroup";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CtaEyebrow } from "../parts/CtaEyebrow";
import type { CtaSection } from "@/types/site";

/**
 * Контент в приподнятой карточке (Card variant="elevated") поверх
 * акцентной заливки секции — на своей поверхности карточка чуть темнее
 * фона (--surface-card в [data-surface="accent"]), поэтому читается как
 * отдельный, физический блок, а не просто ещё один абзац на цвете.
 */
export function Boxed(props: CtaSection) {
  const { id, surface = "accent", eyebrow, title, lead, actions = [], note } = props;

  return (
    <Section id={id} surface={surface} spacing="lg">
      <Container>
        <Card variant="elevated" className="mx-auto max-w-[56rem] text-center">
          <CtaEyebrow eyebrow={eyebrow} variant="badge" className="flex justify-center" />

          {/* mx-auto — см. тот же комментарий в CTA/Centered: без него
              бокс заголовка (max-width из --title-max-width) прижат влево,
              и заголовок стоит не по центру карточки. */}
          {title ? (
            <h2
              className={`mx-auto font-heading section-title ${eyebrow ? "mt-4" : ""}`}
              data-reveal
            >
              {title}
            </h2>
          ) : null}

          {lead ? (
            <p className="mx-auto mt-5 max-w-[46ch] text-lead text-fg-muted" data-reveal>
              {lead}
            </p>
          ) : null}

          <ActionGroup actions={actions} align="center" className="mt-9" />

          {note ? <p className="mt-5 text-small text-fg-muted">{note}</p> : null}
        </Card>
      </Container>
    </Section>
  );
}

export default Boxed;
