import type { CSSProperties } from "react";
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
import { PricingQuoteBlock } from "../parts/PricingQuoteBlock";
import { pricingGridLayout } from "../pricingGrid";
import type { PricingSection } from "@/types/site";

const GRID_BREAKPOINTS = [{ prefix: "sm:", cols: 2 }] as const;

/**
 * Текст слева (5/12): пилюля, заголовок, лид, короткая подпись доверия
 * (`trust`). Справа (7/12) — тёмная панель с карточками тарифов; у
 * выделенного тарифа поверхность становится accent (data-surface="accent"),
 * так текст сам получает контрастный цвет — тот же приём, что у
 * Testimonials/Bento для featured-отзыва.
 */
export function Split(props: PricingSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    items,
    trust,
    note,
    footnotes = [],
    closing,
    quote,
    comparison,
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
        <div className="grid gap-x-gutter gap-y-10 md:grid-cols-12 md:items-center">
          <div className="min-w-0 md:col-span-5" data-reveal>
            {number ? (
              <p className="tabular text-caption font-medium uppercase text-fg-muted">{number}</p>
            ) : null}
            {eyebrow ? (
              <Badge variant="soft" className={cn("uppercase", number && "mt-3")}>
                {eyebrow}
              </Badge>
            ) : null}
            {/* break-words + min-w-0 на колонке: длинное слово в заголовке
                иначе распирало 5/12-колонку и наезжало на тёмную панель
                с тарифами справа. */}
            {title ? (
              <h2 className="mt-4 max-w-[18ch] font-heading text-h1 break-words">{title}</h2>
            ) : null}
            {lead ? (
              <p className="mt-5 max-w-[46ch] text-body text-fg-muted">{lead}</p>
            ) : null}
            {trust ? <p className="mt-8 text-small text-fg-muted">{trust}</p> : null}
          </div>

          <div
            // text-fg обязателен рядом с data-surface: PlanContent красит
            // имя тарифа и цену голым `color` без утилиты (по той же причине,
            // что цена/цитата в других вариантах — см. PlanContent.tsx), и
            // без переобъявления здесь они наследовали бы уже вычисленный
            // тёмный цвет текста родительской paper-секции — тёмный текст
            // на этой же тёмной ink-панели читался бы как «чёрное на чёрном».
            className="rounded-card bg-bg p-6 text-fg md:col-span-7 md:p-10"
            data-surface="ink"
            data-reveal
          >
            <div className={cn("grid gap-6", containerClass)}>
              {items.map((plan, index) => (
                <div
                  key={plan.name}
                  data-surface={plan.featured ? "accent" : undefined}
                  className={cn(plan.featured && "rounded-card bg-bg text-fg", spanClasses[index])}
                  style={
                    plan.featured
                      ? // --accent сбрасываем на обычный, немикшированный
                        // палитровый: у [data-surface="ink"] (родительская
                        // панель) --accent переопределён светлее ради тонких
                        // элементов НА ink-фоне (рамка, строка заголовка) —
                        // но здесь эта переменная становится ПОЛНОЙ ЗАЛИВКОЙ
                        // карточки (--surface-bg: var(--accent) у
                        // [data-surface="accent"]), а --accent-fg остаётся
                        // рассчитан под обычный акцент. В тёмной теме
                        // унаследованный ink-микс уходил в тёмный тон и
                        // совпадал с тоже тёмным --accent-fg — текст
                        // карточки читался как чёрный по чёрному.
                        ({ ...revealDelay(index), "--accent": "var(--palette-accent)" } as CSSProperties)
                      : revealDelay(index)
                  }
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
                    <PlanContent plan={plan} priceClassName="text-h3" checkIcon />
                  </Card>
                </div>
              ))}
            </div>
          </div>
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

export default Split;
