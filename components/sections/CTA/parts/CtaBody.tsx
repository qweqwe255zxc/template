import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { CtaSection } from "@/types/site";

/**
 * Содержимое CTA — общее для всех вариантов. Варианты отличаются только
 * вертикальным ритмом секции (spacing), а не раскладкой, поэтому разметка
 * живёт здесь одним куском, а не копируется по файлам вариантов.
 */
export function CtaBody({ title, lead, actions = [], note }: CtaSection) {
  return (
    <Container>
      <div className="grid gap-x-gutter gap-y-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7" data-reveal>
          {title ? (
            <h2 className="max-w-[18ch] font-heading section-title-scale">{title}</h2>
          ) : null}
          {lead ? (
            <p className="mt-6 max-w-[48ch] text-lead text-fg-muted">{lead}</p>
          ) : null}
        </div>

        {actions.length > 0 || note ? (
          <div className="md:col-span-5 md:justify-self-end" data-reveal>
            {actions.length > 0 ? (
              /* items-baseline, не items-center/stretch по умолчанию:
                 variant="quiet" — текстовая ссылка без паддингов (h-auto),
                 рядом с обычной кнопкой (h-12) центр по боксу вместо
                 текста ставил подпись ссылки заметно выше подписи кнопки. */
              <div className="flex flex-col flex-wrap gap-4 sm:flex-row sm:items-baseline md:justify-end">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    href={action.href}
                    variant={action.variant ?? "primary"}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            ) : null}
            {note ? (
              <p className="mt-5 text-small text-fg-muted md:text-right">
                {note}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </Container>
  );
}

export default CtaBody;
