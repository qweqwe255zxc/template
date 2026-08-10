import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
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
 * Простые карточки (выделенная — просто elevated, без смены поверхности),
 * плавающая пилюля `plan.badge` над верхним краем. Под тарифами — тёмный
 * баннер `closing` с заголовком и кнопками (surface по умолчанию "ink" —
 * фирменная черта именно этого варианта, PricingClosing сам по себе
 * без явного surface рисует другую, более простую оправу).
 */
export function Banner(props: PricingSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    items,
    note,
    closing,
    footnotes = [],
    quote,
    comparison,
    headerAlign,
    fillLastRow = true,
  } = props;
  const { containerClass, spanClasses: computedSpanClasses } = pricingGridLayout(
    items.length,
    GRID_BREAKPOINTS,
  );
  const spanClasses = fillLastRow ? computedSpanClasses : [];

  return (
    <Section id={id} surface={surface}>
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
          {items.map((plan, index) => (
            <div
              key={plan.name}
              data-reveal
              style={revealDelay(index)}
              className={spanClasses[index] || undefined}
            >
              {/* Плашка — внутри Card, не соседним элементом: hover-подъём
                  задаёт transform самому Card, и абсолютно спозиционированный
                  ребёнок переезжает вместе с ним. Снаружи плашка оставалась
                  бы на месте, пока карточка визуально приподнимается. */}
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
                <PlanContent plan={plan} priceClassName="text-h2" />
              </Card>
            </div>
          ))}
        </div>

        {note ? <p className="mt-10 max-w-[62ch] text-small text-fg-muted">{note}</p> : null}

        {footnotes.length > 0 ? (
          <PricingFootnotes items={footnotes} className="mt-12 md:mt-16" />
        ) : null}

        {quote ? <PricingQuoteBlock quote={quote} className="mt-14 md:mt-20" /> : null}

        {comparison ? (
          <PricingComparisonTable comparison={comparison} className="mt-14 md:mt-20" />
        ) : null}

        {closing ? (
          <PricingClosing
            closing={{ ...closing, surface: closing.surface ?? "ink" }}
            className="mt-14 md:mt-20"
          />
        ) : null}
      </Container>
    </Section>
  );
}

export default Banner;
