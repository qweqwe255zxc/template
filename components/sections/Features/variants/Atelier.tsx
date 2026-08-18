import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AtelierHeader } from "@/components/ui/AtelierHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import type { FeatureItem, FeaturesSection } from "@/types/site";

/**
 * Растяжение ПОСЛЕДНЕЙ плитки на остаток ряда: колонки отдельно,
 * пропорция отдельно.
 *
 * Зачем растягивать. Плитки стоят встык, и пустой слот в последнем ряду
 * — это не воздух между карточками, а видимая дыра цвета секции внутри
 * сплошного полотна (замерено на демо-данных: пять услуг в три колонки,
 * шестая клетка пустая). Остаток закрывает последняя плитка целиком.
 *
 * Зачем врозь. `col-span` идёт на саму плитку, а пропорция — на
 * РАСПОРКУ внутри неё (см. `TileShell`): у растянутой вдвое плитки
 * квадрат дал бы и двойную высоту, то есть «2×2» вместо нужной «2×1».
 *
 * Литеральные строки — сканер Tailwind ищет кандидатов по тексту
 * исходника и склеенного в рантайме класса не увидит.
 */
const TILE_SPAN: Record<"sm:" | "lg:", Record<number, string>> = {
  "sm:": { 2: "sm:col-span-2" },
  "lg:": { 2: "lg:col-span-2", 3: "lg:col-span-3" },
};

const TILE_ASPECT: Record<"sm:" | "lg:", Record<number, string>> = {
  "sm:": { 2: "sm:aspect-[2/1]" },
  "lg:": { 2: "lg:aspect-[2/1]", 3: "lg:aspect-[3/1]" },
};

function tileTail(
  index: number,
  count: number,
  cols: number,
  prefix: "sm:" | "lg:",
): { span?: string; aspect?: string } {
  if (index !== count - 1) return {};
  const remainder = count % cols;
  if (remainder === 0) return {};
  const slots = cols - remainder + 1;
  return { span: TILE_SPAN[prefix][slots], aspect: TILE_ASPECT[prefix][slots] };
}

interface TileShellProps {
  children: ReactNode;
  /** data-surface заливки; у плитки с кадром его нет — там свой оверлей. */
  surface?: "accent" | "ink";
  className?: string;
  spanClassName?: string;
  aspectClassName?: string;
}

/**
 * Оболочка плитки: квадрат задаёт РАСПОРКА, а не сама плитка.
 *
 * Почему не `aspect-square` прямо на плитке, как было сначала. Плитка с
 * длинным текстом перерастает квадрат — это нормально и нужно (§1.5
 * п. 2: обрезать текст клиента нельзя). Но соседняя плитка в том же
 * ряду при этом НЕ растягивается до новой высоты: `aspect-ratio` делает
 * высоту определённой, и `align-items: stretch` грида её уже не
 * переопределяет. Замерено на 1024: в ряду из двух плиток одна выросла
 * до 378px, вторая осталась 341 — и в полотне встык появился зазор в
 * 37px цвета секции.
 *
 * Здесь пропорция висит на пустой распорке в первой ячейке
 * однокле­точного грида, содержимое лежит в той же ячейке вторым слоем.
 * Высота ряда = max(квадрат, содержимое), у самой плитки высота auto —
 * значит она честно растягивается до высоты ряда, и стык остаётся
 * сплошным.
 */
