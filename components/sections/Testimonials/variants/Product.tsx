import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ProductHeader } from "@/components/ui/ProductHeader";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { fillLastRowClasses } from "@/lib/gridFill";
import { revealDelay } from "@/lib/reveal";
import { TestimonialBody } from "../parts/TestimonialBody";
import { TrustRow } from "../parts/TrustRow";
import type { TestimonialsSection } from "@/types/site";

const GRID_BREAKPOINTS = [
  { prefix: "sm:", cols: 2 },
  { prefix: "lg:", cols: 3 },
] as const;

/**
 * Отзывы семейства `product`: карточки, в которых цитата сверху, а автор
 * с аватаром прижат к низу.
 *
 * Отличие от `cards`, с которым делят сетку: там автор идёт сразу за
 * цитатой и без фотографии, здесь — аватар плюс прижатый низ. Прижатый
 * низ не украшение: цитаты у клиентов разной длины, и без него подписи в
 * ряду стоят на трёх разных высотах (§1.5, п. 4). Обрезать цитаты ради
 * ровного ряда нельзя — `line-clamp` в шаблоне запрещён.
 *
 * Кегль цитаты `text-lead`, а не `text-quote`: колонка тут треть
 * контейнера, и 28px превращают четыре строки в десять. Ступень выбирает
 * вариант, потому что только он знает ширину колонки — см. комментарий в
 * parts/TestimonialBody.tsx.
 *
 * `rating`, `result` и `featured` вариант не читает: звёзды и выделенная
 * карточка — ручки `rated-cards`/`spotlight`, где один отзыв специально
 * важнее прочих. Здесь ряд равноправных, как в исходном приёме.
 */
export function Product(props: TestimonialsSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    items,
    trust,
    fillLastRow = true,
  } = props;

  const spanClasses = fillLastRow
    ? fillLastRowClasses(items.length, GRID_BREAKPOINTS)
    : [];

  return (
    <Section id={id} surface={surface}>
      <Container>
        <ProductHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
        />

        <div className="mt-14 grid gap-gutter sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {items.map((item, index) => (
            <Card
              key={`${item.author}-${index}`}
              variant="framed"
              className={cn("flex h-full flex-col", spanClasses[index] || undefined)}
              data-reveal
              style={revealDelay(index % 3)}
            >
              <figure className="flex h-full flex-col">
                <TestimonialBody
                  item={item}
                  // mb-7 у цитаты нужен рядом с mt-auto у подписи: в самой
                  // высокой карточке ряда auto-отступ равен нулю, и без
                  // этого пола аватар упирался бы в последнюю строку.
                  quoteClassName="mb-7 text-lead"
                  captionClassName="mt-auto"
                  showPhoto
                />
              </figure>
            </Card>
          ))}
        </div>

        {trust ? <TrustRow trust={trust} className="mt-12 md:mt-16" /> : null}
      </Container>
    </Section>
  );
}

export default Product;
