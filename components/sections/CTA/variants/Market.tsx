import { ActionGroup } from "@/components/ui/ActionGroup";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionTicker } from "@/components/ui/Ticker";
import type { CtaSection } from "@/types/site";

/**
 * Призыв семейства `market`: акцентная полоса, гигантский заголовок
 * капслоком слева, лид и кнопки справа.
 *
 * Ось 1.2fr / auto, а не 1/1 и не 7/5. Правая колонка тут `auto` —
 * ровно по ширине кнопок, и это не мелочь: заголовок должен забрать
 * ВЕСЬ остаток строки, потому что в этой раскладке он и есть содержание
 * блока. Колонки выровнены по центру.
 *
 * Заголовок в верхнем регистре и ступенью `text-h1` — тот же крик, что
 * в первом экране и в шапках разделов. Колонтитула нет: колонтитул это
 * знак РАЗДЕЛА, а призыв закрывает страницу, а не открывает очередной
 * раздел. Указателя-шеврона тоже нет — под последним блоком страницы
 * ему некуда показывать.
 *
 * Цвет заголовка здесь НЕ задаётся: на акцентной заливке работает
 * обычный `text-fg` этой поверхности. Это то же правило, по которому
 * `MarketHeader` уводит акцентный заголовок в `text-fg` под
 * `[data-surface=accent]` — акцент по акценту не виден.
 *
 * `surface` по умолчанию "accent" — единственная акцентная заливка на
 * странице (§3 CLAUDE.md). `eyebrow` не читается по причине выше;
 * `note` идёт мелкой строкой под кнопками, как во всех остальных CTA.
 */
export function Market(props: CtaSection) {
  const {
    id,
    surface = "accent",
    title,
    lead,
    actions = [],
    note,
    ticker,
  } = props;

  return (
    <Section id={id} surface={surface} spacing="lg">
      <Container>
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[1.2fr_auto] lg:items-center">
          {title ? (
            <h2 className="max-w-[16ch] font-heading text-h1 uppercase" data-reveal>
              {title}
            </h2>
          ) : null}

          {actions.length > 0 || lead || note ? (
            <div className="flex flex-col gap-6" data-reveal>
              {lead ? (
                <p className="max-w-[38ch] text-lead text-fg-muted">{lead}</p>
              ) : null}

              {actions.length > 0 ? (
                <ActionGroup actions={actions} stacked />
              ) : null}

              {note ? (
                <p className="text-small text-fg-muted">{note}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>

      {ticker ? <SectionTicker text={ticker} spacing="lg" /> : null}
    </Section>
  );
}

export default Market;
