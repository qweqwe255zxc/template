import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
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
 * Лейбл `tag` в каждой карточке, выделенный тариф — поверхность accent
 * (как у Split/Dark/Playful) с лёгким белым бликом поверх, вместо
 * буквального радужного градиента референса: цвет карточки остаётся
 * ролью тарифа, а не хардкодом конкретных оттенков.
 */
export function Glass(props: PricingSection) {
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
              data-surface={plan.featured ? "accent" : undefined}
              className={cn(plan.featured && "rounded-card bg-bg text-fg", spanClasses[index])}
              data-reveal
              style={revealDelay(index)}
            >
              {/* Плашка — внутри Card (не после), чтобы двигаться вместе с
                  ним на hover-подъёме. Блик рисует отдельный вложенный слой
                  с overflow-hidden, сам Card остаётся overflow-visible. */}
              <Card
                variant={plan.featured ? "elevated" : "framed"}
                className="relative flex h-full flex-col overflow-visible"
              >
                {plan.featured ? (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 overflow-hidden rounded-card bg-gradient-to-br from-white/25 via-transparent to-black/10"
                  />
                ) : null}
                {/* solid, а не soft: плашка приподнята над краем карточки и
                    наполовину лежит на фоне секции — полупрозрачная подложка
                    на светлом фоне секции читалась как «обрезанная»/пропадала. */}
                {plan.badge ? (
                  <Badge
                    variant="solid"
                    className="absolute -top-3 left-1/2 -translate-x-1/2 uppercase"
                  >
                    {plan.badge}
                  </Badge>
                ) : null}
                <div className="relative flex flex-1 flex-col">
                  <PlanContent plan={plan} priceClassName="text-h2" checkIcon showTag />
                </div>
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

        {closing ? <PricingClosing closing={closing} className="mt-14 md:mt-20" /> : null}
      </Container>
    </Section>
  );
}

export default Glass;
