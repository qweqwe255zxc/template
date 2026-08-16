import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { EditorialHeader } from "@/components/ui/EditorialHeader";
import { Section } from "@/components/ui/Section";
import { FaqSupportCard } from "../parts/FaqSupportCard";
import type { FaqSection } from "@/types/site";

/**
 * Вопросы семейства `editorial`: колонтитул и заголовок в верхнем
 * регистре слева (5/12), аккордеон справа (7/12).
 *
 * Ось 5/7, а не 4/8 как у `split-sidebar`: заголовок тут набран
 * капслоком, а капслок при равном кегле занимает примерно на четверть
 * больше места по горизонтали — в колонке 4/12 та же строка рвалась бы
 * на слог. Правая колонка от этого не страдает: аккордеон одинаково
 * читается и в 8/12, и в 7/12.
 *
 * Заголовок НЕ залипающий, хотя в исходном приёме он был sticky. Это
 * сознательный отказ: залипание — опознавательный знак семейства
 * `sticky-split` (CLAUDE.md §2.15), и там же прямо сказано, что одинокая
 * залипающая секция среди обычных читается как сбой, а не как приём.
 * Нужен именно залипающий заголовок — на это есть `variant:
 * "sticky-split"` у той же секции.
 *
 * Сам аккордеон — общий `components/ui/Accordion`, а не своя разметка:
 * раскладку задаёт вариант, глубину (линейки в «Экономе», карточки в
 * «Стандарте») — тариф. Тот же принцип, по которому Pricing/editorial
 * берёт обычный `Card`, а не рисует плоскую рамку руками.
 */
export function Editorial(props: FaqSection) {
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
            <EditorialHeader
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

        {/* Карточка поддержки — под обеими колонками, во всю ширину: она
            адресована ко всем вопросам сразу, а не только к тем, что
            поместились в левую колонку. Тот же приём, что в
            split-sidebar. */}
        {support ? (
          <FaqSupportCard support={support} className="mt-12 md:mt-16" />
        ) : null}
      </Container>
    </Section>
  );
}

export default Editorial;
