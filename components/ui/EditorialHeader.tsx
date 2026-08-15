import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface EditorialHeaderProps {
  /** Индекс раздела («01»). Левый край колонтитула на линейке. */
  number?: string;
  /** Название раздела. Правый край того же колонтитула. */
  eyebrow?: string;
  title?: string;
  lead?: string;
  /**
   * Довесок справа от заголовка: ссылка «весь архив», кнопка, подпись.
   * Ниже md уходит под заголовок, не сжимает его.
   */
  action?: ReactNode;
  className?: string;
}

/**
 * Шапка семейства `variant="editorial"`. Один компонент на все секции
 * семейства — ровно по той же причине, что и `StickySplit.tsx`: колонтитул
 * с индексом раздела повторяется на странице шесть-девять раз подряд, и
 * если отступ над линейкой или кегль индекса разъедутся хотя бы на пиксель
 * между секциями, приём читается как случайность, а не как язык сайта.
 *
 * Три яруса, сверху вниз:
 *
 *   1. Линейка во всю ширину колонки и на ней — колонтитул: индекс слева,
 *      название раздела справа (`justify-between`). Это то, что в исходном
 *      дизайне называлось SectionLabel.
 *   2. Заголовок в верхнем регистре, узкой мерой (~20 знаков в строке).
 *      Кегль — `.section-title-scale`, то есть та же ступень, что у
 *      остальных `*Header`-обёрток шаблона: выключку и меру задаёт эта
 *      раскладка, а размер по-прежнему переключается `theme.titleStyle`.
 *   3. Лид обычным `text-lead`.
 *
 * Верхний регистр — не украшение, а несущая часть приёма: на нём держится
 * контраст между заголовком раздела и строчным набором содержимого,
 * который в этом семействе заменяет карточки и заливки. Шрифт не задаётся
 * вовсе — берётся `font-heading` проекта, как и везде.
 *
 * Почему обе строки колонтитула `break-words`: индекс и название лежат в
 * одной flex-строке, и на 390px длинное название («Как мы работаем») без
 * этого распирает свой flex-item (у него `min-width: auto`) и выносит
 * линейку за край контейнера.
 */
export function EditorialHeader({
  number,
  eyebrow,
  title,
  lead,
  action,
  className,
}: EditorialHeaderProps) {
  if (!number && !eyebrow && !title && !lead && !action) return null;

  const hasKicker = Boolean(number || eyebrow);

  return (
    <header className={className}>
      {hasKicker ? (
        <div
          className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-t border-rule pt-3 text-caption font-medium uppercase text-fg-muted"
          data-reveal
        >
          {number ? (
            <span className="tabular min-w-0 break-words">{number}</span>
          ) : null}
          {eyebrow ? (
            <span className="min-w-0 break-words">{eyebrow}</span>
          ) : null}
        </div>
      ) : null}

      {title || action ? (
        <div
          className={cn(
            "flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10",
            hasKicker && "mt-10 md:mt-14",
          )}
        >
          {title ? (
            <h2
              className="max-w-[20ch] font-heading uppercase section-title-scale"
              data-reveal
            >
              {title}
            </h2>
          ) : null}

          {action ? (
            <div className="md:shrink-0 md:pb-2" data-reveal>
              {action}
            </div>
          ) : null}
        </div>
      ) : null}

      {lead ? (
        <p
          className={cn(
            "max-w-[54ch] text-lead text-fg-muted",
            (title || action) && "mt-6",
            !title && !action && hasKicker && "mt-10",
          )}
          data-reveal
        >
          {lead}
        </p>
      ) : null}
    </header>
  );
}

export default EditorialHeader;
