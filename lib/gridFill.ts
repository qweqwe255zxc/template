/**
 * Растягивание карточек последнего неполного ряда сетки — общая логика
 * для всех карточных grid-вариантов (Stats/Features/Steps/Gallery/
 * Testimonials/Team/Pricing). Управляется пропом `fillLastRow` (дефолт
 * `true`) на самой секции — см. docs/section-system.md.
 *
 * Алгоритм на последний неполный ряд: emptySlots = cols - (total % cols);
 * растягиваются последние min(emptySlots, rowItems) карточек, каждая на
 * +1 к span, но не больше col-span-2 суммарно. Пример (cols=4): 1 item в
 * ряду → одна карточка col-span-2 (максимум, 2 слота остаются пустыми);
 * 2 item → обе col-span-2 (заполняют ряд); 3 item → только последняя
 * col-span-2, остальные без изменений (заполняют ряд).
 *
 * Классы — литеральные строки в лукап-таблице, а не собранные шаблонной
 * строкой: Tailwind-сканер ищет кандидатов по тексту исходника, и
 * динамически сконструированное имя класса (`` `${prefix}col-span-2` ``)
 * он не увидит — утилита просто не попадёт в сборку.
 *
 * У растянутой карточки, чья высота держится на фиксированном
 * aspect-ratio боксе (фото/аватар), голый col-span-2 удваивает не только
 * ширину, но и высоту (aspect-ratio считает высоту от ширины) — карточка
 * из «1×1» превращается в «2×2» вместо нужной «2×1» (только ширина).
 * `fillLastRowAspectClasses` растягивает тот же список брейкпоинтов, но
 * вместо col-span подставляет удвоенный по ширине aspect-ratio (`w/h` →
 * `2w/h`) — тогда height = width/(w/h) остаётся той же, что у
 * нерастянутых соседей (высота = ширина/(w/h); при удвоенной ширине и
 * соотношении 2w/h высота = 2·ширина/(2w/h) = ширина·h/w — то же самое).
 */

export type FillBreakpoint = {
  prefix: "" | "sm:" | "md:" | "lg:" | "xl:";
  cols: number;
};

const SPAN_2: Record<FillBreakpoint["prefix"], string> = {
  "": "col-span-2",
  "sm:": "sm:col-span-2",
  "md:": "md:col-span-2",
  "lg:": "lg:col-span-2",
  "xl:": "xl:col-span-2",
};

const SPAN_1: Record<FillBreakpoint["prefix"], string> = {
  "": "col-span-1",
  "sm:": "sm:col-span-1",
  "md:": "md:col-span-1",
  "lg:": "lg:col-span-1",
  "xl:": "xl:col-span-1",
};

/**
 * Пара классов aspect-ratio: `base` — исходное соотношение карточек
 * секции, `wide` — то же соотношение с удвоенным по ширине числителем
 * (держит высоту растянутой карточки равной высоте нерастянутых
 * соседей). Оба поля — полные лукап-таблицы по брейкпоинтам, как
 * `SPAN_1`/`SPAN_2` — по той же причине (сканер Tailwind должен увидеть
 * готовую строку класса в исходнике).
 */
export type AspectPair = {
  base: Record<FillBreakpoint["prefix"], string>;
  wide: Record<FillBreakpoint["prefix"], string>;
};

/** Портретный бокс 3/4 (аватары Team) → 3/2 при растяжении в 2 колонки. */
export const ASPECT_PAIR_3_4: AspectPair = {
  base: {
    "": "aspect-[3/4]",
    "sm:": "sm:aspect-[3/4]",
    "md:": "md:aspect-[3/4]",
    "lg:": "lg:aspect-[3/4]",
    "xl:": "xl:aspect-[3/4]",
  },
  wide: {
    "": "aspect-[3/2]",
    "sm:": "sm:aspect-[3/2]",
    "md:": "md:aspect-[3/2]",
    "lg:": "lg:aspect-[3/2]",
    "xl:": "xl:aspect-[3/2]",
  },
};

/**
 * Точная (с поправкой на gap) версия ASPECT_PAIR_3_4 для карточек, где
 * aspect-ratio держит ВСЮ высоту карточки целиком (не только фото
 * внутри неё) — как у Team/Bento. Голая математика ASPECT_PAIR_3_4
 * (просто удвоенный числитель, 3/4 → 3/2) не учитывает gap между
 * колонками: реальная ширина растянутой (col-span-2) карточки равна
 * 2×колонка + gap, а не ровно 2×колонка, из-за чего высота получается
 * на 2·gap/3 больше соседей, когда растянутая карточка остаётся одна в
 * своём ряду и её не с кем выровнять через grid's align-items:stretch
 * (при gap-6/1.5rem это заметные 16px).
 *
 * Пробовали чинить через CSS Container Queries (height: cqw-calc) —
 * computed style считался верно, но реальная отрисовка в Chrome не
 * совпадала с layout (см. lib/gridFill.ts git-историю и память
 * gridfill_container_query_paint_bug) — растянутая карточка красилась
 * в старой узкой ширине. Откачено.
 *
 * Здесь вместо aspect-ratio/cqw — классический padding-top hack:
 * проценты в padding-top/-bottom считаются от ширины containing block
 * (по спеке CSS с версии 1) — та же самооталкивающаяся арифметика, что
 * нужна была от cqw, но без Container Queries и без их паринт-бага.
 * base = 133.333% (= aspect-[3/4], h = w·4/3). wide = 66.6667% − 16px
 * (= (2·колонка+gap)·2/3 приведено к проценту от собственной ширины
 * карточки минус фиксированная поправка на gap — та же формула, что
 * была в cqw-версии, просто без cqw). Требует на самой карточке height:
 * auto (не aspect-ratio, не h-*) — только padding-top задаёт высоту,
 * контент внутри должен быть position:absolute (Image fill + оверлей),
 * чтобы не добавлять content-height поверх padding. Калибровано под
 * gap-6 (1.5rem) — при другом gap у сетки нужна отдельная константа.
 */
