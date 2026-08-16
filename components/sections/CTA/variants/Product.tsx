import { ActionGroup } from "@/components/ui/ActionGroup";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CtaEyebrow } from "../parts/CtaEyebrow";
import type { CtaSection } from "@/types/site";

/**
 * Финал семейства `product`: тёмная панель со скруглением ВНУТРИ светлой
 * секции, а не тёмная секция во всю ширину.
 *
 * Это главное, чем вариант отличается от `editorial` (тёмная полоса от
 * края до края) и от `boxed` (светлая карточка поверх акцентной
 * заливки). Панель с полями по бокам читается как объект, лежащий на
 * странице, — тот же приём, что у карточек выше по странице, только
 * укрупнённый до целого раздела. Поэтому `surface` секции по умолчанию
 * "paper": тёмное здесь — панель, а не раздел.
 *
 * Тёмный контекст задаётся `data-surface="ink"` на самой панели, как это
 * делает `Section`. Дальше внутри работают обычные `text-fg` /
 * `text-fg-muted` / `bg-bg`, и ни один цвет в этом файле не прописан
 * руками — панель одинаково корректна в обеих темах.
 *
 * Радиального свечения из исходного приёма тут нет намеренно: акцентная
 * подсветка секций — снятый визуальный штамп (§6 CLAUDE.md), и
 * возвращать его новым семейством нельзя.
 *
 * Кнопки — колонкой справа, а не строкой под заголовком: в исходном
 * приёме под кнопкой стоит примечание («без договора и предоплаты»), и
 * пара «кнопка + сноска» работает как один блок действия напротив
 * текста.
 */
export function Product(props: CtaSection) {
  const {
    id,
    surface = "paper",
    eyebrow,
    title,
    lead,
    actions = [],
    note,
  } = props;

  return (
    <Section id={id} surface={surface} spacing="lg">
      <Container>
        <div
          data-surface="ink"
          className="rounded-card bg-bg px-7 py-12 text-fg md:px-14 md:py-16"
        >
          <div className="grid gap-x-gutter gap-y-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <CtaEyebrow eyebrow={eyebrow} variant="badge" />

              {title ? (
                <h2
                  className={`font-heading section-title-scale ${eyebrow ? "mt-5" : ""}`}
                  data-reveal
                >
                  {title}
                </h2>
              ) : null}

              {lead ? (
                <p
                  className="mt-5 max-w-[52ch] text-lead text-fg-muted"
                  data-reveal
                >
                  {lead}
                </p>
              ) : null}
            </div>

            {actions.length > 0 || note ? (
              // lg:col-start-9 — блок действия прижат к правому краю
              // панели, между ним и текстом остаётся колонка воздуха.
              // Без явного col-start он вставал бы сразу за текстом, и
              // при коротком заголовке кнопка оказывалась посреди панели.
              <div className="lg:col-span-4 lg:col-start-9" data-reveal>
                {/* stacked: колонка узкая (4/12), и ряд кнопок в ней
                    расходился бы по min-content, теряя равную ширину —
                    ровно тот случай, под который у ActionGroup и заведён
                    этот флаг. */}
                <ActionGroup actions={actions} stacked />

                {note ? (
                  <p className="mt-4 text-small text-fg-muted lg:text-center">
                    {note}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default Product;
