type Span = 1 | 2;
type Breakpoint = "sm" | "md" | "lg" | "xl";

export type BentoColumns = Partial<Record<Breakpoint, 2 | 3 | 4>>;

/**
 * Спаны для одного ряда сетки шириной `columns` слотов. Карточка
 * растягивается на 2 слота (col-span-2) только там, где это ровно
 * закрывает ширину ряда — не там, где "ещё есть место". Одиночный
 * хвостовой элемент, которому не хватает пары до целого ряда, остаётся
 * в 1 слот (не растягивается вхолостую).
 *
 * Ряды-растяжки идут с начала последовательности, а не с конца: если
 * `total` не делится на `columns` нацело, нужное число рядов вида
 * "2+1+…+1" (сумма = columns) ставится в начало, ориентация
 * (растянутый элемент первым/последним) чередуется через ряд — тот же
 * приём, что даёт зеркальный узор 2×2 в референсе (первый ряд
 * большая+малая, второй — малая+большая). Остаток — обычные ряды по
 * `columns` карточек в 1 слот.
 *
 * Компрессия работает рядами по `columns - 1` элементов (один из них
 * дублируется) — но когда оставшихся элементов меньше, чем нужно для
 * ещё одного такого ряда, цикл компрессии останавливается раньше, чем
 * набирается `need` рядов, и остаётся "хвост" из нескольких элементов,
 * которому не хватает для последнего целого ряда. Этот хвост дотягивают
 * тем же приёмом, что и `lib/gridFill.ts` (`fillLastRowClasses`) —
 * `numToStretch = min(emptySlots, rowItems)` последних элементов
 * хвоста получают span 2 (не больше — растяжка карточки капается на
 * 2 слота), остальные элементы хвоста остаются в 1 слот. Если хвост уже
 * кратен `columns` (компрессия не потребовалась вовсе или полностью
 * покрыла всё, что могла), растягивать нечего — обычные ряды по 1 слоту.
 */
function rowSpans(total: number, columns: number): Span[] {
  if (columns < 2 || total <= 0) return new Array(Math.max(total, 0)).fill(1);

  const need = (columns - (total % columns)) % columns;
  const spans: Span[] = [];
  let placed = 0;
  let row = 0;

  while (row < need && total - placed >= columns - 1) {
    const size = columns - 1;
    const doubleFirst = row % 2 === 0;
    for (let i = 0; i < size; i++) {
      spans.push(doubleFirst ? (i === 0 ? 2 : 1) : i === size - 1 ? 2 : 1);
    }
    placed += size;
    row += 1;
  }

  const remaining = total - placed;
  if (remaining > 0) {
    const rowItems = remaining % columns;
    if (rowItems === 0) {
      for (let i = 0; i < remaining; i++) spans.push(1);
    } else {
      const emptySlots = columns - rowItems;
      const numToStretch = Math.min(emptySlots, rowItems);
      const plainCount = remaining - numToStretch;
      for (let i = 0; i < plainCount; i++) spans.push(1);
      for (let i = 0; i < numToStretch; i++) spans.push(2);
    }
  }

  return spans;
}

const SPAN_CLASS: Record<Breakpoint, Record<Span, string>> = {
  sm: { 1: "sm:col-span-1", 2: "sm:col-span-2" },
  md: { 1: "md:col-span-1", 2: "md:col-span-2" },
  lg: { 1: "lg:col-span-1", 2: "lg:col-span-2" },
  xl: { 1: "xl:col-span-1", 2: "xl:col-span-2" },
};

/**
 * Классы col-span для элемента `index` из `total` в сетке, где число
 * колонок меняется по брейкпоинтам (`columns`, напр. `{ sm: 2, lg: 3 }`).
 * Спаны считаются отдельно на каждом брейкпоинте — раскладка на sm:2 не
 * имеет отношения к тому, что происходит на lg:3.
 */
export function bentoSpan(index: number, total: number, columns: BentoColumns): string {
  return (Object.keys(columns) as Breakpoint[])
    .map((bp) => {
      const count = columns[bp];
      if (!count) return null;
      const span = rowSpans(total, count)[index] ?? 1;
      return SPAN_CLASS[bp][span];
    })
    .filter((value): value is string => Boolean(value))
    .join(" ");
}

type AspectBase = "4/3" | "3/4" | "square";

/**
 * aspect-ratio фиксированного бокса (фото/аватар) масштабируется вместе
 * с шириной col-span-2 — без этого карточка растягивается не только по
 * горизонтали, но и по вертикали (высота бокса растёт вслед за
 * удвоенной шириной), а сосед в том же ряду вытягивается следом за ней
 * через grid align-items: stretch. `calc(var(--bento-span)*W)/H` держит
 * высоту постоянной: множитель --bento-span завязан на те же span'ы,
 * что и `bentoSpan` выше, чтобы бокс расширялся только там, где сама
 * карточка стала в 2 слота.
 */
const ASPECT_CLASS: Record<AspectBase, string> = {
  "4/3": "aspect-[calc(var(--bento-span)*4)/3]",
  "3/4": "aspect-[calc(var(--bento-span)*3)/4]",
  square: "aspect-[calc(var(--bento-span))/1]",
};

const SPAN_VAR_CLASS: Record<Breakpoint, Record<Span, string>> = {
  sm: { 1: "sm:[--bento-span:1]", 2: "sm:[--bento-span:2]" },
  md: { 1: "md:[--bento-span:1]", 2: "md:[--bento-span:2]" },
  lg: { 1: "lg:[--bento-span:1]", 2: "lg:[--bento-span:2]" },
  xl: { 1: "xl:[--bento-span:1]", 2: "xl:[--bento-span:2]" },
};

/**
 * Классы для фиксированного aspect-ratio бокса внутри карточки, которая
 * растягивается через `bentoSpan` (те же `index`/`total`/`columns`) —
 * держит высоту бокса такой же, как у нерастянутых соседей, пока сама
 * карточка становится в 2 раза шире.
 */
export function bentoMediaAspect(
  index: number,
  total: number,
  columns: BentoColumns,
  base: AspectBase,
): string {
  const varClasses = (Object.keys(columns) as Breakpoint[])
    .map((bp) => {
      const count = columns[bp];
      if (!count) return null;
      const span = rowSpans(total, count)[index] ?? 1;
      return SPAN_VAR_CLASS[bp][span];
    })
    .filter((value): value is string => Boolean(value));

  return ["[--bento-span:1]", ...varClasses, ASPECT_CLASS[base]].join(" ");
}