export const ASPECT_PAIR_3_4_PAD_GAP_6: AspectPair = {
  base: {
    "": "pt-[133.333%]",
    "sm:": "sm:pt-[133.333%]",
    "md:": "md:pt-[133.333%]",
    "lg:": "lg:pt-[133.333%]",
    "xl:": "xl:pt-[133.333%]",
  },
  wide: {
    "": "pt-[calc(66.6667%_-_16px)]",
    "sm:": "sm:pt-[calc(66.6667%_-_16px)]",
    "md:": "md:pt-[calc(66.6667%_-_16px)]",
    "lg:": "lg:pt-[calc(66.6667%_-_16px)]",
    "xl:": "xl:pt-[calc(66.6667%_-_16px)]",
  },
};

/** Альбомное фото 4/3 (Features/Pricing/Gallery/Steps) → 8/3 при растяжении. */
export const ASPECT_PAIR_4_3: AspectPair = {
  base: {
    "": "aspect-[4/3]",
    "sm:": "sm:aspect-[4/3]",
    "md:": "md:aspect-[4/3]",
    "lg:": "lg:aspect-[4/3]",
    "xl:": "xl:aspect-[4/3]",
  },
  wide: {
    "": "aspect-[8/3]",
    "sm:": "sm:aspect-[8/3]",
    "md:": "md:aspect-[8/3]",
    "lg:": "lg:aspect-[8/3]",
    "xl:": "xl:aspect-[8/3]",
  },
};

/** Квадратный бокс (Team tags-cards) → 2/1 при растяжении. */
export const ASPECT_PAIR_SQUARE: AspectPair = {
  base: {
    "": "aspect-square",
    "sm:": "sm:aspect-square",
    "md:": "md:aspect-square",
    "lg:": "lg:aspect-square",
    "xl:": "xl:aspect-square",
  },
  wide: {
    "": "aspect-[2/1]",
    "sm:": "sm:aspect-[2/1]",
    "md:": "md:aspect-[2/1]",
    "lg:": "lg:aspect-[2/1]",
    "xl:": "xl:aspect-[2/1]",
  },
};

/**
 * Общий проход по брейкпоинтам: для каждого элемента решает, растянут
 * он на этом брейкпоинте или нет, и на транзициях (когда состояние
 * меняется относительно предыдущего брейкпоинта) запрашивает класс через
 * `classFor`. Один и тот же проход используют и col-span (`fillLastRowClasses`),
 * и aspect-ratio (`fillLastRowAspectClasses`) — сама логика «кто растянут»
 * не должна дублироваться и расходиться между ними.
 */
function computeTransitionClasses(
  total: number,
  breakpoints: readonly FillBreakpoint[],
  classFor: (prefix: FillBreakpoint["prefix"], stretched: boolean) => string,
): string[] {
  const classes = new Array<string>(total).fill("");
  if (total === 0) return classes;

  const currentlyStretched = new Array<boolean>(total).fill(false);

  for (const { prefix, cols } of breakpoints) {
    if (cols <= 1) continue;

    const rowItems = total % cols;
    let stretchStart = total;
    if (rowItems !== 0) {
      const emptySlots = cols - rowItems;
      const numToStretch = Math.min(emptySlots, rowItems);
      stretchStart = total - numToStretch;
    }

    for (let i = 0; i < total; i++) {
      const target = i >= stretchStart;
      if (target !== currentlyStretched[i]) {
        const cls = classFor(prefix, target);
        classes[i] = classes[i] ? `${classes[i]} ${cls}` : cls;
        currentlyStretched[i] = target;
      }
    }
  }

  return classes;
}

/**
 * Брейкпоинты — по возрастанию ширины, в том же порядке, что и классы
 * `grid-cols-*` самой сетки (mobile-first: каждый следующий брейкпоинт
 * переопределяет предыдущий на своей ширине и выше).
 *
 * Возвращает массив длиной `total`: className для каждого элемента
 * (пустая строка — без изменений). Индекс — позиция в исходном массиве
 * items, без исключений (bento-варианты передают сюда только «хвост»
 * после первой крупной карточки).
 */
export function fillLastRowClasses(
  total: number,
  breakpoints: readonly FillBreakpoint[],
): string[] {
  return computeTransitionClasses(total, breakpoints, (prefix, stretched) =>
    stretched ? SPAN_2[prefix] : SPAN_1[prefix],
  );
}

/**
 * Тот же расчёт «кто растянут», что у `fillLastRowClasses`, но вместо
 * col-span отдаёт aspect-ratio-класс из `pair` — для карточек, чья
 * высота идёт от фиксированного aspect-ratio бокса (фото/аватар). Вызов
 * должен получать ровно те же `total`/`breakpoints`, что и парный
 * `fillLastRowClasses` для той же сетки — иначе массивы разъедутся по
 * индексам.
 */
export function fillLastRowAspectClasses(
  total: number,
  breakpoints: readonly FillBreakpoint[],
  pair: AspectPair,
): string[] {
  return computeTransitionClasses(total, breakpoints, (prefix, stretched) =>
    stretched ? pair.wide[prefix] : pair.base[prefix],
  );
}
