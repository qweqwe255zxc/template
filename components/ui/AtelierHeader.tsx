import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface AtelierHeaderProps {
  /** Индекс раздела. Встаёт перед колонтитулом, тем же начертанием. */
  number?: string;
  /** Колонтитул НАД заголовком: капитель с самой широкой разрядкой в шаблоне. */
  eyebrow?: string;
  title?: string;
  lead?: string;
  /**
   * Кнопка или ссылка справа от заголовка, по нижнему краю. Читается
   * только при align="start" — в центрированной шапке ей некуда встать,
   * не сломав ось, и она уходит под лид.
   */
  action?: ReactNode;
  /**
   * center (по умолчанию) — заголовок, штрих и лид по центру. Это
   * ОСНОВНОЙ вид шапки семейства: в исходном приёме так набраны девять
   * разделов из двенадцати.
   * start — по левому краю, для разделов с довеском справа (кейсы с
   * ссылкой «Все кейсы») и для двухколоночных раскладок, где шапка
   * живёт в своей колонке (About, FAQ, контакты).
   */
  align?: "center" | "start";
  className?: string;
}

/**
 * Шапка семейства `variant="atelier"`. Один компонент на все секции
 * семейства — по той же причине, что `StickySplit.tsx`,
 * `EditorialHeader.tsx` и `ProductHeader.tsx`: шапка повторяется на
 * странице десять-двенадцать раз, и разъехавшийся на пиксель отступ или
 * другая ширина штриха превращают сквозной приём в набор похожих секций.
 *
 * Чем отличается от трёх остальных шапок шаблона:
 *
 *   1. ШТРИХ ПОД ЗАГОЛОВКОМ — короткая акцентная линия в две точки.
 *      Это главный опознавательный знак семейства и единственное место,
 *      где в шапке появляется цвет. У `EditorialHeader` линейка идёт
 *      СВЕРХУ и во всю ширину колонки (граница раздела), тут — снизу и
 *      короткая (подпись под заголовком, а не граница). Перепутать их
 *      нельзя: на странице, собранной одним приёмом, обе роли заняты.
 *   2. Колонтитул ПРИГЛУШЁННЫЙ, а не акцентный, как в `ProductHeader`:
 *      акцент в этой шапке уже израсходован на штрих, а двух цветных
 *      пятен в одном заголовке быть не должно.
 *   3. Разрядка колонтитула 0.22em — самая широкая в шаблоне (у
 *      editorial 0.14em, у product 0.08em). Вместе с приглушённым цветом
 *      она и делает колонтитул «шёпотом над заголовком», ради которого
 *      весь приём и держится на воздухе, а не на плашках.
 *   4. Выключка по умолчанию ЦЕНТРАЛЬНАЯ — зеркало `ProductHeader`, где
 *      по умолчанию левая, а центр включается вручную.
 *
 * Кегль заголовка — `.section-title-scale`, то есть только масштаб:
 * выключку решает `align` этой шапки, а не глобальный `theme.titleStyle`.
 * Так у семейства остаётся одна ось выравнивания вместо двух
 * конкурирующих — ровно как в `ProductHeader`.
 */
export function AtelierHeader({
  number,
  eyebrow,
  title,
  lead,
  action,
  align = "center",
  className,
}: AtelierHeaderProps) {
  if (!number && !eyebrow && !title && !lead && !action) return null;

  const centered = align === "center";
  const hasKicker = Boolean(number || eyebrow);

  const textBlock = (
    <div className={cn("min-w-0", centered && "flex flex-col items-center")}>
      {hasKicker ? (
        // break-words на строке целиком: колонтитул с разрядкой 0.22em
        // физически шире своего текста, и на 390px «Клиника
        // эстетической медицины» без этого выносит блок за край
        // контейнера. Тот же случай, что в EditorialHeader.
        <p
          className={cn(
            "flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1 break-words text-caption font-medium uppercase tracking-[0.22em] text-fg-muted",
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
            "font-heading section-title-scale",
            hasKicker && "mt-5",
            centered && "max-w-[24ch] text-center",
          )}
          data-reveal
        >
          {title}
        </h2>
      ) : null}

      {/* Штрих. Размер задан константами, и это не нарушение §1.5 п. 3:
          запрет там про размеры, которые держат РАСКЛАДКУ (высота медиа,
          ширина колонки) — их обязаны считать пропорция и сетка. Здесь
          это глиф: та же природа, что у размера иконки (size-5) или
          толщины линейки (border). Он не должен тянуться за шириной
          колонки — растянутый на 1600px «штрих» станет линейкой, то есть
          знаком другого семейства.

          Цвет. База — `bg-accent-border`: на бумаге и на белом листе
          этот токен равен самому акценту, на тёмном блоке — приглушённо
          светлому. Замерено: 8.9–10.0 контраста к фону секции в обеих
          темах на paper/surface, 4.9–6.3 на ink. С `bg-accent` штрих
          молча исчезал бы там, где заливка сама акцентная.

          На АКЦЕНТНОЙ поверхности этого мало. Там `--accent-border`
          вырождается в `--surface-rule-strong`, то есть цвет текста при
          45% прозрачности, и штрих проседает до 3.13 в светлой теме и
          2.35 в тёмной — втрое-вчетверо слабее, чем везде, ровно в том
          разделе (CTA), который закрывает страницу. Поэтому под
          `[data-surface="accent"]` берётся `bg-fg` — сплошной цвет
          текста этой поверхности, без прозрачности: 8.94 и 7.97, то
          есть та же заметность, что на бумаге.

          Вариантным пропом это не сделано намеренно: акцентную
          поверхность секции задаёт конфиг (`surface: "accent"` можно
          поставить любой секции), а не вариант, и шапка обязана
          подстроиться сама, где бы её ни поставили.

          aria-hidden не нужен: у пустого div нет ни роли, ни имени, и
          скринридер его не озвучивает. */}
      {title ? (
        <div
          className={cn("mt-6 h-0.5 w-14 bg-accent-border [[data-surface=accent]_&]:bg-fg", centered && "mx-auto")}
          data-reveal
        />
      ) : null}

      {lead ? (
        <p
          className={cn(
            "max-w-[58ch] text-lead text-fg-muted",
            title || hasKicker ? "mt-7" : undefined,
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

export default AtelierHeader;
