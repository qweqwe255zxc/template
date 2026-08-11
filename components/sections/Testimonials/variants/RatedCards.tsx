import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { revealDelay } from "@/lib/reveal";
import { bentoSpan } from "@/lib/bentoSpan";
import { RatingStars } from "../parts/RatingStars";
import { TestimonialBody } from "../parts/TestimonialBody";
import { TestimonialsHeader } from "../parts/TestimonialsHeader";
import { TrustRow } from "../parts/TrustRow";
import type { TestimonialsSection } from "@/types/site";

/**
 * Заголовок пилюлей по центру, ряд одинаковых карточек: рейтинг, цитата,
 * линейка, автор с фото. Опциональная строка `trust` под сеткой.
 *
 * `item.featured` здесь сознательно не влияет ни на что: одна карточка
 * из трёх с другим фоном читалась как сбой рендера, а не как выделение.
 * Для «главного отзыва» есть bento и spotlight, где под это построена
 * раскладка, а не подкрашен один прямоугольник.
 */
export function RatedCards(props: TestimonialsSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    trust,
    items,
    headerAlign,
    fillLastRow = true,
  } = props;

  return (
    <Section id={id} surface={surface}>
      <Container>
        <TestimonialsHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          align={headerAlign}
          className="mb-12 md:mb-16"
        />

        <div className="grid gap-gutter md:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={`${item.author}-${index}`}
              data-reveal
              style={revealDelay(index)}
              className={fillLastRow ? bentoSpan(index, items.length, { md: 3 }) : undefined}
            >
              {/* Ряд одинаковых карточек: item.featured здесь НЕ красит
                  фон. Тонировка одной карточки из трёх выглядела как
                  ошибка рендера, а не как выделение — соседи-то ничем не
                  хуже. Выделять отзыв нужно вариантом bento или spotlight,
                  где под это есть раскладка. */}
              <Card variant="framed" className="flex h-full flex-col">
                <figure className="flex flex-1 flex-col">
                  <RatingStars rating={item.rating} />

                  {/* mt-8/pt-7 вокруг линейки, а не mt-4/pt-5: разделитель
                      обязан отбиваться от текста сильнее, чем строки
                      отбиты друг от друга, иначе он читается как ещё одна
                      строка, а не как граница блоков. */}
                  <TestimonialBody
                    item={item}
                    showPhoto
                    quoteClassName="mt-5 mb-8 text-lead"
                    captionClassName="mt-auto border-t border-rule pt-7"
                  />
                </figure>
              </Card>
            </div>
          ))}
        </div>

        {trust ? <TrustRow trust={trust} className="mt-12 md:mt-16" /> : null}
      </Container>
    </Section>
  );
}

export default RatedCards;
