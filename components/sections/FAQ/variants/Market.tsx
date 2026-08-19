import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/ui/MarketHeader";
import { Section } from "@/components/ui/Section";
import { SectionTicker } from "@/components/ui/Ticker";
import { FaqSupportCard } from "../parts/FaqSupportCard";
import type { FaqSection } from "@/types/site";

/**
 * Вопросы семейства `market`: центрированная шапка с шевроном, под ней
 * аккордеон в узкой колонке.
 *
 * Узкая колонка — раскладка самого исходного приёма: список вопросов там
 * стоит по центру страницы и заметно уже всего остального, чтобы после
 * четырёх широких блоков подряд страница получила воздух. Форму самого
 * списка (линейки в «Экономе», стопка карточек в «Стандарте») решает
 * тариф через `.ui-accordion`, а не вариант.
 *
 * Чем отличается от `narrow`, с которым делит ширину колонки, — шапкой:
 * у `narrow` обычный `SectionHeader` с колонтитулом по левому краю,
 * здесь шапка семейства, по центру, акцентная и с указателем вниз. В
 * сквозном семействе важна именно она: раскладок в шаблоне много, а
 * язык у страницы должен быть один.
 *
 * Заголовок НЕ залипает — залипание опознавательный знак семейства
 * `sticky-split` (CLAUDE.md §2.15). Нужен именно он — у той же секции
 * есть `variant: "sticky-split"`.
 *
 * `item.icon` вариант не трогает: плашку у вопроса рисует общий
 * `components/ui/Accordion` одинаково во всех двенадцати раскладках FAQ.
 */
export function Market(props: FaqSection) {
  const {
    id,
    surface = "surface",
    number,
    eyebrow,
    title,
    lead,
    items,
    support,
    ticker,
  } = props;

  return (
    <Section id={id} surface={surface}>
      <Container width="narrow">
        <MarketHeader
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

      {ticker ? <SectionTicker text={ticker} /> : null}
    </Section>
  );
}

export default Market;
