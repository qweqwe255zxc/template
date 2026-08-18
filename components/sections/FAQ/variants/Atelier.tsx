import { Accordion } from "@/components/ui/Accordion";
import { AtelierHeader } from "@/components/ui/AtelierHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FaqSupportCard } from "../parts/FaqSupportCard";
import type { FaqSection } from "@/types/site";

/**
 * Вопросы семейства `atelier`: центрированная шапка со штрихом, под ней
 * аккордеон в узкой колонке.
 *
 * Единственный раздел семейства, где нет ни решётки, ни плитки, ни
 * кадров — и это не пробел, а сама раскладка исходного приёма: список
 * вопросов там сознательно поставлен в узкую колонку и разлинован
 * только по горизонтали, чтобы после трёх разграфлённых блоков подряд
 * страница получила воздух. Форму самого списка (линейки в «Экономе»,
 * стопка карточек в «Стандарте») решает тариф через `.ui-accordion`, а
 * не вариант.
 *
 * Чем отличается от `narrow`, с которым делит ширину колонки: шапкой.
 * У `narrow` это обычный `SectionHeader` — колонтитул строкой над
 * заголовком по левому краю; здесь шапка семейства, по центру и со
 * штрихом. Это то же различие, что между `Header/editorial` и
 * `Header/compact`: раскладка одна, язык разный, и в сквозном семействе
 * важен именно язык.
 *
 * Заголовок НЕ залипает — залипание опознавательный знак семейства
 * `sticky-split` (CLAUDE.md §2.15). Нужен именно он — у той же секции
 * есть `variant: "sticky-split"`.
 *
 * `support` рендерится под аккордеоном, если задан, — как в `narrow`.
 * `item.icon` вариант не трогает: плашку у вопроса рисует общий
 * `components/ui/Accordion`, одинаково во всех одиннадцати раскладках
 * FAQ. Убрать её тут значило бы завести аккордеону вторую версию ради
 * одного варианта — а форма списка в этой секции принадлежит тарифу
 * (`.ui-accordion`), не приёму. Хочется без плашек — не задавайте
 * `icon` у items.
 */
export function Atelier(props: FaqSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    items,
    support,
  } = props;

  return (
    <Section id={id} surface={surface}>
      <Container width="narrow">
        <AtelierHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
        />

        <div className="mt-12 md:mt-16" data-reveal>
          <Accordion items={items} />
        </div>

        {support ? (
          <FaqSupportCard support={support} className="mt-10 md:mt-14" />
        ) : null}
      </Container>
    </Section>
  );
}

export default Atelier;
