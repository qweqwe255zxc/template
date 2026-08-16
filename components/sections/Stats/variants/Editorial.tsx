import type { CSSProperties } from "react";
import { Container } from "@/components/ui/Container";
import { EditorialHeader } from "@/components/ui/EditorialHeader";
import { Section } from "@/components/ui/Section";
import { revealDelay } from "@/lib/reveal";
import type { StatsSection } from "@/types/site";

/**
 * ПОДНЯТЫЙ потолок --size-stat: 52px → 76px. Тот же приём, что у
 * EDITORIAL_H1 в Hero/parts/headlineScale.ts — переменная переопределяется
 * в поддереве полосы, а не в токене, поэтому остальные восемь раскладок
 * Stats продолжают верстаться обычной ступенью.
 *
 * Зачем нужна отдельная ступень. В этом семействе цифра — не подпись к
 * иконке, а сам объект: карточки, плашки и иконки сняты, и держать
 * ячейку, кроме линейки, больше нечему. На 52px число читается как
 * подзаголовок и полоса разваливается на четыре бледных столбика.
 *
 * Инвариант: строго ВЫШЕ глобального --size-stat на любой ширине —
 * @390 44 vs 36, @768 46 vs 43, @1024 56 vs 46, @1440 72 vs 52,
 * @1920 76 vs 52. Правишь одно значение — пересчитывай второе: при
 * потолке ниже глобального ступень инвертируется и «поднятый» кегль
 * станет мельче обычного.
 */
const EDITORIAL_STAT = {
  "--size-stat": "clamp(2.75rem, 1rem + 3.9vw, 4.75rem)",
} as CSSProperties;

/**
 * Разделители полосы: 2 колонки до lg, 4 с lg.
 *
 * Классы собираются статическими литералами — как в Band.tsx: сканер
 * Tailwind не видит склеенных строк, и утилита не попадёт в сборку.
 *
 * Толщина линий тут несёт смысл, а не оформление (см. §2.16 CLAUDE.md):
 * СПЛОШНАЯ сверху у каждой ячейки — это счёт, ряд равноправных величин;
 * ВОЛОСЯНАЯ слева — разделитель колонок, у неё роль пробела, а не
 * границы. Если выровнять их «для единообразия», полоса перестанет
 * читаться как таблица и станет сеткой из четырёх случайных блоков.
 *
 * Горизонтальный паддинг обнуляется на крайних колонках каждого
 * брейкпоинта — иначе по краям полосы остаётся пустой отступ поверх
 * паддинга контейнера, и линейка не доходит до края текстового блока.
 * Обе ветки каждого условия выписаны явно: два конфликтующих класса на
 * одном брейкпоинте разрешались бы порядком генерации в Tailwind, а не
 * порядком в classList.
 */
function editorialCell(index: number): string {
  const parts = ["border-t border-t-rule-strong py-10 md:py-12"];

  const mobileLeftEdge = index % 2 === 0;
  const mobileRightEdge = index % 2 === 1;
  const desktopLeftEdge = index % 4 === 0;
  const desktopRightEdge = index % 4 === 3;

  parts.push(mobileLeftEdge ? "pl-0" : "pl-5");
  parts.push(desktopLeftEdge ? "lg:pl-0" : "lg:pl-8");

  parts.push(mobileRightEdge ? "pr-0" : "pr-5");
  parts.push(desktopRightEdge ? "lg:pr-0" : "lg:pr-8");

  parts.push(mobileLeftEdge ? "border-l-0" : "border-l border-l-rule");
  parts.push(desktopLeftEdge ? "lg:border-l-0" : "lg:border-l lg:border-l-rule");

  return parts.join(" ");
}

/**
 * Цифры семейства `editorial`: полоса-таблица без карточек и без иконок.
 * Ячейку держат две линейки — сплошная сверху и волосяная слева, — а
 * крупное число набрано поднятой ступенью (см. EDITORIAL_STAT выше).
 *
 * Чего вариант НЕ читает и почему:
 *
 *   • `icon` — плашка под иконкой это ровно тот декор, вместо которого
 *     в этом семействе стоит линейка. Иконка над числом вернула бы
 *     карточку без карточки.
 *   • `containerVariant` — подложка (тень/акцентная рамка) спорит с той
 *     же линейкой; полоса тут всегда плоская, как в `flat`.
 *   • `fillLastRow` — ячейки держит не сетка карточек, а разделители, и
 *     растянутая на две колонки ячейка порвала бы их ритм.
 *   • `image` — второй колонки в этой раскладке нет вовсе.
 *
 * `item.text` рендерится под подписью, если задан: терять текст, который
 * написал клиент, вариант не имеет права (§1.5, п. 2), даже если в
 * исходном приёме этой строки не было.
 */
export function Editorial(props: StatsSection) {
  const { id, surface = "paper", number, eyebrow, title, lead, items } = props;

  const hasHeader = Boolean(number || eyebrow || title || lead);

  return (
    <Section
      id={id}
      surface={surface}
      // Без колонтитула полоса — продолжение предыдущего экрана (в
      // исходном приёме она идёт сразу под фотографией hero и своего
      // воздуха сверху не имеет). С колонтитулом это уже полноценный
      // раздел, и ему нужен обычный вертикальный ритм секции.
      spacing={hasHeader ? "default" : "sm"}
      className="border-b border-rule"
    >
      <Container>
        <EditorialHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          className={hasHeader ? "mb-14 md:mb-20" : undefined}
        />

        <dl className="grid grid-cols-2 lg:grid-cols-4" style={EDITORIAL_STAT}>
          {items.map((item, index) => (
            <div
              key={item.label}
              data-reveal
              style={revealDelay(index)}
              className={editorialCell(index)}
            >
              <dt className="tabular font-display text-stat">
                {item.value}
                {item.suffix ? (
                  <span className="text-fg-muted">{item.suffix}</span>
                ) : null}
              </dt>
              <dd className="mt-4 max-w-[22ch] text-caption font-medium uppercase text-fg-muted">
                {item.label}
              </dd>
              {item.text ? (
                <p className="mt-3 max-w-[34ch] text-small text-fg-muted">
                  {item.text}
                </p>
              ) : null}
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}

export default Editorial;
