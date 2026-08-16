import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ProductHeader } from "@/components/ui/ProductHeader";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { fillLastRowClasses } from "@/lib/gridFill";
import { getIcon } from "@/lib/icons";
import { revealDelay } from "@/lib/reveal";
import type { StatsSection } from "@/types/site";

const GRID_BREAKPOINTS = [
  { prefix: "sm:", cols: 2 },
  { prefix: "lg:", cols: 4 },
] as const;

/**
 * Цифры семейства `product`: карточки-метрики, как в панели приложения.
 *
 * Порядок внутри карточки перевёрнут относительно остальных карточных
 * вариантов Stats (`badge`, `plain`, `bento`): там сверху иконка, под ней
 * число, под ним подпись. Здесь сверху ПОДПИСЬ капителью, под ней число,
 * под ним пояснение — так метрику подают в дашбордах, и это главное, чем
 * раскладка отличается от соседей по секции. Иконка при этом уходит в
 * правый верхний угол строки с подписью и не отнимает у числа первую
 * позицию.
 *
 * Число всегда `tabular` и в стат-ступени: в этом семействе цифра —
 * товар, и она обязана читаться одинаково во всех четырёх карточках,
 * включая случай, когда в одной «96 млрд», а в другой «99,98%».
 *
 * `highlight` вариант не читает: акцентная рамка и тонировка — ручка
 * `bento`, где карточки заведомо разного размера и одну надо выделить.
 * Здесь ряд равноправных метрик, и выделенная карточка читалась бы как
 * «эта цифра настоящая, остальные так себе».
 */
export function Product(props: StatsSection) {
  const {
    id,
    surface = "surface",
    number,
    eyebrow,
    title,
    lead,
    items,
    fillLastRow = true,
  } = props;

  const spanClasses = fillLastRow
    ? fillLastRowClasses(items.length, GRID_BREAKPOINTS)
    : [];

  const hasHeader = Boolean(number || eyebrow || title || lead);

  return (
    <Section id={id} surface={surface}>
      <Container>
        <ProductHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          className={hasHeader ? "mb-12 md:mb-16" : undefined}
        />

        {/* Ряды карточки — subgrid, и это не украшение. Подписи у метрик
            разной длины: на 1024 «минут на сборку прототипа» занимает три
            строки, а «84 варианта секций» одну, и числа под ними вставали
            на трёх разных высотах (замерено: 1282 / 1289 / 1304). В ряду
            равноправных цифр это читается как сбой (§1.5, п. 4).

            Почему именно subgrid, а не min-h у подписи: любой пол высоты —
            фиксированный размер, запрещённый тем же §1.5 (п. 3), и он
            всё равно врёт при четвёртой строке. Subgrid же выравнивает
            ярусы ПО ФАКТУ самого высокого в ряду: каждая карточка
            занимает три строки внешней сетки (подпись, число, пояснение),
            и высоту каждого яруса задаёт сетка, а не карточка.

            gap-y-5 на карточке перебивает унаследованный от внешней сетки
            gap-y-6 для её ВНУТРЕННИХ рядов — иначе между подписью и
            числом встал бы зазор, рассчитанный на промежуток между
            карточками. */}
        <dl className="grid gap-x-gutter gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = getIcon(item.icon);

            return (
              <Card
                key={item.label}
                variant="framed"
                data-reveal
                style={revealDelay(index)}
                className={cn(
                  "row-span-3 grid grid-rows-subgrid gap-y-5",
                  spanClasses[index] || undefined,
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-caption font-medium uppercase text-fg-muted">
                    {item.label}
                  </dt>

                  {Icon ? (
                    // shrink-0 у плашки: подпись слева переносится, а
                    // плашка обязана остаться квадратной — без этого в
                    // карточке с длинной подписью иконка сплющивалась в
                    // овал.
                    <span className="icon-tile flex shrink-0 items-center justify-center">
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className="size-5"
                      />
                    </span>
                  ) : null}
                </div>

                {/* Вертикальные отступы у ярусов сняты: расстояние между
                    ними задаёт gap-y-5 subgrid-сетки. mt-* тут прибавлялся
                    бы к нему и ломал бы то самое выравнивание, ради
                    которого subgrid и заведён. */}
                <dd className="tabular self-start font-display text-stat">
                  {item.value}
                  {item.suffix ? (
                    <span className="text-accent">{item.suffix}</span>
                  ) : null}
                </dd>

                {item.text ? (
                  <p className="self-start text-small text-fg-muted">
                    {item.text}
                  </p>
                ) : null}
              </Card>
            );
          })}
        </dl>
      </Container>
    </Section>
  );
}

export default Product;