function TileShell({
  children,
  surface,
  className,
  spanClassName,
  aspectClassName,
}: TileShellProps) {
  return (
    <div
      data-surface={surface}
      // grid-cols-1, а не голый grid: у неявной auto-колонки максимум
      // считается по max-content, а у распорки с aspect-ratio он равен
      // высоте × пропорция — то есть колонка распирается шире самой
      // плитки и страница уезжает по горизонтали (замерено на 1024:
      // плитка 683, распорка 755, документ 1096 при окне 1024).
      // grid-cols-1 — это minmax(0, 1fr): нулевой минимум, ширина
      // ровно по контейнеру.
      className={cn(
        "relative grid grid-cols-1",
        surface && "bg-bg text-fg",
        spanClassName,
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn("col-start-1 row-start-1 w-full aspect-square", aspectClassName)}
      />
      {children}
    </div>
  );
}

function fillSurface(fillIndex: number): "accent" | "ink" {
  return fillIndex % 2 === 0 ? "accent" : "ink";
}

function TileLink({ link }: { link: NonNullable<FeatureItem["link"]> }) {
  return (
    <Link
      href={link.href}
      className="mt-6 inline-flex self-start border-b border-current pb-1.5 text-caption font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-70"
    >
      {link.label}
    </Link>
  );
}

/**
 * Услуги семейства `atelier`: плитка квадратов ВСТЫК, во всю ширину окна.
 *
 * Плитка бывает двух сортов, и сорт решает сам элемент:
 *
 *   • с `photo` — фотография на всю клетку и подпись на сплошной тёмной
 *     плашке по нижнему краю;
 *   • без `photo` — сплошная заливка во всю клетку, текст прижат к низу,
 *     ссылка `link` под ним.
 *
 * Заливки чередуются `accent` / `ink` по порядку среди бесфотных клеток.
 * Это не украшение: в исходном приёме половина плиток — фотографии, а
 * половина цветные, и ровно это чередование не даёт шести квадратам
 * слипнуться в одно полотно. Если фотографий нет ни у одного элемента,
 * раскладка честно вырождается в шахматку заливок — она остаётся
 * читаемой, но проекту с шестью услугами без единого кадра лучше взять
 * `cards`.
 *
 * Чем отличается от остальных раскладок Features:
 *
 *   • Единственная, где клетки стоят ВСТЫК и на всю ширину окна: между
 *     ними нет ни зазора, ни линии, границу держит смена заливки. У
 *     `compact` и `editorial` границу держит линейка, у `cards` — зазор.
 *   • Единственная, где текст лежит НА заливке, а не на поверхности
 *     секции. Поэтому `iconShape` и `icon` тут не читаются: плашка
 *     иконки поверх сплошного цвета — это плашка на плашке.
 *   • `points` тоже не читаются: в квадрате, где текст уже прижат к
 *     низу, список пунктов выталкивает заголовок за клетку.
 *
 * Про `aspect-square` и §1.5 п. 3. Это пропорция, а не фиксированный
 * размер: высота считается от ширины колонки. Если текст в клетке выше
 * квадрата, коробка растёт — `aspect-ratio` у блока с автовысотой
 * уступает min-content, и подпись не обрезается (§1.5 п. 2). Ряд при
 * этом остаётся ровным: соседние клетки растягиваются гридом до той же
 * высоты, а фотография внутри просто перекадрируется.
 */
export function Atelier(props: FeaturesSection) {
  const {
    id,
    surface = "paper",
    columns = 3,
    number,
    eyebrow,
    title,
    lead,
    items,
    action,
  } = props;

  const hasHeader = Boolean(number || eyebrow || title || lead);

  // Колонки на sm всегда 2; на lg — 3 или 2, смотря что задано в
  // конфиге. Числа нужны для закрытия остатка (tileTail выше).
  const lgCols = columns === 2 ? 2 : 3;

  // Счётчик заливок ведётся отдельно от индекса в массиве: чередование
  // должно идти по бесфотным клеткам подряд, иначе две заливки, между
  // которыми стоит фотография, окажутся одного цвета и снова слипнутся —
  // уже через клетку.
  let fillIndex = -1;

  return (
    <Section id={id} surface={surface}>
      {hasHeader ? (
        <Container>
          <AtelierHeader
            number={number}
            eyebrow={eyebrow}
            title={title}
            lead={lead}
            className="mb-14 md:mb-20"
          />
        </Container>
      ) : null}

      {/* Без Container намеренно: плитка идёт от края до края окна — это
          и есть приём. Отступы секции при этом остаются обычными, то
          есть плитка «вставлена» в страницу, а не заменяет её. */}
      <div
        className={cn(
          "grid",
          columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {items.map((item, index) => {
          const sm = tileTail(index, items.length, 2, "sm:");
          const lg = tileTail(index, items.length, lgCols, "lg:");
          const spanClassName = cn(sm.span, lg.span);
          const aspectClassName = cn(sm.aspect, lg.aspect);

          if (item.photo) {
            return (
              <TileShell
                key={item.title}
                spanClassName={spanClassName}
                aspectClassName={aspectClassName}
                className="overflow-hidden"
              >
                <Image
                  src={item.photo}
                  alt={item.title}
                  fill
                  sizes={
                    columns === 2
                      ? "(min-width: 640px) 50vw, 100vw"
                      : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  }
                  className="object-cover"
                  data-reveal
                  style={revealDelay(index % columns)}
                />

                {/* Плашка подписи — сплошная, а не полупрозрачная
                    градиентная: у фотографии клиента яркость непредсказуема,
                    и текст поверх градиента читается через раз. Сплошная
                    ink-поверхность даёт гарантированный контраст в обеих
                    темах и ни одного цвета руками. */}
                <div
                  data-surface="ink"
                  className="absolute inset-x-0 bottom-0 bg-bg p-7 text-fg md:p-8"
                >
                  <h3 className="font-display text-h3">{item.title}</h3>
                  <p className="mt-2 text-small text-fg-muted">{item.text}</p>
                </div>
              </TileShell>
            );
          }

          fillIndex += 1;

          return (
            <TileShell
              key={item.title}
              surface={fillSurface(fillIndex)}
              spanClassName={spanClassName}
              aspectClassName={aspectClassName}
            >
              <div
                className="col-start-1 row-start-1 flex flex-col justify-end p-7 md:p-9"
                data-reveal
                style={revealDelay(index % columns)}
              >
                <h3 className="font-display text-h3">{item.title}</h3>
                <p className="mt-3 max-w-[38ch] text-body text-fg-muted">
                  {item.text}
                </p>
                {item.link ? <TileLink link={item.link} /> : null}
              </div>
            </TileShell>
          );
        })}
      </div>

      {action ? (
        <Container className="mt-14 flex justify-center md:mt-16">
          <Link
            href={action.href}
            className="border-b border-rule-strong pb-1.5 text-caption font-medium uppercase tracking-[0.16em] text-fg-muted transition-colors hover:border-accent hover:text-accent"
            data-reveal
          >
            {action.label}
          </Link>
        </Container>
      ) : null}
    </Section>
  );
}

export default Atelier;
