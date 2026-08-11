import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { revealDelay } from "@/lib/reveal";
import { bentoSpan } from "@/lib/bentoSpan";
import { cn } from "@/lib/cn";
import { RatingStars } from "../parts/RatingStars";
import { TestimonialBody } from "../parts/TestimonialBody";
import type { TestimonialsSection } from "@/types/site";

/**
 * Три отзыва в ряд, каждый в Card variant="framed" — то есть с глубиной
 * своего тарифа. Вариант по умолчанию в «Стандарте».
 *
 * Исторически этот вариант менял только число колонок и рисовал те же
 * линейки, что и quotes: «карточки» без карточек, из-за чего секция
 * оставалась плоской в любом тарифе. Теперь это настоящие карточки.
 *
 * Две вещи, которые отличают карточку от широкой цитаты:
 *
 * 1. Кегль. Цитата тут идёт ступенью `text-lead`, а не `text-quote`:
 *    28px рассчитаны на широкую колонку quotes, а в карточке на 1/3
 *    ширины тот же отзыв разваливался на десяток строк и карточка
 *    превращалась в стену текста.
 * 2. Подпись автора прижата к низу (`mt-auto` в captionClassName поверх
 *    flex-колонки). Отзывы всегда разной длины, а карточки в ряду —
 *    одной высоты; без этого подписи висели на разной высоте, и ряд
 *    читался неровным.
 */
export function Cards(props: TestimonialsSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    items,
    fillLastRow = true,
  } = props;

  return (
    <Section id={id} surface={surface} spacing={title ? "default" : "none"}>
      <Container>
        <SectionHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
        />

        <div
          className={cn(
            title ? "mt-14 md:mt-20" : "pb-section",
            "grid gap-gutter md:grid-cols-3",
          )}
        >
          {items.map((item, index) => (
            <Card
              key={`${item.author}-${index}`}
              variant="framed"
              className={cn(
                "flex h-full flex-col",
                fillLastRow && bentoSpan(index, items.length, { md: 3 }),
              )}
            >
              <figure
                className="flex flex-1 flex-col"
                data-reveal
                style={revealDelay(index)}
              >
                {/* Рейтинг сверху: без него карточка начиналась прямо с
                    абзаца текста и читалась пустой — у отзыва не было
                    ничего, что схватывается взглядом до чтения. Рисуется
                    только если у item задан rating, поэтому конфиги без
                    оценок выглядят как раньше. */}
                <RatingStars rating={item.rating} className="mb-4" />

                <TestimonialBody
                  item={item}
                  quoteClassName="mb-8 text-lead"
                  captionClassName="mt-auto border-t border-rule pt-7"
                />
              </figure>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default Cards;
