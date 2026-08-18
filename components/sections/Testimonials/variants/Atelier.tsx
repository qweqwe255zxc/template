import { AtelierHeader } from "@/components/ui/AtelierHeader";
import { Container } from "@/components/ui/Container";
import {
  SeamGrid,
  SEAM_CELL,
  seamColumns,
  seamTailSpan,
} from "@/components/ui/SeamGrid";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import { TestimonialBody } from "../parts/TestimonialBody";
import { TrustRow } from "../parts/TrustRow";
import type { TestimonialsSection } from "@/types/site";

/** Литеральные классы — сканер Tailwind не видит склеенных строк. */
const LG_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
};

/**
 * Отзывы семейства `atelier`: цитаты в клетках разграфлённого бланка,
 * подпись с круглым аватаром прижата к низу клетки.
 *
 * ОСОЗНАННОЕ ОТСТУПЛЕНИЕ ОТ ИСХОДНИКА. В исходном приёме отзывы —
 * единственный раздел, набранный отдельными карточками с зазором, при
 * том что цифры, этапы, факты о клинике и тарифы там разграфлены одной
 * решёткой. Взять карточки буквально значило бы получить вариант,
 * который ничем, кроме шапки, не отличается от уже существующих `cards`
 * и `product` — а сквозное семейство держится ровно на том, что его
 * разделы говорят одним языком. Решётка здесь — этот язык, и она в
 * исходнике встречается вчетверо чаще карточки.
 *
 * Кегль цитаты `text-lead`, а не `text-quote`: клетка занимает треть
 * контейнера, и 28px превращают четыре строки в десять. Ступень выбирает
 * вариант, потому что только он знает ширину колонки — см. комментарий в
 * parts/TestimonialBody.tsx.
 *
 * `rating`, `result` и `featured` не читаются: звёзды и выделенный отзыв
 * — ручки `rated-cards`/`spotlight`, где один отзыв специально важнее
 * прочих. Здесь ряд равноправных, как в исходном приёме. `fillLastRow`
 * тоже не читается — остаток ряда закрывает `seamTailSpan`, у решётки
 * своя механика неполного ряда (см. SeamGrid).
 */
export function Atelier(props: TestimonialsSection) {
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

  // seamColumns, а не Math.min: четыре отзыва в три колонки оставляли
  // последнюю клетку втрое шире прочих, и она читалась как выделенная,
  // хотя ряд тут равноправный. Подробности — в SeamGrid.
  const lgCols = seamColumns(items.length, 3);
  const smCols = Math.min(items.length, 2);

  return (
    <Section id={id} surface={surface}>
      <Container>
        <AtelierHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          className="mb-14 md:mb-20"
        />

        <SeamGrid
          className={cn(smCols === 2 && "sm:grid-cols-2", LG_COLS[lgCols])}
        >
          {items.map((item, index) => (
            <figure
              key={`${item.author}-${index}`}
              data-reveal
              style={revealDelay(index % 3)}
              className={cn(
                SEAM_CELL,
                "flex h-full flex-col",
                seamTailSpan(index, items.length, smCols, "sm:"),
                seamTailSpan(index, items.length, lgCols, "lg:"),
              )}
            >
              <TestimonialBody
                item={item}
                // mb-7 у цитаты нужен рядом с mt-auto у подписи: в самой
                // высокой клетке ряда auto-отступ равен нулю, и без этого
                // пола аватар упирался бы в последнюю строку цитаты.
                quoteClassName="mb-7 text-lead"
                captionClassName="mt-auto"
                showPhoto
              />
            </figure>
          ))}
        </SeamGrid>

        {trust ? <TrustRow trust={trust} className="mt-12 md:mt-16" /> : null}
      </Container>
    </Section>
  );
}

export default Atelier;
