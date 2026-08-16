import { Container } from "@/components/ui/Container";
import { EditorialHeader } from "@/components/ui/EditorialHeader";
import { Section } from "@/components/ui/Section";
import { revealDelay } from "@/lib/reveal";
import { TestimonialBody } from "../parts/TestimonialBody";
import { TrustRow } from "../parts/TrustRow";
import type { TestimonialsSection } from "@/types/site";

/**
 * Отзывы семейства `editorial`: цитаты столбцами прямо на поверхности
 * секции, подпись прижата к низу и лежит на волосяной линейке.
 *
 * Смысл выключки: цитаты у клиентов всегда разной длины, и если подписи
 * встанут сразу под текстом, три линейки окажутся на трёх разных
 * высотах — ряд читается сломанным (§1.5, п. 4). Поэтому `figure`
 * растянута на высоту ряда (`h-full` в grid-ячейке), а подпись прижата
 * `mt-auto`: линейки выстраиваются в одну горизонталь, и она работает
 * как нижняя граница всего ряда. Обрезать цитаты ради этого нельзя —
 * `line-clamp` в шаблоне запрещён (§1.5, п. 2).
 *
 * Цитата набрана `text-quote` тем же `font-display`, что и в `quotes`:
 * ступень выбирает вариант, потому что кегль зависит от ширины колонки
 * (см. комментарий в parts/TestimonialBody.tsx), а колонка тут третья
 * часть контейнера.
 *
 * Чего вариант не читает: `rating` (звёзды — плашка, вместо которой в
 * этом семействе стоит линейка), `photo` (круглый аватар возвращает
 * карточку без карточки), `result` и `featured` — оба выделяют один
 * отзыв из трёх, а в печатной сетке все три равноправны по построению.
 * `fillLastRow` тоже не читается: карточек нет, растягивать нечего.
 */
export function Editorial(props: TestimonialsSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    items,
    trust,
  } = props;

  return (
    <Section id={id} surface={surface}>
      <Container>
        <EditorialHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
        />

        <div className="mt-14 grid gap-x-gutter gap-y-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {items.map((item, index) => (
            <figure
              key={`${item.author}-${index}`}
              data-reveal
              style={revealDelay(index % 3)}
              className="flex h-full flex-col"
            >
              <TestimonialBody
                item={item}
                // mb-7 у цитаты, а не только mt-auto у подписи: в самой
                // высокой колонке ряда auto-отступ равен нулю, и без
                // этого пола подпись упиралась бы линейкой прямо в
                // последнюю строку цитаты.
                quoteClassName="mb-7 text-quote"
                captionClassName="mt-auto border-t border-rule pt-4"
              />
            </figure>
          ))}
        </div>

        {trust ? <TrustRow trust={trust} className="mt-12 md:mt-16" /> : null}
      </Container>
    </Section>
  );
}

export default Editorial;
