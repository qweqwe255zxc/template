import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ASPECT_PAIR_4_3, fillLastRowAspectClasses } from "@/lib/gridFill";
import { revealDelay } from "@/lib/reveal";
import { cn } from "@/lib/cn";
import { PlanContent } from "../parts/PlanContent";
import { PricingClosing } from "../parts/PricingClosing";
import { PricingComparisonTable } from "../parts/PricingComparisonTable";
import { PricingFootnotes } from "../parts/PricingFootnotes";
import { PricingQuoteBlock } from "../parts/PricingQuoteBlock";
import { pricingGridLayout } from "../pricingGrid";
import type { PricingSection } from "@/types/site";

const GRID_BREAKPOINTS = [
  { prefix: "sm:", cols: 2 },
  { prefix: "lg:", cols: 3 },
] as const;

/**
 * Тарифы карточками. Вариант по умолчанию в «Стандарте» и единственный,
 * который поддерживает photo на планах.
 *
 * Выделенный тариф получает ui-card--featured: рамку
 * --card-featured-border и усиленную тень --card-featured-shadow.
 * В «Экономе» это по-прежнему просто линия --color-fg без тени.
 *
 * Цена идёт ступенью `text-h2`, а не `text-stat`: 60px рассчитаны на
 * широкую колонку табличной раскладки, а в карточке (~300px содержимого)
 * они ломали цену на две строки. Кнопка тарифа прижата к низу карточки
 * (`mt-auto` в PlanContent) — списки возможностей у планов разной длины,
 * а кнопки обязаны стоять на одной линии.
 */
export function Cards(props: PricingSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    items,
    note,
    footnotes = [],
    closing,
    quote,
    comparison,
    fillLastRow = true,
  } = props;
  const {
    containerClass,
    spanClasses: computedSpanClasses,
    breakpoints,
  } = pricingGridLayout(items.length, GRID_BREAKPOINTS);
  const spanClasses = fillLastRow ? computedSpanClasses : [];
  const aspectClasses = fillLastRow
    ? fillLastRowAspectClasses(items.length, breakpoints, ASPECT_PAIR_4_3)
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

        <div className={cn("mt-14 grid md:mt-20", "gap-gutter", containerClass)}>
          {items.map((plan, index) => (
            <Card
              key={plan.name}
              variant="framed"
              className={cn(
                "flex h-full flex-col",
                plan.featured && "ui-card--featured",
                spanClasses[index],
              )}
            >
              <div
                className="flex flex-1 flex-col"
                data-reveal
                style={revealDelay(index)}
              >
                <PlanContent
                  plan={plan}
                  priceClassName="text-h2"
                  mediaAspectClassName={aspectClasses[index]}
                />
              </div>
            </Card>
          ))}
        </div>

        {note ? (
          <p className="mt-10 max-w-[62ch] text-small text-fg-muted">{note}</p>
        ) : null}

        {footnotes.length > 0 ? (
          <PricingFootnotes items={footnotes} className="mt-12 md:mt-16" />
        ) : null}

        {quote ? <PricingQuoteBlock quote={quote} className="mt-14 md:mt-20" /> : null}

        {comparison ? (
          <PricingComparisonTable comparison={comparison} className="mt-14 md:mt-20" />
        ) : null}

        {closing ? <PricingClosing closing={closing} className="mt-14 md:mt-20" /> : null}
      </Container>
    </Section>
  );
}

export default Cards;
