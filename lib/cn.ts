import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

export type { ClassValue };

/**
 * Кастомные размерные утилиты из `@theme inline` в app/globals.css
 * (--text-h1 … --text-caption). Без этого списка tailwind-merge о них не
 * знает и разбирает по префиксу: `text-caption` (размер) и `text-accent-fg`
 * (цвет) попадают в одну группу "text-*" как конфликтующие, и один из них
 * молча пропадает — размер слетал у featured-карточки Pricing/ribbon.
 *
 * Список обязан совпадать с набором --text-* в globals.css: добавили токен
 * туда — добавьте сюда, иначе тихая потеря класса вернётся. Проверка одной
 * строкой:
 *   grep -oE '^\s*--text-[a-z0-9]+:' app/globals.css | sort -u
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-h1",
        "text-h2",
        "text-h3",
        "text-h4",
        "text-lead",
        "text-body",
        "text-small",
        "text-caption",
        "text-button",
        "text-quote",
        "text-stat",
      ],
    },
  },
});

/** clsx + tailwind-merge: конфликтующие tailwind-классы схлопываются в последний. */
export function cn(...values: ClassValue[]): string {
  return twMerge(clsx(values));
}
