import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/ui/MarketHeader";
import { Section } from "@/components/ui/Section";
import { SectionTicker } from "@/components/ui/Ticker";
import { revealDelay } from "@/lib/reveal";
import type { StatsSection } from "@/types/site";

/**
 * Цифры семейства `market`: четыре колонки, в каждой гигантское
 * акцентное число и мелкая приглушённая подпись под ним. Больше в
 * разделе нет ничего — ни карточек, ни рамок, ни линеек, ни иконок.
 *
 * Чем отличается от трёх других «плоских» полос цифр в каталоге:
 *
 *   • `band`/`grid` держат полосу подложкой (`containerVariant`) и
 *     линейками сверху и снизу. Здесь подложки нет вовсе: цифры лежат
 *     прямо на фоне секции.
 *   • `editorial` разделяет ячейки линейками разной толщины — там
 *     толщина несёт смысл. Здесь линий нет ни одной.
 *   • `atelier` замыкает цифры в решётку на волосяных швах.
 *
 * То есть различитель у этой раскладки ровно один — ЦВЕТ ЧИСЛА. Оно
 * акцентное, и на странице, собранной этим семейством, оно рифмуется с
 * акцентным заголовком раздела: цифры и заголовки — единственные цветные
 * пятна на листе.
 *
 * `highlight` поэтому не читается: выделять одну цифру из четырёх, когда
 * все четыре и так акцентные, нечем. Не читаются и `icon` (пиктограмма
 * — ровно тот декор, от которого раскладка отказывается),
 * `containerVariant`, `image` и `fillLastRow` (пустой слот в сетке с
 * зазором — это воздух, его не видно).
 */
export function Market(props: StatsSection) {
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

  const hasHeader = Boolean(number || eyebrow || title || lead);

  return (
    <Section id={id} surface={surface}>
      <Container>
        <MarketHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          className={hasHeader ? "mb-14 md:mb-20" : undefined}
        />

        <dl className="grid gap-x-gutter gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <div key={item.label} data-reveal style={revealDelay(index)}>
              {/* Число первым ярусом, подпись под ним. Выравнивать ярусы
                  subgrid'ом (как в Stats/product, где подпись сверху) тут
                  не нужно: числа стоят на верхнем краю ячейки и уже на
                  одной линии, а разная длина подписей вниз никому не
                  мешает. */}
              <dt className="tabular font-display text-stat text-accent [[data-surface=accent]_&]:text-fg [[data-surface=ink]_&]:text-fg">
                {item.value}
                {item.suffix ? <span>{item.suffix}</span> : null}
              </dt>

              <dd className="mt-3 max-w-[24ch] text-small text-fg-muted">
                {item.label}
              </dd>

              {item.text ? (
                <p className="mt-2 max-w-[34ch] text-small text-fg-muted">
                  {item.text}
                </p>
              ) : null}
            </div>
          ))}
        </dl>
      </Container>

      {ticker ? <SectionTicker text={ticker} /> : null}
    </Section>
  );
}

export default Market;
