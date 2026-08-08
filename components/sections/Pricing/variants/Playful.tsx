import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getIcon } from "@/lib/icons";
import { revealDelay } from "@/lib/reveal";
import { cn } from "@/lib/cn";
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
 * Иконка-аватар над названием каждого тарифа (`plan.icon`), выделенный
 * тариф — сплошная поверхность accent вместо рамки. Референс использует
 * скруглённые-в-таблетку кнопки — не повторяем (радиус кнопки держит
 * роль тарифа, не конкретный дизайн). Строку с логотипами-плейсхолдерами
 * под сеткой не показываем — это фейковый декор без реальных данных;
 * `trust` — только текстовая подпись, как в Hero/Testimonials.
 */
export function Playful(props: PricingSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    items,
    note,
    trust,
    footnotes = [],
    closing,
    quote,
    comparison,
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
                data-surface={plan.featured ? "accent" : undefined}
                className={cn(plan.featured && "rounded-card bg-bg text-fg", spanClasses[index])}
                data-reveal
                style={revealDelay(index)}
              >
                <Card
                  variant={plan.featured ? "elevated" : "framed"}
                  className="relative flex h-full flex-col"
                >
                  {plan.badge ? (
                    <Badge variant="soft" className="absolute right-7 top-7 uppercase">
                      {plan.badge}
                    </Badge>
                  ) : null}
                  {Icon ? (
                    <span className="icon-tile mb-5 inline-flex">
                      <Icon aria-hidden="true" strokeWidth={1.5} className="size-5" />
                    </span>
                  ) : null}
                  <PlanContent plan={plan} priceClassName="text-h2" checkIcon />
                </Card>
              </div>
            );
          })}
        </div>

        {trust ? (
          <p className="mt-12 text-center text-small text-fg-muted md:mt-16">{trust}</p>
        ) : null}
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

export default Playful;
