import { Container } from "@/components/ui/Container";
import { EditorialHeader } from "@/components/ui/EditorialHeader";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { getIcon } from "@/lib/icons";
import { revealDelay } from "@/lib/reveal";
import type { StepsSection } from "@/types/site";

/**
 * Сколько шагов встаёт в ряд. Литеральные классы, а не шаблонная строка:
 * сканер Tailwind ищет кандидатов по тексту исходника и склеенное в
 * рантайме `lg:grid-cols-${n}` не увидит (та же причина, что у
 * GRID_COLS в Pricing/pricingGrid.ts).
 *
 * Потолок разный по брейкпоинтам, потому что ширина колонки, а не число
 * шагов, решает читаемость: пять колонок на 1024px — это 180px на шаг,
 * где заголовок «Рабочая документация» рвётся на четыре строки. Поэтому
 * пятая колонка появляется только с xl (1280px), а до неё пять шагов
 * честно ложатся 3+2 — каждая ячейка держит свою линию сверху, и второй
 * ряд выглядит так же, как первый.
 */
const LG_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
};

const XL_COLS: Record<number, string> = {
  1: "xl:grid-cols-1",
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
  5: "xl:grid-cols-5",
};

/**
 * Этапы семейства `editorial`: шаги в ряд на СПЛОШНОЙ линейке
 * (`border-rule-strong`), а не на волосяной, как услуги. Это не
 * случайность и не вкусовщина: на странице, где всё держится на линиях,
 * разная толщина линии — единственный способ отличить «перечень услуг»
 * от «последовательности этапов», не добавляя ни карточек, ни заливок.
 *
 * Устройство ячейки:
 *
 *   - верхняя строка: номер шага слева, `meta` (срок) справа — обе
 *     капителью на одной базовой линии, как колонтитул раздела;
 *   - заголовок и описание под ней.
 *
 * Поэтому `parts/StepContent.tsx` тут не используется: он рисует `meta`
 * под описанием, а вся суть этой раскладки — что срок стоит В ОДНОЙ
 * СТРОКЕ с номером и читается вместе с ним. Общий кусок пришлось бы
 * параметризовать флагом «где meta», а это уже два разных компонента в
 * одном файле.
 *
 * `item.icon` рисуется голым глифом перед номером, без `.icon-tile` —
 * тот же осознанный отказ от плашки, что у Stats/plain: акцентная
 * плашка в «Стандарте» перебила бы линию, на которой держится ряд.
 * Именно поэтому вариант не читает `iconShape` (форма плашки), но саму
 * иконку не теряет.
 */
export function Editorial(props: StepsSection) {
  const { id, surface = "paper", number, eyebrow, title, lead, items } = props;

  const columns = {
    sm: Math.min(items.length, 2),
    lg: Math.min(items.length, 3),
    xl: Math.min(items.length, 5),
  };

  return (
    <Section id={id} surface={surface}>
      <Container>
        <EditorialHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
        />

        {/* gap-y-10: в отличие от услуг, у шага нет собственного нижнего
            паддинга (описание — последний ярус ячейки), и без зазора
            линия следующего ряда легла бы вплотную к тексту предыдущего. */}
        <ol
          className={cn(
            "mt-14 grid gap-x-gutter gap-y-10 md:mt-20",
            columns.sm === 2 && "sm:grid-cols-2",
            LG_COLS[columns.lg],
            XL_COLS[columns.xl],
          )}
        >
          {items.map((item, index) => {
            const Icon = getIcon(item.icon);

            return (
              <li
                key={item.number}
                data-reveal
                style={revealDelay(index)}
                className="border-t border-rule-strong pt-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-caption font-medium uppercase text-fg-muted">
                  <span className="tabular flex min-w-0 items-baseline gap-2 break-words">
                    {Icon ? (
                      // self-center: иконка — не текст, у неё нет базовой
                      // линии, и по items-baseline она садилась бы нижним
                      // краем на линию цифры, то есть выше неё.
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className="size-4 shrink-0 self-center"
                      />
                    ) : null}
                    {item.number}
                  </span>
                  {item.meta ? (
                    <span className="min-w-0 break-words">{item.meta}</span>
                  ) : null}
                </div>

                <h3 className="mt-7 max-w-[22ch] font-display text-h3">
                  {item.title}
                </h3>
                <p className="mt-3 text-body text-fg-muted">{item.text}</p>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}

export default Editorial;
