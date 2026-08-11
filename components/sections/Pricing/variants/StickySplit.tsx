import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { StickySplit as SplitLayout } from "@/components/ui/StickySplit";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import { PlanContent } from "../parts/PlanContent";
import { PricingClosing } from "../parts/PricingClosing";
import { PricingComparisonTable } from "../parts/PricingComparisonTable";
import { PricingFootnotes } from "../parts/PricingFootnotes";
import { PricingQuoteBlock } from "../parts/PricingQuoteBlock";
import type { PricingSection } from "@/types/site";

/**
 * Тарифы карточками справа от залипающего заголовка — член семейства
 * `sticky-split` (общая ось 4/8, см. `ui/StickySplit`).
 *
 * Максимум две карточки в ряд: правая колонка 8/12, и три тарифа в ней
 * дали бы по ~230px — цена, описание и чек-лист в такой ширине
 * рассыпаются. При трёх и более тарифах ряд переносится, и это
 * нормально: залипающий заголовок держит связь между рядами.
 *
 * Цена ступенью text-h2, как в карточных вариантах: text-stat здесь
 * ломал бы «от 90 000 ₽» на две строки.
 */
export function StickySplit(props: PricingSection) {
  const {
    id,
    surface = "surface",
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
  } = props;

  return (
    <Section id={id} surface={surface}>
      <SplitLayout number={number} eyebrow={eyebrow} title={title} lead={lead}>
        <div className="grid gap-gutter sm:grid-cols-2">
          {items.map((plan, index) => (
            <Card
              key={plan.name}
              variant={plan.featured ? "elevated" : "framed"}
              className={cn("flex h-full flex-col")}
              data-reveal
              style={revealDelay(index)}
            >
              <PlanContent plan={plan} priceClassName="text-h2" />
            </Card>
          ))}
        </div>

        {note ? <p className="mt-8 max-w-[62ch] text-small text-fg-muted">{note}</p> : null}

        {footnotes.length > 0 ? (
          <PricingFootnotes items={footnotes} className="mt-10" />
        ) : null}

        {quote ? <PricingQuoteBlock quote={quote} className="mt-12" /> : null}

        {comparison ? (
          <PricingComparisonTable comparison={comparison} className="mt-12" />
        ) : null}

        {closing ? <PricingClosing closing={closing} className="mt-12" /> : null}
      </SplitLayout>
    </Section>
  );
}

export default StickySplit;
