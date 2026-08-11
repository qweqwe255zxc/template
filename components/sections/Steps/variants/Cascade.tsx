import Image from "next/image";
import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { ASPECT_PAIR_4_3, fillLastRowAspectClasses, fillLastRowClasses } from "@/lib/gridFill";
import { getIcon } from "@/lib/icons";
import { revealDelay } from "@/lib/reveal";
import { StepsHeader } from "../parts/StepsHeader";
import type { StepsSection } from "@/types/site";

/**
 * Лесенка живёт только на xl (4 колонки). Ниже — обычная сетка: 2×2 на
 * sm, одна колонка на мобильном. Промежуточной ступени в 3 колонки нет
 * намеренно — на четырёх шагах она даёт ряд 3+1, где одинокая карточка
 * висит под лесенкой и вся фигура разваливается. Требование простое:
 * пока все карточки в ряд не помещаются, это ровная сетка, а не косая.
 */
const GRID_BREAKPOINTS = [
  { prefix: "sm:", cols: 2 },
  { prefix: "xl:", cols: 4 },
] as const;

const CASCADE_STEP_PX = 28;
const CASCADE_COLS = 4;

/**
 * Встречные отступы — то, из-за чего лесенка получается РОВНОЙ.
 *
 * Наивный способ (только margin-top, растущий по колонке) требует
 * items-start, иначе grid растянет ячейки до общей высоты и лесенка
 * схлопнется. Но с items-start карточки перестают быть одной высоты:
 * каждая обрезается по своему тексту, фото внутри встают на разных
 * уровнях, и ряд читается как мусор, а не как ступени. Ровно это и было
 * видно на скриншотах.
 *
 * Здесь у карточки ДВА отступа: сверху col*step, снизу (cols-1-col)*step.
 * Их сумма — (cols-1)*step — одна и та же у всех карточек ряда, поэтому
 * все grid-ячейки одной высоты, карточки внутри спокойно тянутся на
 * h-full (stretch работает как обычно), а видимый верх каждой следующей
 * ниже предыдущей ровно на step. Ступени идеальные и по верху, и по низу.
 *
 * Отсчёт от колонки (index % cols), а не накопительный: каждый ряд —
 * свой одинаковый спуск. Накопительный уводил бы четвёртый ряд на
 * пол-экрана вниз и растил секцию без всякой пользы.
 */
function cascadeVars(index: number): Record<string, string> {
  const col = index % CASCADE_COLS;

  return {
    "--cascade-mt": `${col * CASCADE_STEP_PX}px`,
    "--cascade-mb": `${(CASCADE_COLS - 1 - col) * CASCADE_STEP_PX}px`,
  };
}

/**
 * Карточки каскадом: каждая следующая ниже и правее предыдущей, номер —
 * акцентный бейдж на углу карточки. Тёмный/светлый вариант референса —
 * это не два разных компонента, а одни и те же данные на разной
 * поверхности: `surface="ink"` + `photo` у items даёт мрачную версию
 * («Creative Dark»), обычная поверхность без фото — светлую и лёгкую
 * («Playful Startup»). Фото — опционально, в подвале карточки.
 */
export function Cascade(props: StepsSection) {
  const { id, surface = "paper", number, eyebrow, title, lead, items, headerAlign, iconShape, fillLastRow = true } =
    props;
  const spanClasses = fillLastRow ? fillLastRowClasses(items.length, GRID_BREAKPOINTS) : [];
  const aspectClasses = fillLastRow
    ? fillLastRowAspectClasses(items.length, GRID_BREAKPOINTS, ASPECT_PAIR_4_3)
    : [];

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <Container>
        <StepsHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          align={headerAlign}
          className="mb-14 md:mb-20"
        />

        {/* Без items-start: ячейки обязаны растягиваться (stretch по
            умолчанию), иначе карточки будут разной высоты. Лесенку это не
            ломает — её держат встречные отступы, см. cascadeVars. */}
        <ol className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item, index) => {
            const Icon = getIcon(item.icon);

            return (
              <li
                key={item.number}
                data-reveal
                style={
                  {
                    ...revealDelay(index),
                    ...cascadeVars(index),
                  } as CSSProperties
                }
                className={cn(
                  // Смещение только на xl: ниже 1280px это ровная сетка,
                  // 2×2 или колонка.
                  "relative flex xl:mt-[var(--cascade-mt)] xl:mb-[var(--cascade-mb)]",
                  spanClasses[index],
                )}
              >
                <span
                  aria-hidden="true"
                  className="tabular absolute -left-3 -top-3 z-10 flex size-9 items-center justify-center rounded-control bg-accent text-body font-bold text-accent-fg"
                >
                  {item.number}
                </span>

                {/* h-full, а не min-h с фиксированным значением: высоту
                    ряда теперь задаёт grid, и карточка просто занимает
                    свою ячейку целиком. Фиксированный пол высоты был
                    вторым источником правды и на узких колонках только
                    добавлял пустоты. */}
                <Card variant="framed" className="flex h-full w-full flex-col">
                  {Icon ? (
                    <span className="icon-tile">
                      <Icon aria-hidden="true" strokeWidth={1.5} className="size-6" />
                    </span>
                  ) : null}

                  {/* Без line-clamp: он молча резал текст многоточием, а в
                      шаблоне текст пишет клиент и увидеть потерю неоткуда.
                      Высоту выравнивает сетка, обрезка для этого не нужна. */}
                  <h3 className="mt-4 max-w-[22ch] font-heading text-h3">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-body text-fg-muted">{item.text}</p>

                  {/* mt-auto прижимает фото к низу карточки. Без этого оно
                      шло сразу за текстом, а тексты у шагов разной длины —
                      фото в соседних карточках вставали на разных уровнях,
                      и ряд выглядел сломанным, хотя каждая карточка по
                      отдельности была верна. */}
                  {item.photo ? (
                    // Отступ на обёртке, а не на самом боксе: aspect-ratio
                    // считается по border-box, и padding внутри съел бы
                    // часть кадра вместо того, чтобы отбить фото от текста.
                    <div className="mt-auto w-full shrink-0 pt-6">
                      <div className={cn("ui-media-inset relative aspect-[4/3] w-full overflow-hidden", aspectClasses[index])}>
                        <Image
                          src={item.photo}
                          alt={item.title}
                          fill
                          sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ) : null}
                </Card>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}

export default Cascade;
