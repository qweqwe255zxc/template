import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getIcon } from "@/lib/icons";
import { revealDelay } from "@/lib/reveal";
import { bentoSpan } from "@/lib/bentoSpan";
import { cn } from "@/lib/cn";
import { StatsHeader } from "../parts/StatsHeader";
import type { StatsSection } from "@/types/site";

/**
 * Заголовок пилюлей по центру, дальше — двухколоночная сетка. Оправу
 * карточки решает `item.highlight` ("accent" — рамка, "tint" — мягкая
 * тонировка фона `bg-fg/6%`, темнее в светлой теме/светлее в тёмной —
 * не полная инверсия поверхности, она читалась как сломанная чёрная
 * карточка), остальные — обычная `framed`. Без явного highlight ни у
 * одного item — дефолт только для первой карточки (accent); последняя
 * не получает tint по умолчанию, чтобы не выглядеть как случайно
 * выбитая карточка с другим фоном.
 * Ширина карточек — `lib/bentoSpan.ts`: растягивается на 2 слота только
 * там, где это ровно закрывает ряд, не там, где "ещё есть место".
 */
export function Bento(props: StatsSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    items,
    iconShape,
    fillLastRow = true,
  } = props;

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <Container>
        <StatsHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          className="mb-12 md:mb-16"
        />

        <dl className="grid gap-6 md:grid-cols-2">
          {items.map((item, index) => {
            const Icon = getIcon(item.icon);
            // Явный item.highlight всегда главнее позиции. Без него —
            // дефолт только для первой карточки (accent); остальные,
            // включая последнюю, остаются обычными framed.
            const highlight = item.highlight ?? (index === 0 ? "accent" : undefined);

            return (
              <Card
                key={item.label}
                variant={highlight === "accent" ? "bordered-accent" : "framed"}
                data-reveal
                style={revealDelay(index)}
                // Раньше тут был полный инверт (data-surface="ink"):
                // на светлой теме давал чисто чёрную карточку, читалось
                // как сломанный контраст, а не «акцентный» бокс. Мягкий
                // тонированный фон вместо инверсии — темнее в светлой
                // теме, светлее в тёмной, но не противоположный цвет.
                className={cn(
                  highlight === "tint" && "bg-fg/[0.06]",
                  fillLastRow && bentoSpan(index, items.length, { md: 2 }),
                )}
              >
                {Icon ? (
                  <span className="icon-tile">
                    <Icon aria-hidden="true" strokeWidth={1.5} className="size-6" />
                  </span>
                ) : null}

                <dt className="tabular mt-4 font-display text-h2">
                  {item.value}
                  {item.suffix ? <span className="text-fg-muted">{item.suffix}</span> : null}
                </dt>

                {item.text ? (
                  // text заменяет label (см. docs/section-system.md, §2.2) —
                  // dd, а не p: dt без пары dd — невалидный dl.
                  <dd className="mt-3 measure text-small text-fg-muted">{item.text}</dd>
                ) : (
                  <dd className="mt-3 text-caption font-medium uppercase text-fg-muted">
                    {item.label}
                  </dd>
                )}
              </Card>
            );
          })}
        </dl>
      </Container>
    </Section>
  );
}

export default Bento;
