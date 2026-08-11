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

const GRID_BREAKPOINTS = [
  { prefix: "sm:", cols: 2 },
  { prefix: "lg:", cols: 3 },
  { prefix: "xl:", cols: 4 },
] as const;

const CASCADE_STEP_PX = 28;

/**
 * Смещение margin-top для лесенки, отдельно на каждый брейкпоинт: число
 * колонок разное на sm/lg/xl, поэтому и то, что считается «неполным
 * последним рядом», на каждом брейкпоинте своё (пример: 6 карточек — 2
 * ровных ряда на lg:3, но ряд из 4 + хвост из 2 на xl:4). Обычная карточка
 * получает накопительный офсет index*step (см. комментарий у style в
 * разметке — почему накопительный, а не index%cols). Если total не
 * делится на cols нацело, последний ряд неполный — fillLastRowClasses уже
 * растягивает его по ширине, а этот же ряд должен получить одинаковый
 * margin-top на всех своих карточках, иначе они всё равно съезжают по
 * диагонали внутри уже выровненного по ширине ряда. Плоское значение —
 * офсет первой карточки этого ряда при обычном накоплении: ряд продолжает
 * общий спуск как единый блок, а не сбрасывается в 0.
 *
 * remainder = total % cols — то же, что rowItems в lib/gridFill.ts, НЕ
 * количество реально растянутых (col-span-2) карточек: fillLastRowClasses
 * может растянуть лишь часть хвостового ряда, но выровнять по высоте нужно
 * все карточки этого визуального ряда.
 */
function cascadeOffsetPx(index: number, total: number, cols: number, step: number): number {
  if (cols <= 1 || total <= 0) return index * step;

  const remainder = total % cols;
  if (remainder === 0) return index * step;

  const rowStart = total - remainder;
  return index >= rowStart ? rowStart * step : index * step;
}

/**
 * По одному CSS custom property на брейкпоинт (--offset-sm/-lg/-xl), а не
 * общий "--offset": разным брейкпоинтам для одной и той же карточки нужны
 * разные значения (см. cascadeOffsetPx выше), а Tailwind-сканеру нужен
 * литеральный var(--offset-XX) в исходнике — три статических класса, три
 * переменные.
 */
function cascadeOffsetVars(
  index: number,
  total: number,
  step: number = CASCADE_STEP_PX,
): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const { prefix, cols } of GRID_BREAKPOINTS) {
    vars[`--offset-${prefix.replace(":", "")}`] = `${cascadeOffsetPx(index, total, cols, step)}px`;
  }
  return vars;
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

        {/* items-start: без него grid по умолчанию растягивает (stretch)
            все ячейки ряда до высоты самой смещённой margin-top карточки —
            card с нулевым отступом раздувался под эту высоту (h-full), а
            низ у всех карточек в итоге выравнивался по одной линии вместо
            того, чтобы «съезжать» вниз вместе с верхом. */}
        <ol className="grid items-start gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, index) => {
            const Icon = getIcon(item.icon);

            return (
              <li
                key={item.number}
                data-reveal
                // Смещение — НАКОПИТЕЛЬНОЕ (index * 28px), а не остаток от
                // числа колонок на брейкпоинте: с остатком (index % columns)
                // каждая новая строка начиналась заново с нулевого отступа —
                // лесенка обрывалась и «зубец» первой карточки следующей
                // строки торчал выше последней карточки предыдущей, вместо
                // того чтобы продолжать спуск. Накопительное смещение растёт
                // с каждой карточкой независимо от переноса строк, поэтому
                // лесенка читается непрерывной и сверху, и снизу на любом
                // количестве колонок. Отдельная переменная на каждый
                // брейкпоинт (а не одна общая) — потому что «неполный
                // последний ряд» на sm:2/lg:3/xl:4 не совпадает: там, где
                // ряд неполный, его карточки нужно выровнять по высоте
                // (см. cascadeOffsetPx выше). mt-0 ниже sm — там всего одна
                // колонка и каскада нет вовсе.
                style={
                  {
                    ...revealDelay(index),
                    ...cascadeOffsetVars(index, items.length),
                  } as CSSProperties
                }
                className={cn(
                  "relative mt-0 sm:mt-[var(--offset-sm)] lg:mt-[var(--offset-lg)] xl:mt-[var(--offset-xl)]",
                  spanClasses[index],
                )}
              >
                <span
                  aria-hidden="true"
                  className="tabular absolute -left-3 -top-3 z-10 flex size-9 items-center justify-center rounded-control bg-accent text-body font-bold text-accent-fg"
                >
                  {item.number}
                </span>

                {/* min-h вместо h-full: родительский <ol> — items-start
                    (см. выше), у <li> нет заданной высоты, растягивать
                    карточку не подо что. Общий пол высоты — то, чем можно
                    выровнять длину карточек без items-start, не потеряв
                    сам каскад (полная растяжка по высоте ряда убрала бы
                    смещение). */}
                <Card variant="framed" className="flex min-h-[19rem] flex-col">
                  {Icon ? (
                    <span className="icon-tile">
                      <Icon aria-hidden="true" strokeWidth={1.5} className="size-6" />
                    </span>
                  ) : null}

                  {/* Без line-clamp: он молча резал текст многоточием, а в
                      шаблоне текст пишет клиент и увидеть потерю неоткуда.
                      Проверено — обрезка шла ещё при контейнере 1600 (5
                      строк показывались как 3). Выравнивать карточки он и
                      не был нужен: пол высоты держит min-h-[19rem] у Card,
                      а <ol> стоит items-start. */}
                  <h3 className="mt-4 max-w-[22ch] font-heading text-h3">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-body text-fg-muted">{item.text}</p>

                  {item.photo ? (
                    <div className={cn("ui-media-inset relative mt-6 aspect-[4/3] w-full shrink-0 overflow-hidden", aspectClasses[index])}>
                      <Image
                        src={item.photo}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                        className="object-cover"
                      />
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
