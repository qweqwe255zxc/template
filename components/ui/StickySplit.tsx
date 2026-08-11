import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

interface StickySplitProps {
  number?: string;
  eyebrow?: string;
  title?: string;
  /**
   * Своя разметка заголовка вместо стандартного <h2>. Нужен ровно там,
   * где заголовок не h2: hero отдаёт сюда <h1> с построчным массивом.
   * Взаимоисключающ с `title`.
   */
  titleSlot?: ReactNode;
  lead?: string;
  /**
   * Залипание левой колонки на lg+. Выключать там, где прокручивать мимо
   * заголовка нечего: hero — первый экран, CTA — блок короче экрана. В
   * таких секциях остаётся только ось 4/8, и это правильно: язык у сайта
   * один, а поведение — по смыслу блока.
   */
  sticky?: boolean;
  /** Довесок в левую колонку под лидом: кнопка, подпись, мелкий факт. */
  aside?: ReactNode;
  /** Правая колонка — содержимое раздела. */
  children: ReactNode;
  /** Обернуть в Container. Выключать, если оправа уже своя. */
  contained?: boolean;
  className?: string;
}

/**
 * Раскладка «залипающий заголовок слева (4/12) — содержимое справа
 * (8/12)». Сквозной язык страницы: одну и ту же ось держат все секции с
 * `variant="sticky-split"`, поэтому сайт целиком собирается из одного
 * приёма, а не из одиннадцати похожих.
 *
 * Раскладка живёт ОДНИМ компонентом, а не копией в каждой секции,
 * ровно по этой причине: ось, брейкпоинт, отступ залипания и кегль
 * заголовка обязаны совпадать у всех до пикселя, иначе при прокрутке
 * страницы заголовки соседних разделов начнут прыгать по горизонтали и
 * весь смысл приёма пропадёт. Правая колонка у каждой секции своя — её
 * передаёт вариант.
 *
 * Почему lg, а не md. На 768–1023px колонка 4/12 — это около 230px:
 * заголовок в ней рвётся на 5–6 строк, а залипающий блок занимает треть
 * экрана и мешает читать список. Ниже lg раскладка честно схлопывается
 * в одну колонку — заголовок сверху, содержимое под ним.
 *
 * Почему заголовок здесь text-h2, а не .section-title. Ступень
 * --title-size переключается ThemeConfig.titleStyle и в режиме
 * "centered" доходит до 48px — в колонке 230–400px это гарантированный
 * перенос посреди слова. Раскладке нужен предсказуемый кегль, потому
 * что от него зависит, поместится ли заголовок в колонку.
 */
export function StickySplit({
  number,
  eyebrow,
  title,
  titleSlot,
  lead,
  sticky = true,
  aside,
  children,
  contained = true,
  className,
}: StickySplitProps) {
  const body = (
    <div className={cn("grid gap-x-gutter gap-y-10 lg:grid-cols-12", className)}>
      {/* min-w-0: без него длинное слово в заголовке распирает колонку
          4/12 (у grid-элементов min-width: auto) и наезжает на правую. */}
      <div className="min-w-0 lg:col-span-4">
        <div
          className={
            sticky ? "lg:sticky lg:top-[calc(var(--header-height)+2rem)]" : undefined
          }
        >
          {number ? (
            <p className="tabular text-caption font-medium uppercase text-fg-muted" data-reveal>
              {number}
            </p>
          ) : null}

          {eyebrow ? (
            <p
              className={cn(
                "text-caption font-medium uppercase text-fg-muted",
                number && "mt-1",
              )}
              data-reveal
            >
              {eyebrow}
            </p>
          ) : null}

          {titleSlot ? (
            <div className={cn((number || eyebrow) && "mt-5")}>{titleSlot}</div>
          ) : title ? (
            <h2
              className={cn(
                "font-heading text-h2 break-words",
                (number || eyebrow) && "mt-5",
              )}
              data-reveal
            >
              {title}
            </h2>
          ) : null}

          {lead ? (
            <p className="mt-5 max-w-[46ch] text-lead text-fg-muted" data-reveal>
              {lead}
            </p>
          ) : null}

          {aside ? <div className="mt-8">{aside}</div> : null}
        </div>
      </div>

      <div className="min-w-0 lg:col-span-8 lg:col-start-5">{children}</div>
    </div>
  );

  return contained ? <Container>{body}</Container> : body;
}

export default StickySplit;
