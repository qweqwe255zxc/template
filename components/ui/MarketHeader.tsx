import { ChevronsDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface MarketHeaderProps {
  /** Индекс раздела. Встаёт перед колонтитулом, тем же начертанием. */
  number?: string;
  /** Колонтитул НАД заголовком: мелкая приглушённая строка. */
  eyebrow?: string;
  title?: string;
  lead?: string;
  /**
   * Кнопка или ссылка справа от заголовка, по нижнему краю. Читается
   * только при align="start": в центрированной шапке ей некуда встать,
   * не сломав ось, — там она уходит под лид.
   */
  action?: ReactNode;
  /**
   * center (по умолчанию) — заголовок и шеврон по центру. Основной вид:
   * в исходном приёме так набраны все разделы, кроме двухколоночных.
   * start — по левому краю, для разделов, где шапка живёт в своей
   * колонке (About, контакты) или у неё есть довесок справа (кейсы).
   */
  align?: "center" | "start";
  className?: string;
}

/**
 * Шапка семейства `variant="market"`. Пятая общая шапка шаблона после
 * `StickySplit.tsx`, `EditorialHeader.tsx`, `ProductHeader.tsx` и
 * `AtelierHeader.tsx` — и заведена по той же причине: приём повторяется
 * на странице двенадцать раз, и разъехавшийся на пиксель отступ или
 * другой кегль превращают сквозное семейство в набор похожих секций.
 *
 * Чем отличается от четырёх остальных шапок:
 *
 *   1. ЗАГОЛОВОК КРАШЕН АКЦЕНТОМ и набран капслоком. Это главный
 *      опознавательный знак семейства и единственная шапка шаблона, где
 *      цвет достаётся самому заголовку: у `editorial` он обычного цвета
 *      под линейкой, у `product` акцентный только колонтитул, у
 *      `atelier` — только штрих под заголовком.
 *   2. Под заголовком ДВОЙНОЙ ШЕВРОН вниз — не линия и не штрих, а
 *      глиф. В исходном приёме он стоит под каждым центрированным
 *      заголовком и читается как «дальше вниз», то есть работает
 *      указателем, а не границей раздела.
 *   3. Шеврон рисуется ТОЛЬКО в центрированной форме. Это правило
 *      самого дизайна, а не наша экономия: в исходнике левые заголовки
 *      вызываются как `align="left" arrow={false}` — под прижатым к краю
 *      заголовком указатель повисал бы в стороне от колонки, на которую
 *      показывает.
 *   4. Колонтитул ПРИГЛУШЁННЫЙ и мелкий. В исходнике его нет вовсе
 *      (раздел открывается одним словом), но `number`/`eyebrow` есть в
 *      конфиге, и молча их терять нельзя — §1.5 п. 2. Приглушённый тон
 *      оставляет крик заголовку: два цветных пятна в одной шапке
 *      отменяют друг друга.
 *
 * Кегль заголовка — `.section-title-scale`, то есть только масштаб:
 * выключку решает `align` этой шапки, а не глобальный `theme.titleStyle`
 * (иначе у семейства было бы две конкурирующие оси выравнивания). Тот же
 * приём, что в `ProductHeader` и `AtelierHeader`.
 *
 * Цвет заголовка. База — `text-accent`. На ТЁМНОЙ и на АКЦЕНТНОЙ
 * поверхности берётся `text-fg`: на ink акцент проваливается по
 * контрасту, на accent он и вовсе совпадает с заливкой. Вариантным
 * пропом это не сделано намеренно — поверхность секции задаёт конфиг
 * (`surface` можно поставить любой), и шапка обязана подстроиться сама,
 * где бы её ни поставили. Тот же приём, что у штриха `AtelierHeader`.
 */
export function MarketHeader({
  number,
  eyebrow,
  title,
  lead,
  action,
  align = "center",
  className,
}: MarketHeaderProps) {
  if (!number && !eyebrow && !title && !lead && !action) return null;

  const centered = align === "center";
  const hasKicker = Boolean(number || eyebrow);

  const textBlock = (
    <div className={cn("min-w-0", centered && "flex flex-col items-center")}>
      {hasKicker ? (
        <p
          className={cn(
            "flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1 break-words text-caption font-semibold text-fg-muted",
            centered && "justify-center text-center",
          )}
          data-reveal
        >
          {number ? <span className="tabular">{number}</span> : null}
          {eyebrow ? <span>{eyebrow}</span> : null}
        </p>
      ) : null}

      {title ? (
        <h2
          className={cn(
            "font-heading section-title-scale uppercase",
            "text-accent [[data-surface=accent]_&]:text-fg [[data-surface=ink]_&]:text-fg",
            hasKicker && "mt-4",
            centered && "max-w-[20ch] text-center",
          )}
          data-reveal
        >
          {title}
        </h2>
      ) : null}

      {/* Указатель. Размер глифа константой — это не нарушение §1.5 п. 3:
          запрет там про размеры, которые держат РАСКЛАДКУ (высота медиа,
          ширина колонки); у иконки та же природа, что у size-5 в кнопке.
          aria-hidden обязателен: смысла в нём нет, он дублирует то, что
          и так следует ниже по потоку. */}
      {centered && title ? (
        <ChevronsDown
          aria-hidden="true"
          strokeWidth={2}
          className="mt-5 size-6 text-accent [[data-surface=accent]_&]:text-fg [[data-surface=ink]_&]:text-fg"
          data-reveal
        />
      ) : null}

      {lead ? (
        <p
          className={cn(
            "max-w-[58ch] text-lead text-fg-muted",
            title || hasKicker ? "mt-6" : undefined,
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
        // items-end, а не items-baseline: справа стоит кнопка, и по её
        // базовой линии внутри собственной коробки ряд разъезжается на
        // высоту паддинга.
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

export default MarketHeader;
