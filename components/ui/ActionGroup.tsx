import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { CtaLink } from "@/types/site";

type Align = "start" | "center" | "end";

interface ActionGroupProps {
  actions: CtaLink[];
  /** Куда прижимать группу на sm+. На мобильном всегда колонка во всю ширину. */
  align?: Align;
  /** Вариант кнопки, если у действия он не задан. */
  fallbackVariant?: CtaLink["variant"];
  /** Колонка на любой ширине — для узких оправ (карточка в CTA/panel). */
  stacked?: boolean;
  className?: string;
}

const ALIGN_SELF: Record<Align, string> = {
  start: "@sm/actions:mr-auto",
  center: "@sm/actions:mx-auto",
  end: "@sm/actions:ml-auto",
};

const ALIGN_TEXT: Record<Align, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};

/**
 * Группа кнопок призыва. Заведена одним компонентом, потому что правило
 * «кнопки в группе одной ширины» иначе пришлось бы повторить в семи
 * вариантах CTA и Pricing — и оно бы там разошлось, что и произошло:
 * где-то кнопки шли flex-wrap с натуральной шириной, где-то колонкой с
 * full, где-то через justify-between.
 *
 * Почему GRID, а не flex с flex-1. У флекс-элементов min-width: auto,
 * поэтому кнопка не может стать уже своей подписи: `flex-1 basis-0` на
 * паре «Открыть репозиторий» / «Документация по секциям» давал 250 и
 * 283px вместо равных. Грид-трек `auto-cols-fr` — это minmax(0, 1fr):
 * нулевой минимум и есть причина равенства, все треки получают ровно
 * одну ширину независимо от длины подписей.
 *
 * Обратная сторона нулевого минимума — трек МОЖЕТ стать уже подписи.
 * Поэтому кнопки идут с `wrap`: в узкой колонке подпись переносится на
 * вторую строку, а кнопка растёт по высоте (грид растягивает соседнюю
 * до той же). Без этого при `whitespace-nowrap` текст просто вылезал за
 * край: замерено на CTA/editorial при 1024px — трек 184px, «Документация
 * по секциям» требует 192px, десять пикселей подписи оказывались
 * срезаны. Поднять порог контейнерного запроса вместо этого нельзя:
 * сколько нужно места, зависит от длины подписей, а не от ширины
 * колонки — на той же странице hero влезал в свою группу с запасом в
 * один пиксель (467 против 466).
 *
 * Почему КОНТЕЙНЕРНЫЙ запрос, а не брейкпоинт. Влезут ли кнопки в ряд —
 * вопрос ширины их колонки, а не ширины экрана. На 768px CTA/band уже
 * делится 7/5, колонка кнопок там 283px, а паре нужно 325 — с обычным
 * `sm:` ряд включался по ширине окна и вылезал за экран. `@sm/actions`
 * смотрит на саму группу: узкая колонка — кнопки остаются стопкой,
 * широкая — встают в ряд. Работает одинаково в любой оправе, включая
 * будущие.
 *
 * `quiet` — текстовая ссылка, а не кнопка: она вынесена из сетки в
 * отдельную строку под кнопками. В общем треке подчёркивание
 * растягивалось бы на пустое место рядом с текстом, а по высоте ссылка
 * без бокса (h-auto) всё равно не встаёт вровень с кнопкой h-12.
 */
export function ActionGroup({
  actions,
  align = "start",
  fallbackVariant = "primary",
  stacked = false,
  className,
}: ActionGroupProps) {
  if (actions.length === 0) return null;

  const variantOf = (action: CtaLink) => action.variant ?? fallbackVariant;
  const solid = actions.filter((action) => variantOf(action) !== "quiet");
  const quiet = actions.filter((action) => variantOf(action) === "quiet");

  return (
    <div className={cn("@container/actions flex flex-col gap-4", className)}>
      {solid.length > 0 ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-4",
            !stacked && [
              "@sm/actions:auto-cols-fr @sm/actions:grid-flow-col",
              // Кап нужен, иначе на широкой колонке две кнопки
              // растягиваются в две плашки во всю строку. Он же обязан
              // быть шире суммы подписей — при нехватке места треки
              // расходятся по своему min-content и равенство теряется.
              solid.length <= 1 ? "@sm/actions:max-w-xs" : "@sm/actions:max-w-2xl",
              ALIGN_SELF[align],
            ],
          )}
        >
          {solid.map((action, index) => (
            <Button
              key={index}
              href={action.href}
              variant={variantOf(action)}
              full
              wrap
            >
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}

      {quiet.length > 0 ? (
        <div className={cn("flex flex-wrap items-baseline gap-x-6 gap-y-2", ALIGN_TEXT[align])}>
          {quiet.map((action, index) => (
            <Button key={index} href={action.href} variant="quiet">
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ActionGroup;
