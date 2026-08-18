import { ActionGroup } from "@/components/ui/ActionGroup";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { CtaSection } from "@/types/site";

/**
 * Призыв семейства `atelier`: акцентная полоса, разделённая ровно
 * пополам — заголовок со штрихом и лидом слева, кнопки колонкой справа.
 *
 * Ось 1/1, а не 7/5, как у `band`. В исходном приёме правую половину
 * занимает форма записи, и она честно делит экран с заголовком; у
 * `CtaSection` формы нет (для неё есть отдельная секция `contact`), но
 * пропорцию раскладка сохраняет — кнопки во всю ширину своей половины
 * читаются той же «панелью действия», что и поля формы.
 *
 * Поэтому же кнопки идут КОЛОНКОЙ (`stacked`), а не рядом: ряд из двух
 * кнопок в половине экрана — это две узкие плашки с переносами в
 * подписях, а колонка во всю ширину повторяет строй формы. Ширину они
 * при этом делят поровну — за это отвечает `ActionGroup`, а не эта
 * раскладка.
 *
 * Шапка тут своя, а не `AtelierHeader`: заголовок финального экрана
 * набран ступенью `text-h1` и не имеет колонтитула — колонтитул это знак
 * РАЗДЕЛА, а призыв закрывает страницу, а не открывает очередной раздел.
 * Штрих при этом на месте: он и связывает полосу с остальными
 * двенадцатью секциями.
 *
 * `surface` по умолчанию "accent" — единственная акцентная заливка на
 * странице (§3 CLAUDE.md). `eyebrow` не читается по причине выше;
 * `note` идёт мелкой строкой под кнопками, как во всех остальных CTA.
 */
export function Atelier(props: CtaSection) {
  const { id, surface = "accent", title, lead, actions = [], note } = props;

  return (
    <Section id={id} surface={surface} spacing="lg">
      <Container>
        <div className="grid gap-x-gutter gap-y-10 lg:grid-cols-2 lg:items-center lg:gap-x-16">
          <div data-reveal>
            {title ? (
              <h2 className="max-w-[18ch] font-heading text-h1">{title}</h2>
            ) : null}

            {title ? (
              <div className="mt-7 h-0.5 w-12 bg-accent-border" />
            ) : null}

            {lead ? (
              <p className="mt-7 max-w-[46ch] text-lead text-fg-muted">
                {lead}
              </p>
            ) : null}
          </div>

          {actions.length > 0 || note ? (
            <div data-reveal>
              <ActionGroup actions={actions} stacked />
              {note ? (
                <p className="mt-5 text-small text-fg-muted">{note}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}

export default Atelier;
