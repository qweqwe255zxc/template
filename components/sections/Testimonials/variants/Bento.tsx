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
 * Заголовок пилюлей по центру, первый отзыв — крупный (рейтинг, большая
 * цитата, автор с фото), остальные — сетка со спанами из
 * `lib/bentoSpan.ts` (растягивается на 2 слота только когда это ровно
 * закрывает ряд).
 */
export function Bento(props: TestimonialsSection) {
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
  // item.featured выбирает, кто получает крупную карточку — без пометки
  // (или без совпадений) крупным остаётся первый по порядку, как раньше.
  const featuredIndex = items.findIndex((item) => item.featured);
  const first = featuredIndex >= 0 ? items[featuredIndex] : items[0];
  const rest = items.filter((_, index) => index !== (featuredIndex >= 0 ? featuredIndex : 0));

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

        {first ? (
          <div className="mb-6" data-reveal>
            <Card variant="framed">
              <figure>
                <RatingStars rating={first.rating} />
                <TestimonialBody
                  item={first}
                  showPhoto
                  quoteClassName="mt-4 text-quote md:max-w-[42ch]"
                  captionClassName="mt-6"
                />
              </figure>
            </Card>
          </div>
        ) : null}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((item, index) => (
            <div
              key={`${item.author}-${index}`}
              data-reveal
              style={revealDelay(index)}
              className={fillLastRow ? bentoSpan(index, rest.length, { sm: 2, lg: 3 }) : undefined}
            >
              <Card variant="framed" className="flex h-full flex-col">
                <figure className="flex flex-1 flex-col">
                  <RatingStars rating={item.rating} />
                  <TestimonialBody
                    item={item}
                    showPhoto
                    quoteClassName="mt-4 text-small"
                    captionClassName="mt-auto pt-5"
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

export default Bento;
