import Image from "next/image";
import { ActionGroup } from "@/components/ui/ActionGroup";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { revealDelay } from "@/lib/reveal";
import { EDITORIAL_H1 } from "../parts/headlineScale";
import { HeroFacts } from "../parts/HeroFacts";
import type { HeroSection } from "@/types/site";

/**
 * Первый экран семейства `editorial` (см. components/ui/EditorialHeader).
 *
 * Порядок ярусов: колонтитул на линейке во всю ширину → заголовок-афиша
 * в верхнем регистре → лид и кнопки одной строкой по нижнему краю →
 * фотография ВСТЫК к краям окна → полоса фактов.
 *
 * Три вещи, которые отличают эту раскладку от `type-only`, при том что
 * обе — «голая типографика без второй колонки»:
 *
 *   1. Колонтитул лежит НАД заголовком на линейке (индекс слева,
 *      подпись справа), а не вертикально на левом поле. Поэтому
 *      `number`/`rail` тут читаются, но `HeroRail` не используется:
 *      вертикальный колонтитул спорил бы с линейкой.
 *   2. Кегль заголовка поднят до 104px (`EDITORIAL_H1`) — на полной
 *      ширине контейнера базовые 64px читаются как заголовок раздела.
 *   3. `image` идёт полосой во всю ширину ОКНА, вне `Container`: в
 *      исходном приёме фотография — это горизонт между первым экраном и
 *      цифрами, а не иллюстрация в колонке. Поэтому она не «второй
 *      колонкой» и `widget` эта раскладка не читает (роутер
 *      предупреждает).
 *
 * Пропорция фотографии меняется брейкпоинтами: на 390px горизонтальная
 * полоса 21:9 вырождается в 160px ленты, где не видно ни объекта, ни
 * кадра. Ступень 5/4 → 9/4 → 21/9 повторяет исходный приём, где высота
 * полосы задана clamp(320px, 46vw, 620px); потолок из этого clamp
 * перенесён как max-h в svh — подробности у самой полосы ниже.
 *
 * Последняя строка `headline` остаётся акцентной — это общее правило
 * шаблона (одно из шести мест, где акцент вообще появляется), и
 * раскладка не имеет права его отменять: у монохромного бренда акцент
 * и так придёт из палитры почти чёрным.
 */
export function Editorial(props: HeroSection) {
  const {
    id,
    surface = "paper",
    number,
    rail,
    headline,
    lead,
    actions = [],
    facts = [],
    image,
  } = props;

  const hasKicker = Boolean(number || rail);

  return (
    <Section id={id} surface={surface} spacing="hero" tint="hero">
      <Container>
        {hasKicker ? (
          // break-words на каждом span: индекс и подпись — отдельные
          // flex-item со своим min-width: auto, и без этого длинная
          // подпись на 390px выносит линейку за край контейнера.
          <div
            className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-t border-rule pt-3 text-caption font-medium uppercase text-fg-muted"
            data-reveal
          >
            {number ? (
              <span className="tabular min-w-0 break-words">{number}</span>
            ) : null}
            {rail ? (
              <span className="min-w-0 break-words">{rail}</span>
            ) : null}
          </div>
        ) : null}

        {/* Ручные переносы включаются только с md — на узком экране они
            дают висячие строки, там заголовок верстается потоком. Тот же
            приём, что в HeroLede; собственная разметка нужна ради
            uppercase и поднятой ступени кегля.

            max-width у заголовка НЕТ намеренно: мера — сама колонка
            контейнера. Любой ch-потолок здесь переносит строки ВТОРОЙ
            раз, поверх авторских переносов из массива headline, — на
            демо-данных max-w-[14ch] при 104px давал четыре строки вместо
            трёх («а не готовый сайт» рвалось посреди фразы). Это ровно
            тот отказ, ради предотвращения которого заведён COMPACT_H1 в
            parts/headlineScale.ts, только с другой стороны. Держать
            строку короткой — работа автора массива headline. */}
        <h1
          className={
            hasKicker
              ? "mt-10 break-words font-heading text-h1 uppercase md:mt-14"
              : "break-words font-heading text-h1 uppercase"
          }
          style={EDITORIAL_H1}
          data-reveal
        >
          {headline.map((line, index) => (
            <span key={index} className="md:block">
              {index === headline.length - 1 ? (
                <span className="text-accent">{line}</span>
              ) : (
                line
              )}
              {index < headline.length - 1 ? " " : null}
            </span>
          ))}
        </h1>

        {lead || actions.length > 0 ? (
          <div
            className="mt-10 grid gap-x-gutter gap-y-8 md:mt-14 lg:grid-cols-12 lg:items-end"
            data-reveal
            style={revealDelay(1)}
          >
            {lead ? (
              <p className="max-w-[46ch] text-lead text-fg-muted lg:col-span-6">
                {lead}
              </p>
            ) : null}

            {actions.length > 0 ? (
              // lg:col-start-7 держит кнопки в правой половине даже без
              // лида — иначе при пустом lead они уезжали бы влево и
              // раскладка теряла бы свою ось.
              <div className="lg:col-span-6 lg:col-start-7">
                <ActionGroup actions={actions} align="end" />
              </div>
            ) : null}
          </div>
        ) : null}
      </Container>

      {image ? (
        // Пропорция задана брейкпоинтами, а не фиксированной высотой
        // (§1.5, п. 3), но сверху стоит потолок: без него 21/9 на 1920
        // даёт 823px — ленту в три четверти экрана, после которой первый
        // экран читается как разворот фотоальбома, а не как афиша.
        //
        // Потолок нужен потому, что у полосы во всю ширину окна ширина
        // растёт быстрее, чем нужно кадру: горизонт между заголовком и
        // цифрами должен остаться полосой на любом мониторе. Он взят в
        // svh, а не в пикселях, чтобы выводиться из окна, а не из
        // магического числа: 64svh — примерно две трети экрана, то есть
        // под полосой всегда остаётся видимый край следующего яруса.
        //
        // Высота по пяти ширинам (для 844/1024/768/900/1080 по высоте):
        // 312 / 341 / 439 / 576 / 691. Потолок включается только начиная
        // с 1440 — на планшете и телефоне работает чистая пропорция.
        <div className="relative mt-14 aspect-[5/4] max-h-[64svh] w-full overflow-hidden sm:aspect-[9/4] md:mt-20 lg:aspect-[21/9]">
          <Image
            src={image}
            alt={headline.join(" ")}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>
      ) : null}

      {facts.length > 0 ? (
        <Container>
          <HeroFacts facts={facts} />
        </Container>
      ) : null}
    </Section>
  );
}

export default Editorial;
