import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ProductHeader } from "@/components/ui/ProductHeader";
import { Section } from "@/components/ui/Section";
import { ASPECT_PAIR_4_3, fillLastRowAspectClasses } from "@/lib/gridFill";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
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
 * Тарифы семейства `product`: центрированная шапка, карточки с галками в
 * чек-листе, выделенный тариф — акцентной рамкой.
 *
 * Центрированная шапка (`ProductHeader align="center"`) — единственное
 * место семейства, где шапка не по левому краю, и это осознанно: под ней
 * идут три равные колонки цен, и левый заголовок над симметричной сеткой
 * читается как случайно сдвинутый. В исходном приёме блок тарифов
 * центрирован по той же причине.
 *
 * Галки вместо тире (`checkIcon`) — то, чем чек-лист тарифа отличается от
 * перечня в `cards`: в продуктовом приёме список возможностей читается
 * как «что включено», и галка это утверждает, а тире просто перечисляет.
 *
 * Цена — `text-h2`, как в `cards`: в колонке ~300px ступень `text-stat`
 * ломает «от 90 000 ₽» на две строки. Кегль всегда выбирает вариант, а не
 * `PlanContent` — см. комментарий там же.
 *
 * Переключателя «месяц/год» из исходного приёма тут нет: он требует
 * клиентского состояния и второй цены у каждого тарифа, то есть новых
 * полей в конфиге. Пока в `PricingPlan` одна цена, честнее показать её,
 * чем рисовать переключатель, который ничего не переключает.
 */
export function Product(props: PricingSection) {
  const {
    id,
    surface = "surface",
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
        <ProductHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          align="center"
        />

        <div className={cn("mt-14 grid gap-gutter md:mt-20", containerClass)}>
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
                  checkIcon
                  showTag
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

        {quote ? (
          <PricingQuoteBlock quote={quote} className="mt-14 md:mt-20" />
        ) : null}

        {comparison ? (
          <PricingComparisonTable comparison={comparison} className="mt-14 md:mt-20" />
        ) : null}

        {closing ? (
          <PricingClosing closing={closing} className="mt-14 md:mt-20" />
        ) : null}
      </Container>
    </Section>
  );
}

export default Product;
