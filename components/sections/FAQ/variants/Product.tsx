import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { ProductHeader } from "@/components/ui/ProductHeader";
import { Section } from "@/components/ui/Section";
import { FaqSupportCard } from "../parts/FaqSupportCard";
import type { FaqSection } from "@/types/site";

/**
 * Вопросы семейства `product`: шапка раздела слева (5/12), аккордеон
 * справа (7/12).
 *
 * Геометрия та же, что у `editorial`, и это не совпадение: в обоих
 * исходных приёмах у блока вопросов узкая текстовая колонка и широкий
 * список. Различаются они шапкой — здесь `ProductHeader` с акцентным
 * колонтитулом над заголовком, там колонтитул капителью на линейке и
 * заголовок капслоком. Для сквозного семейства этого достаточно: страница
 * держится на том, что все её разделы набраны одной шапкой.
 *
 * От `split-sidebar` (ось 4/8, общий `SectionHeader`) отличается и осью,
 * и шапкой; от `sticky-split` — отсутствием залипания, которое остаётся
 * знаком того семейства (CLAUDE.md §2.15).
 *
 * Аккордеон — общий `components/ui/Accordion`: раскладку задаёт вариант,
 * глубину (линейки в «Экономе», карточки в «Стандарте») — тариф.
 */
export function Product(props: FaqSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    items,
    support,
    iconShape,
  } = props;

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <Container>
        <div className="grid gap-x-gutter gap-y-12 lg:grid-cols-12 lg:items-start">
          {/* min-w-0: без него длинное слово в заголовке распирает свою
              колонку и выносит аккордеон за край контейнера. */}
          <div className="min-w-0 lg:col-span-5">
            <ProductHeader
              number={number}
              eyebrow={eyebrow}
              title={title}
              lead={lead}
            />
          </div>

          <div className="lg:col-span-7" data-reveal>
            <Accordion items={items} />
          </div>
        </div>

        {support ? (
          <FaqSupportCard support={support} className="mt-12 md:mt-16" />
        ) : null}
      </Container>
    </Section>
  );
}

export default Product;
