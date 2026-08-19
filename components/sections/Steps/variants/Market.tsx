import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/ui/MarketHeader";
import { Section } from "@/components/ui/Section";
import { SectionTicker } from "@/components/ui/Ticker";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import type { StepsSection } from "@/types/site";

/**
 * Этапы семейства `market`: колонки, в каждой крупный акцентный номер,
 * под ним заголовок и описание. Ни карточек, ни оси, ни соединительной
 * линии — последовательность держит только кегль номера и порядок
 * чтения слева направо.
 *
 * Число колонок берётся из числа шагов, а не задаётся жёстко: четыре
 * шага встают в ряд, три — в три колонки, пять и больше переносятся во
 * вторую строку. Пустой слот в сетке с зазором не виден, поэтому
 * подгонять остаток (как это делает решётка `atelier`) не нужно.
 *
 * Чем отличается от `rail`, у которого тоже «шаги в ряд без карточек»:
 * там колонки стоят на общей линейке и номер приглушённый, здесь
 * линейки нет вовсе, а номер акцентный и на ступень крупнее заголовка.
 * От `product`: там линейка в два пикселя над колонкой и `meta` прижата
 * к низу; здесь `meta` идёт сразу под номером отдельной строкой, как
 * срок этапа в исходном приёме.
 *
 * Не читает `icon`, `iconShape`, `photo`, `featured` и `fillLastRow`:
 * всё это оправы и подсветки, вместо которых здесь работает воздух.
 */
export function Market(props: StepsSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    items,
    ticker,
  } = props;

  // Колонок столько, сколько шагов, но не больше четырёх: пятая колонка
  // на 1600px даёт ~290px, и заголовок этапа начинает рваться.
  const columns = Math.min(items.length, 4);

  return (
    <Section id={id} surface={surface}>
      <Container>
        <MarketHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
        />

        <ol
          className={cn(
            "mt-14 grid gap-x-gutter gap-y-12 sm:grid-cols-2 md:mt-20",
            columns >= 4
              ? "lg:grid-cols-4"
              : columns === 3
                ? "lg:grid-cols-3"
                : undefined,
          )}
        >
          {items.map((step, index) => (
            <li key={step.number} data-reveal style={revealDelay(index % 4)}>
              <span className="tabular block font-display text-h2 text-accent [[data-surface=accent]_&]:text-fg [[data-surface=ink]_&]:text-fg">
                {step.number}
              </span>

              {step.meta ? (
                <span className="mt-2 block text-caption text-fg-muted">
                  {step.meta}
                </span>
              ) : null}

              <h3 className="mt-4 font-display text-lead font-semibold">
                {step.title}
              </h3>

              <p className="mt-3 text-small text-fg-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>

      {ticker ? <SectionTicker text={ticker} /> : null}
    </Section>
  );
}

export default Market;
