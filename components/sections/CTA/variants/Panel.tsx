import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CtaEyebrow } from "../parts/CtaEyebrow";
import type { CtaSection } from "@/types/site";

/**
 * Текст слева, справа — приподнятая карточка со списком actions на всю
 * ширину (full), каждое действие — своя строка, а не ряд кнопок. Для
 * призыва с несколькими равнозначными действиями (не «главное + тихая
 * ссылка», а несколько вариантов записи/связи).
 */
export function Panel(props: CtaSection) {
  const { id, surface = "accent", eyebrow, title, lead, actions = [], note } = props;

  return (
    <Section id={id} surface={surface} spacing="lg">
      <Container>
        <div className="grid gap-x-gutter gap-y-10 lg:grid-cols-12 lg:items-center">
          {/* lg, не md: у text-h1 (fluid до 64px) в паре с широким
              display-шрифтом слово вроде "Клонируйте" не помещается
              в 6/12-колонку уже на 768px — переносится посреди слова
              даже на дефолтном контенте. lg сдвигает сжатие до ширины,
              где это редкий крайний случай, а не типичный. 7/5, а не
              6/6 — тот же принцип, что у CtaBody (Band/Quiet): заголовку
              достаётся доля побольше. min-w-0: 12-колоночный grid по
              умолчанию не даёт ячейке сжаться уже её контента
              (min-width: auto у грид-элементов) — длинное слово в
              заголовке распирало колонку и наезжало на карточку с
              кнопками справа. break-words — подстраховка на случай,
              если слово всё равно не влезает. */}
          <div className="min-w-0 lg:col-span-7" data-reveal>
            <CtaEyebrow eyebrow={eyebrow} variant="dot" />

            {title ? (
              <h2 className={`max-w-[16ch] font-heading text-h1 break-words ${eyebrow ? "mt-4" : ""}`}>
                {title}
              </h2>
            ) : null}

            {lead ? (
              <p className="mt-5 max-w-[42ch] text-lead text-fg-muted">{lead}</p>
            ) : null}
          </div>

          {actions.length > 0 || note ? (
            <div className="lg:col-span-5" data-reveal>
              {actions.length > 0 ? (
                <Card variant="elevated" className="flex flex-col gap-4">
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      href={action.href}
                      variant={action.variant ?? "primary"}
                      full
                    >
                      {action.label}
                    </Button>
                  ))}
                </Card>
              ) : null}

              {note ? <p className="mt-4 text-small text-fg-muted">{note}</p> : null}
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}

export default Panel;
