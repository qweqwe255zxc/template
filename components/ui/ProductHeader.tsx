import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ProductHeaderProps {
  /** Индекс раздела. Встаёт перед колонтитулом, тем же кеглем, но приглушённо. */
  number?: string;
  /** Короткая подпись НАД заголовком — единственное акцентное место шапки. */
  eyebrow?: string;
  title?: string;
  lead?: string;
  /**
   * Кнопка или ссылка справа от заголовка, по нижнему краю. Ниже md
   * уходит под текст, заголовок не сжимает.
   */
  action?: ReactNode;
  /**
   * start (по умолчанию) — шапка по левому краю, лид в узкой мере.
   * center — всё по центру: так в исходном приёме набран блок тарифов,
   * где под шапкой стоит переключатель периода и колонки цен читаются
   * симметрично. `action` в этом режиме встаёт под лидом, а не сбоку.
   */
  align?: "start" | "center";
  className?: string;
}

/**
 * Шапка семейства `variant="product"`. Один компонент на все секции
 * семейства — по той же причине, что `StickySplit.tsx` и
 * `EditorialHeader.tsx`: шапка повторяется на странице десять-двенадцать
 * раз, и разъехавшийся на пиксель отступ или другой цвет колонтитула
 * превращают сквозной приём в набор похожих секций.
 *
 * Чем отличается от общего `components/ui/SectionHeader.tsx`, который
 * используют «эконом»-варианты:
 *
 *   1. Колонтитул АКЦЕНТНЫЙ и стоит прямо над заголовком, а не приглушённым
 *      текстом на левом поле в 3/12. Это опознавательный знак семейства:
 *      единственное цветное пятно в шапке раздела.
 *   2. Линейки сверху нет вовсе. Разделяют разделы поверхности (§3
 *      CLAUDE.md) и воздух, а не правило — иначе карточки внутри секции
 *      конкурируют с линейкой над ними за роль границы.
 *   3. Есть слот `action` справа по нижнему краю — в исходном приёме так
 *      набран блок кейсов («Все кейсы» рядом с заголовком).
 *
 * Кегль заголовка — `.section-title-scale`, то есть только масштаб:
 * выключку решает `align` этой шапки, а не глобальный `theme.titleStyle`.
 * Так у семейства остаётся одна ось выравнивания вместо двух
 * конкурирующих.
 */
export function ProductHeader({
  number,
  eyebrow,
  title,
  lead,
  action,
  align = "start",
  className,
}: ProductHeaderProps) {
  if (!number && !eyebrow && !title && !lead && !action) return null;

  const centered = align === "center";
  const hasKicker = Boolean(number || eyebrow);

  const textBlock = (
    <div className={cn("min-w-0", centered && "flex flex-col items-center")}>
      {hasKicker ? (
        <p
          className={cn(
            "flex flex-wrap items-baseline gap-x-3 gap-y-1 text-caption font-bold uppercase tracking-[0.08em]",
            centered && "justify-center",
          )}
          data-reveal
        >
          {number ? (
            <span className="tabular text-fg-muted">{number}</span>
          ) : null}
          {eyebrow ? <span className="text-accent">{eyebrow}</span> : null}
        </p>
      ) : null}

      {title ? (
        <h2
          className={cn(
            "font-heading section-title-scale",
            hasKicker && "mt-4",
            centered && "text-center",
          )}
          data-reveal
        >
          {title}
        </h2>
      ) : null}

      {lead ? (
        <p
          className={cn(
            "max-w-[58ch] text-lead text-fg-muted",
            title || hasKicker ? "mt-5" : undefined,
            centered && "text-center",
          )}
          data-reveal
        >
          {lead}
        </p>
      ) : null}
    </div>
  );

  if (centered) {
    return (
      <header className={cn("flex flex-col items-center", className)}>
        {textBlock}
        {action ? (
          <div className="mt-8" data-reveal>
            {action}
          </div>
        ) : null}
      </header>
    );
  }

  return (
    <header
      className={cn(
        // items-end, а не items-baseline: справа стоит кнопка, а у неё
        // базовая линия внутри своей коробки — по ней ряд разъезжается
        // на высоту паддинга кнопки.
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10",
        className,
      )}
    >
      {textBlock}
      {action ? (
        <div className="md:shrink-0 md:pb-1" data-reveal>
          {action}
        </div>
      ) : null}
    </header>
  );
}

export default ProductHeader;
