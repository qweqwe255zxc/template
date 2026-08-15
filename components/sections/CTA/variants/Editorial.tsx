import { ActionGroup } from "@/components/ui/ActionGroup";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { CtaSection } from "@/types/site";

/**
 * Замыкающий блок семейства `editorial`: тёмная полоса во всю ширину,
 * крупный заголовок в верхнем регистре слева (7/12), лид с кнопками —
 * справа (5/12), обе колонки выровнены по НИЖНЕМУ краю. Ниже `lg` —
 * одна колонка (почему именно lg, а не md, — в комментарии у сетки).
 *
 * Поверхность по умолчанию — `ink`, а не `accent`, как у остальных
 * вариантов CTA. Приём монохромный: страница целиком собрана из линий
 * на бумаге, и единственная остановка в ней — переворот бумаги в
 * чернила, а не заливка цветом. Поле `surface` при этом обычное, и
 * проекту, которому нужен акцентный финал, достаточно поставить
 * `surface: "accent"` в конфиге.
 *
 * Заголовок — `text-h1`, а не `.section-title-scale`: этот блок не
 * раздел страницы, а её последний разворот, и по кеглю он обязан
 * встать вровень с первым экраном, а не с шапками разделов между ними.
 * Побочный плюс — вариант не зависит от `theme.titleStyle` и не несёт
 * ловушки `centered`/`boxed` (docs/section-system.md, раздел 1).
 *
 * `eyebrow` читается колонтитулом на линейке над заголовком — тем же
 * ярусом, что и у всех остальных секций семейства. `band`/`quiet`
 * `eyebrow` не показывают вовсе, так что новое поведение ничего не
 * ломает.
 */
export function Editorial(props: CtaSection) {
  const { id, surface = "ink", eyebrow, title, lead, actions = [], note } = props;

  return (
    <Section id={id} surface={surface} spacing="lg">
      <Container>
        {eyebrow ? (
          <p
            className="mb-10 border-t border-rule pt-3 text-caption font-medium uppercase text-fg-muted md:mb-14"
            data-reveal
          >
            {eyebrow}
          </p>
        ) : null}

        {/* Две колонки только с lg, а не с md. На 768px левая колонка 7/12
            — это ~430px, куда text-h1 не помещается без переносов посреди
            слова, а правая (лид + кнопки + сноска) выходит ВЫШЕ левой:
            items-end честно роняет заголовок вниз, и над ним остаётся
            двести пустых пикселей. Ниже lg раскладка складывается в одну
            колонку, где тот же порядок читается сам собой. */}
        <div className="grid gap-x-gutter gap-y-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7" data-reveal>
            {title ? (
              <h2 className="max-w-[16ch] break-words font-heading text-h1 uppercase">
                {title}
              </h2>
            ) : null}
          </div>

          {lead || actions.length > 0 || note ? (
            <div className="lg:col-span-5" data-reveal>
              {lead ? (
                <p className="mb-8 max-w-[42ch] text-lead text-fg-muted">
                  {lead}
                </p>
              ) : null}

              <ActionGroup actions={actions} align="start" />

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

export default Editorial;
