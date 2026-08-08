import { fillLastRowClasses, type FillBreakpoint } from "@/lib/gridFill";

/**
 * Раскладка сетки тарифов: количество колонок на каждом брейкпоинте не
 * должно превышать число тарифов — иначе последняя (неполная) строка
 * растягивает только часть карточек (`lib/gridFill.ts`), и 2 тарифа в
 * 3-колоночной сетке делятся не 50/50, а 1/3 + 2/3.
 *
 * Литеральная таблица классов, а не шаблонная строка — сканер Tailwind
 * ищет кандидатов по тексту исходника (та же причина, что у
 * SPAN_1/SPAN_2 в lib/gridFill.ts).
 */
const GRID_COLS: Record<FillBreakpoint["prefix"], Record<number, string>> = {
  "": { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3" },
  "sm:": { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" },
  "md:": { 1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3" },
  "lg:": { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3" },
  "xl:": { 1: "xl:grid-cols-1", 2: "xl:grid-cols-2", 3: "xl:grid-cols-3" },
};

/**
 * `naturalBreakpoints` — колонки варианта, если бы тарифов было много
 * (обычно `[{md: 3}]` или `[{sm: 2}, {lg: 3}]`). Каждый брейкпоинт
 * ограничивается сверху числом тарифов: при 2 тарифах и natural md:3
 * контейнер получает md:2, а не md:3 — сетка никогда не «шире» набора
 * карточек. После этого прогон через fillLastRowClasses безопасен и на
 * ≤3 тарифах (cols === count → последняя строка полная, растяжки нет —
 * ровный сплит), и на большем числе (переполнение в несколько строк —
 * прежнее поведение растяжки хвоста).
 */
export function pricingGridLayout(
  count: number,
  naturalBreakpoints: readonly FillBreakpoint[],
): { containerClass: string; spanClasses: string[]; breakpoints: FillBreakpoint[] } {
  const cappedBreakpoints = naturalBreakpoints.map((bp) => ({
    ...bp,
    cols: Math.min(bp.cols, count),
  }));

  const containerClass = cappedBreakpoints
    .map((bp) => GRID_COLS[bp.prefix][bp.cols])
    .join(" ");

  const spanClasses = fillLastRowClasses(count, cappedBreakpoints);

  return { containerClass, spanClasses, breakpoints: cappedBreakpoints };
}

export default pricingGridLayout;
