import { Section } from "@/components/ui/Section";
import { StickySplit as SplitLayout } from "@/components/ui/StickySplit";
import { revealDelay } from "@/lib/reveal";
import { RatingStars } from "../parts/RatingStars";
import { TestimonialBody } from "../parts/TestimonialBody";
import { TrustRow } from "../parts/TrustRow";
import type { TestimonialsSection } from "@/types/site";

/**
 * Отзывы столбцом справа от залипающего заголовка — член семейства
 * `sticky-split` (общая ось 4/8, см. `ui/StickySplit`).
 *
 * Один отзыв на строку, а не сетка в две колонки: в колонке 8/12 два
 * отзыва рядом дают по ~340px, и цитата в четыре-пять строк начинает
 * читаться как подпись. Столбец же позволяет держать цитату ступенью
 * `text-quote` — крупнее, чем в карточных вариантах, и это единственное
 * место, где отзыв выглядит цитатой, а не карточкой.
 */
export function StickySplit(props: TestimonialsSection) {
  const { id, surface = "surface", number, eyebrow, title, lead, items, trust } = props;

  return (
    <Section id={id} surface={surface}>
      <SplitLayout number={number} eyebrow={eyebrow} title={title} lead={lead}>
        <ul>
          {items.map((item, index) => (
            <li
              key={`${item.author}-${index}`}
              className="border-b border-rule py-8 first:border-t md:py-10"
              data-reveal
              style={revealDelay(index)}
            >
              <figure>
                <RatingStars rating={item.rating} className="mb-5" />
                <TestimonialBody
                  item={item}
                  showPhoto
                  quoteClassName="text-quote"
                  captionClassName="mt-7"
                />
              </figure>
            </li>
          ))}
        </ul>

        {trust ? <TrustRow trust={trust} className="mt-10" /> : null}
      </SplitLayout>
    </Section>
  );
}

export default StickySplit;
