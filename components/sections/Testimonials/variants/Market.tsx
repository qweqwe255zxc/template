import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/ui/MarketHeader";
import { Section } from "@/components/ui/Section";
import { SectionTicker } from "@/components/ui/Ticker";
import { revealDelay } from "@/lib/reveal";
import { TrustRow } from "../parts/TrustRow";
import type { TestimonialsSection } from "@/types/site";

/**
 * Отзывы семейства `market`: плоские карточки, над цитатой — крупная
 * акцентная кавычка глифом, автор прижат к низу.
 *
 * Кавычка тут работает тем же, чем в остальных разделах семейства
 * работают акцентное число и акцентный заголовок: единственным цветным
 * пятном блока. Поэтому ни аватара, ни звёзд рейтинга в карточке нет —
 * они бы забрали внимание у неё и превратили карточку в такую же, как
 * `rated-cards`.
 *
 * Карточка плоская по той же причине, что в `Features/market`: у
 * исходного бренда глубина берётся из контраста цвета, а не из подъёма,
 * — это лист `bg-card` без тени и рамки, а не общий `Card` с глубиной
 * пресета.
 *
 * Не читает `rating`, `photo`, `result`, `featured` и `fillLastRow`.
 */
export function Market(props: TestimonialsSection) {
  const {
    id,
    surface = "surface",
    number,
    eyebrow,
    title,
    lead,
    items,
    trust,
    ticker,
  } = props;

  return (
    <Section id={id} surface={surface}>
      <Container>
        <MarketHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
        />

        <ul className="mt-14 grid gap-gutter md:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <li
              key={item.author}
              // border-rule обязателен: без него плоская карточка
              // исчезает на секции surface="surface" (её --surface-card
              // равен фону секции), а §1.5 требует отличимости от фона в
              // обоих тарифах. Подробнее — в Features/market.
              className="flex h-full flex-col rounded-lg border border-rule bg-card p-7 md:p-8"
              data-reveal
              style={revealDelay(index % 3)}
            >
              {/* Кавычка — глиф, а не украшение из псевдоэлемента:
                  aria-hidden обязателен, иначе скринридер зачитывает её
                  перед каждой цитатой. leading-none прижимает её к
                  верхнему краю карточки — иначе кегль в две ступени
                  тянет за собой пустую строку. */}
              <span
                aria-hidden="true"
                className="font-display text-stat leading-none text-accent [[data-surface=accent]_&]:text-fg [[data-surface=ink]_&]:text-fg"
              >
                «
              </span>

              <blockquote className="mt-4 text-lead">{item.quote}</blockquote>

              {/* mt-auto: цитаты разной длины, а подписи обязаны стоять
                  на одной линии по всему ряду (§1.5, п. 4). */}
              <footer className="mt-auto pt-6">
                <p className="text-small font-semibold">{item.author}</p>
                {item.meta ? (
                  <p className="mt-1 text-caption text-fg-muted">{item.meta}</p>
                ) : null}
              </footer>
            </li>
          ))}
        </ul>

        <TrustRow trust={trust} className="mt-12 md:mt-16" />
      </Container>

      {ticker ? <SectionTicker text={ticker} /> : null}
    </Section>
  );
}

export default Market;
