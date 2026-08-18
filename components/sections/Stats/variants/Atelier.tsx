import { AtelierHeader } from "@/components/ui/AtelierHeader";
import { Container } from "@/components/ui/Container";
import { SeamGrid, SEAM_CELL, seamTailSpan } from "@/components/ui/SeamGrid";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import type { StatsSection } from "@/types/site";

/**
 * Цифры семейства `atelier`: разграфлённый бланк — решётка на волосяных
 * швах (components/ui/SeamGrid), в каждой клетке крупное число и подпись
 * капителью под ним.
 *
 * Чем отличается от `editorial`, у которого тоже «полоса цифр без
 * карточек»:
 *
 *   • Решётка ЗАМКНУТАЯ и однородная: рамка по периметру, шов в один
 *     пиксель во все стороны. У editorial линии открытые и разной
 *     толщины, потому что там толщина несёт смысл (сплошная — счёт,
 *     волосяная — перечень). Здесь смысла в толщине нет вовсе, смысл
 *     несёт клетка.
 *   • Клетка имеет собственный внутренний воздух (p-7/md:p-9), то есть
 *     это бланк, а не таблица без полей.
 *   • Кегль числа обычный, а не поднятый: клетка сама выделяет цифру, и
 *     разгонять её ещё и ступенью значит выделять дважды.
 *   • Читается `highlight: "accent"` — единственное число, набранное
 *     акцентом. В исходном приёме так выделена последняя метрика
 *     («96% возвращаются»): одна цветная цифра на полосу превращает
 *     ряд равных величин в ряд с выводом. Значение `"tint"` не читается
 *     — тонировка клетки спорила бы со швом.
 *
 * Не читает `icon` (пиктограмма — ровно тот декор, вместо которого здесь
 * работает клетка), `containerVariant` (подложка спорит с решёткой),
 * `image` и `fillLastRow` (растянутая на две колонки клетка рвёт ритм
 * бланка — в отличие от карточной сетки, где пустое место в последнем
 * ряду видно, тут его закрывает сама решётка).
 */
export function Atelier(props: StatsSection) {
  const { id, surface = "paper", number, eyebrow, title, lead, items } = props;

  const hasHeader = Boolean(number || eyebrow || title || lead);

  return (
    <Section id={id} surface={surface}>
      <Container>
        <AtelierHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          className={hasHeader ? "mb-14 md:mb-20" : undefined}
        />

        <SeamGrid as="dl" className="sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={item.label}
              data-reveal
              style={revealDelay(index)}
              className={cn(
                SEAM_CELL,
                // Остаток ряда закрывает последняя клетка: пустой слот в
                // замкнутой решётке — это не воздух, а прямоугольник
                // цвета линии внутри рамки. Подробности — в SeamGrid.
                seamTailSpan(index, items.length, 2, "sm:"),
                seamTailSpan(index, items.length, 4, "lg:"),
              )}
            >
              {/* Число первым ярусом, подпись под ним — как в исходном
                  приёме. Поэтому выравнивать ярусы subgrid'ом (как в
                  Stats/product, где подпись сверху) тут не нужно: числа
                  стоят на верхнем краю клетки и уже на одной линии, а
                  разную длину подписей клетка съедает своей высотой. */}
              <dt
                className={cn(
                  "tabular font-display text-stat",
                  item.highlight === "accent" && "text-accent",
                )}
              >
                {item.value}
                {item.suffix ? (
                  <span
                    className={
                      item.highlight === "accent" ? undefined : "text-fg-muted"
                    }
                  >
                    {item.suffix}
                  </span>
                ) : null}
              </dt>

              <dd className="mt-4 max-w-[22ch] text-caption font-medium uppercase tracking-[0.16em] text-fg-muted">
                {item.label}
              </dd>

              {item.text ? (
                <p className="mt-3 max-w-[34ch] text-small text-fg-muted">
                  {item.text}
                </p>
              ) : null}
            </div>
          ))}
        </SeamGrid>
      </Container>
    </Section>
  );
}

export default Atelier;
