import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { EditorialHeader } from "@/components/ui/EditorialHeader";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { getIcon } from "@/lib/icons";
import { revealDelay } from "@/lib/reveal";
import { FeatureContent } from "../parts/FeatureContent";
import type { FeaturesSection } from "@/types/site";

/**
 * Услуги семейства `editorial`: нумерованный перечень на волосяных
 * линейках, без карточек и без вертикальных разделителей.
 *
 * Чем отличается от `table`, хотя обе «линейки без карточек»:
 *
 *   - Линию держит КАЖДАЯ ячейка своим `border-t`, а не сетка
 *     разделителями между колонками. Поэтому колонки разделяет только
 *     воздух (`gap-x-gutter`), а ряды — сама линия: ровно тот приём, на
 *     котором держится исходная раскладка.
 *   - У ячейки есть индекс («01») над заголовком — он и делает перечень
 *     перечнем. Берётся из `item.number`, а если его нет — из позиции.
 *   - Ряды не выравниваются по высоте и не нуждаются в этом: нижнего
 *     края у ячейки нет, следующий ряд отбивает собственная линия.
 *
 * Ссылка `item.link` рисуется строкой внизу ячейки, а не стрелкой в
 * углу (как в `table`): в этой раскладке правый верхний угол занят
 * воздухом между колонками, и абсолютная стрелка там висела бы в пустоте.
 * `mt-auto` работает потому, что ячейка — растянутая grid-колонка с
 * `flex-col`, то есть ссылки встают на одну линию по всему ряду.
 *
 * ВАЖНО: как и `table`, вариант несовместим с `photo` на элементах —
 * границы рисует не карточка, и высота картинки произвольного размера
 * рвёт линию ряда. Роутер (../index.tsx) уводит такую секцию в `cards`.
 */
export function Editorial(props: FeaturesSection) {
  const {
    id,
    surface = "surface",
    columns = 3,
    number,
    eyebrow,
    title,
    lead,
    items,
    iconShape,
  } = props;

  const ArrowIcon = items.some((item) => item.link)
    ? getIcon("arrowUpRight")
    : null;

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <Container>
        <EditorialHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
        />

        {/* gap-y-0: зазор между рядами не нужен — ряды отбивает линия
            каждой ячейки, а вертикальный воздух даёт pb-12 внутри неё.
            Отдельный gap-y добавил бы к нему второй отступ, и линия
            следующего ряда отъехала бы от текста предыдущего вдвое. */}
        <div
          className={cn(
            "mt-14 grid gap-x-gutter gap-y-0 md:mt-20",
            columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {items.map((item, index) => (
            <div
              key={item.title}
              data-reveal
              style={revealDelay(index % columns)}
              className="flex flex-col border-t border-rule pt-6 pb-12"
            >
              <p className="tabular mb-6 text-caption font-medium uppercase text-fg-muted">
                {item.number ?? String(index + 1).padStart(2, "0")}
              </p>

              <FeatureContent item={item} />

              {item.link ? (
                <Link
                  href={item.link.href}
                  className="mt-auto inline-flex items-center gap-2 pt-8 text-caption font-medium uppercase text-fg-muted transition-colors hover:text-fg"
                >
                  {item.link.label}
                  {ArrowIcon ? (
                    <ArrowIcon
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="size-4"
                    />
                  ) : null}
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default Editorial;
