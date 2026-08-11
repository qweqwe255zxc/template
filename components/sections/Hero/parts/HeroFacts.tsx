import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import type { HeroFact } from "@/types/site";

/**
 * Раскладка рассчитана на 3 колонки. Деление на строки идёт по остатку от
 * columns, не по позиции в массиве: при 4+ фактах вторая строка сетки
 * повторяет то же правило, что и первая — левый край строки без border-l,
 * сама строка (кроме самой первой) со своим border-t, которого нет у ячеек
 * первой строки (её сверху отделяет рамка `<dl>`). В одну колонку строк без
 * границы не нужно — линию задаёт каждая ячейка, кроме самой первой (та так
 * же держит рамку `<dl>`).
 *
 * columns=1 — для контекстов, где колонок нет вовсе ни на одном экране.
 *
 * from — с какого брейкпоинта разворачиваются три колонки. Дефолт sm
 * (640px) годится, когда полоса лежит в контейнере страницы. Poster кладёт
 * её в панель шириной в половину окна: между md и lg это 384–512px, где
 * три колонки с px-8 оставляют ~40px контента на ячейку, — там нужен lg.
 * Классы перечислены литералами, а не собираются из префикса: сканер
 * Tailwind не видит строки, склеенные в рантайме.
 */
const COLUMN_CLASSES = {
  sm: {
    grid: "sm:grid-cols-3",
    firstRow: "sm:border-t-0",
    restRow: "sm:border-t sm:border-rule",
    firstCol: "sm:pr-8",
    restCol: "sm:border-l sm:pl-8 sm:pr-8",
  },
  lg: {
    grid: "lg:grid-cols-3",
    firstRow: "lg:border-t-0",
    restRow: "lg:border-t lg:border-rule",
    firstCol: "lg:pr-8",
    restCol: "lg:border-l lg:pl-8 lg:pr-8",
  },
} as const;

type FactsFrom = keyof typeof COLUMN_CLASSES;

function factCell(index: number, columns: 1 | 3, from: FactsFrom): string {
  const isFirstCol = index % columns === 0;
  const isFirstRow = index < columns;
  const parts = ["py-6"];

  if (index !== 0) parts.push("border-t border-rule");

  if (columns === 3) {
    const c = COLUMN_CLASSES[from];
    parts.push(isFirstRow ? c.firstRow : c.restRow);
    parts.push(isFirstCol ? c.firstCol : c.restCol);
  }

  return parts.join(" ");
}

export function HeroFacts({
  facts,
  columns = 3,
  from = "sm",
}: {
  facts: HeroFact[];
  /** Колонок на from+. 1 — держать список в одну колонку на любой ширине. */
  columns?: 1 | 3;
  /** Брейкпоинт, с которого разворачиваются колонки. */
  from?: FactsFrom;
}) {
  if (facts.length === 0) return null;

  return (
    <dl
      className={cn(
        "mt-10 grid border-t border-rule md:mt-14",
        columns === 3 && COLUMN_CLASSES[from].grid,
      )}
      data-reveal
      style={revealDelay(3)}
    >
      {facts.map((fact, index) => (
        <div key={fact.value} className={factCell(index, columns, from)}>
          <dt className="font-display text-h3">{fact.value}</dt>
          <dd className="mt-2 text-small text-fg-muted">{fact.label}</dd>
        </div>
      ))}
    </dl>
  );
}

export default HeroFacts;
