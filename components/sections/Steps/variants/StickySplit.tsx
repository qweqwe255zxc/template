import { Section } from "@/components/ui/Section";
import { StickySplit as SplitLayout } from "@/components/ui/StickySplit";
import { getIcon } from "@/lib/icons";
import { revealDelay } from "@/lib/reveal";
import type { StepsSection } from "@/types/site";

/**
 * Шаги строками справа от залипающего заголовка — член семейства
 * `sticky-split` (общая ось 4/8, см. `ui/StickySplit`).
 *
 * Номер шага стоит в собственной колонке слева от текста, а не бейджем
 * на углу: залипающий заголовок уже держит левую вертикаль страницы, и
 * вторая колонка номеров её продолжает — получается одна сквозная ось,
 * а не два конкурирующих левых края.
 *
 * Фото шага эта раскладка не показывает: строка списка с картинкой
 * превращается в карточку, а для карточек есть cards и cascade.
 */
export function StickySplit(props: StepsSection) {
  const { id, surface = "paper", number, eyebrow, title, lead, items, iconShape } = props;

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <SplitLayout number={number} eyebrow={eyebrow} title={title} lead={lead}>
        <ol>
          {items.map((item, index) => {
            const Icon = getIcon(item.icon);

            return (
              <li
                key={item.number}
                className="grid grid-cols-[auto_1fr] gap-x-5 border-b border-rule py-7 first:border-t sm:gap-x-8 md:py-8"
                data-reveal
                style={revealDelay(index)}
              >
                <span
                  aria-hidden="true"
                  className="tabular font-display text-h3 text-fg-muted"
                >
                  {item.number}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    {Icon ? (
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className="size-5 shrink-0 text-fg-muted"
                      />
                    ) : null}
                    <h3 className="font-heading text-h4">{item.title}</h3>
                  </div>

                  <p className="mt-2 max-w-[62ch] text-body text-fg-muted">{item.text}</p>

                  {item.meta ? (
                    <p className="mt-3 text-small text-fg-muted">{item.meta}</p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </SplitLayout>
    </Section>
  );
}

export default StickySplit;
