import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { getIcon } from "@/lib/icons";
import { revealDelay } from "@/lib/reveal";
import { PlanContent } from "../parts/PlanContent";
import { PricingClosing } from "../parts/PricingClosing";
import { PricingComparisonTable } from "../parts/PricingComparisonTable";
import { PricingFootnotes } from "../parts/PricingFootnotes";
import { PricingHeader } from "../parts/PricingHeader";
import { PricingQuoteBlock } from "../parts/PricingQuoteBlock";
import { pricingGridLayout } from "../pricingGrid";
import type { PricingSection } from "@/types/site";

const GRID_BREAKPOINTS = [{ prefix: "md:", cols: 3 }] as const;

/**
 * Простые карточки без чек-листа внутри (данные с пустым `features`),
 * `plan.icon` в плашке. Под тарифами — таблица сравнения `comparison`
 * (группы строк, галка/прочерк/текст на ячейку) и замыкающий блок
 * `closing` с фото и пунктами слева.
 */
export function Matrix(props: PricingSection) {
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
    quote,
    comparison,
    closing,
    iconShape,
    headerAlign,
    fillLastRow = true,
  } = props;
  const { containerClass, spanClasses: computedSpanClasses } = pricingGridLayout(
    items.length,
    GRID_BREAKPOINTS,
  );
  const spanClasses = fillLastRow ? computedSpanClasses : [];

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <Container>
        <PricingHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          align={headerAlign}
          className="mb-12 md:mb-16"
        />

        <div className={cn("grid gap-gutter", containerClass)}>
          {items.map((plan, index) => {
            const Icon = getIcon(plan.icon);
            return (
              <div
                key={plan.name}
                data-reveal
                style={revealDelay(index)}
                className={spanClasses[index] || undefined}
              >
                <Card
                  variant={plan.featured ? "elevated" : "framed"}
                  className="relative flex h-full flex-col overflow-visible"
                >
                  {plan.badge ? (
                    <Badge
                      variant="soft"
                      className="absolute -top-3 left-1/2 -translate-x-1/2 uppercase"
                    >
                      {plan.badge}
                    </Badge>
                  ) : null}
                  {Icon ? (
                    <span className="icon-tile mb-5 inline-flex">
                      <Icon aria-hidden="true" strokeWidth={1.5} className="size-5" />
                    </span>
                  ) : null}
                  <PlanContent plan={plan} priceClassName="text-h2" />
                </Card>
              </div>
            );
          })}
        </div>

        {note ? <p className="mt-10 max-w-[62ch] text-small text-fg-muted">{note}</p> : null}

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

export default Matrix;
