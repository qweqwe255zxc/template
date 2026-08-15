import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { EditorialHeader } from "@/components/ui/EditorialHeader";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import { PlanContent } from "../parts/PlanContent";
import { pricingGridLayout } from "../pricingGrid";
import type { PricingSection } from "@/types/site";

const GRID_BREAKPOINTS = [{ prefix: "md:", cols: 3 }] as const;

/**
 * Тарифы семейства `editorial`: карточки в рамке, но шапка карточки
 * набрана как колонтитул раздела — индекс тарифа капителью слева,
 * `plan.badge` («Чаще всего») плашкой справа, и уже под этой строкой
 * название тарифа. Тот же ярус, что у `EditorialHeader`, только внутри
 * карточки: за счёт него сетка тарифов читается продолжением страницы,
 * а не вставным блоком с другой типографикой.
 *
 * Индекс — позиционный («01», «02»), не `plan.tag`: тег остаётся у
 * `PlanContent` (`showTag`) и стоит над названием, как во всех
 * остальных карточных вариантах. Два разных лейбла в одном ярусе
 * спорили бы за место.
 *
 * `Card variant="framed"`, а не голая рамка, — сознательно. Глубину в
 * шаблоне решает тариф, а не вариант (docs/section-system.md, раздел 7):
 * в «Экономе» framed и есть тот самый волосяной прямоугольник исходного
 * приёма, в «Стандарте» карточка получит радиус и тень — и это
 * нормально, раскладка отвечает за строй, а не за пластику.
 *
 * Выделенный тариф подсвечивается `ui-card--featured` (токен
 * `--card-featured-border`), как и в остальных карточных вариантах, —
 * своей заливки у него тут нет: на бумажной поверхности вторая
 * поверхность внутри рамки читается как грязь, а не как акцент.
 *
 * Цена — `text-h2`, не `text-stat`: в колонке ~300px крупная ступень
 * рвёт «9 200 ₽ / м²» по единице измерения на вторую строку и перебивает
 * собственное название тарифа (та же причина, что у `cards` —
 * см. PlanContent).
 */
export function Editorial(props: PricingSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    items,
    note,
  } = props;

  const { containerClass, spanClasses } = pricingGridLayout(
    items.length,
    GRID_BREAKPOINTS,
  );

  return (
    <Section id={id} surface={surface}>
      <Container>
        <EditorialHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
        />

        <div className={cn("mt-14 grid gap-gutter md:mt-20", containerClass)}>
          {items.map((plan, index) => (
            <div
              key={plan.name}
              data-reveal
              style={revealDelay(index)}
              className={spanClasses[index]}
            >
              <Card
                variant="framed"
                className={cn(
                  "flex h-full flex-col",
                  plan.featured && "ui-card--featured",
                )}
              >
                {/* min-h не нужен: плашка есть не у всех тарифов, но
                    строка всё равно занимает высоту своего индекса —
                    капитель и плашка сидят на одной базовой линии, и
                    названия тарифов в ряду начинаются на одном уровне. */}
                <div className="mb-6 flex items-baseline justify-between gap-4">
                  <span className="tabular text-caption font-medium uppercase text-fg-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {plan.badge ? (
                    <Badge variant="soft" className="shrink-0 uppercase">
                      {plan.badge}
                    </Badge>
                  ) : null}
                </div>

                <PlanContent
                  plan={plan}
                  priceClassName="text-h2"
                  showTag
                  checkIcon={false}
                />
              </Card>
            </div>
          ))}
        </div>

        {note ? (
          <p className="mt-10 max-w-[62ch] text-caption font-medium uppercase text-fg-muted">
            {note}
          </p>
        ) : null}
      </Container>
    </Section>
  );
}

export default Editorial;
