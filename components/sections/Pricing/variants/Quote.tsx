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

const GRID_BREAKPOINTS = [
  { prefix: "sm:", cols: 2 },
  { prefix: "lg:", cols: 3 },
] as const;

/**
 * Лейбл `tag` в каждой карточке, выделенный тариф — мягкая подложка
 * bg-badge-soft (не сплошной accent — референс использует именно
 * лёгкий тон) с плавающей пилюлей поверх верхнего края. Под тарифами —
 * цитата поверх фото (`quote`), тот же приём, что у Hero `overlay`.
 */
export function Quote(props: PricingSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    items,
    note,
    quote,
    footnotes = [],
    closing,
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
              className={cn("rounded-card", plan.featured && "bg-badge-soft", spanClasses[index])}
              data-reveal
              style={revealDelay(index)}
            >
              {/* featured — elevated, не plain: карточка «самого популярного»
                  тарифа должна выглядеть весомее соседей, а не буквально
                  бесплотной (plain — вообще без тени/рамки/фона от Card,
                  только мягкая подложка обёртки). Плашка — variant="solid"
                  (непрозрачная), а не soft: она приподнята над верхним краем
                  карточки и наполовину лежит на фоне секции — полупрозрачная
                  soft-плашка там, где фон светлый, читалась почти невидимой. */}
              <Card
                variant={plan.featured ? "elevated" : "framed"}
                className="relative flex h-full flex-col overflow-visible"
              >
                {plan.badge ? (
                  // max-w + truncate: плашка абсолютно спозиционирована от
                  // правого края (right-6) без ограничения слева — длинный
                  // текст (`plan.badge`) на узкой карточке мог вылезти за
                  // левую границу карточки, ничем не остановленный.
                  <Badge
                    variant="solid"
                    className="absolute -top-3 right-6 max-w-[calc(100%-3rem)] truncate uppercase"
                  >
                    {plan.badge}
                  </Badge>
                ) : null}
                <PlanContent plan={plan} priceClassName="text-h2" checkIcon showTag />
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

export default Quote;
