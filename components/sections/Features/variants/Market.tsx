import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/ui/MarketHeader";
import { Section } from "@/components/ui/Section";
import { SectionTicker } from "@/components/ui/Ticker";
import { cn } from "@/lib/cn";
import { getIcon } from "@/lib/icons";
import { revealDelay } from "@/lib/reveal";
import type { FeaturesSection } from "@/types/site";

/**
 * Возможности семейства `market`: сетка ПЛОСКИХ карточек, акцентная
 * иконка голым глифом над заголовком.
 *
 * Плоскость тут — не экономия, а сам приём. У исходного бренда карточка
 * лежит на фоне листом другого тона: глубина берётся из контраста цвета,
 * а не из подъёма. Поэтому карточка здесь — не общий `Card` (он тянет
 * глубину пресета и в «Стандарте» получил бы тень с подъёмом на hover), а
 * свой лист `bg-card` со скруглением и волосяной рамкой. Единственная
 * карточная раскладка шаблона, которая сознательно не участвует в
 * тарифной механике оформления: в обоих тарифах она выглядит одинаково.
 *
 * Рамка при этом обязательна, хотя в исходнике её нет: на секции
 * `surface="surface"` токен `--surface-card` совпадает с фоном секции
 * один в один (замерено: rgb(255,255,255) против rgb(255,255,255)), и
 * без линии карточка там просто исчезает. §1.5 требует отличимости от
 * фона в обоих тарифах, и в «Экономе» это именно рамка. Плоскость от
 * неё не страдает — тени и подъёма как не было, так и нет.
 *
 * Чем отличается от двух соседей с той же сеткой:
 *
 *   • `cards` — иконка в ПЛАШКЕ и в одну строку с заголовком;
 *   • `product` — иконка в плашке отдельным ярусом над заголовком;
 *   • здесь — иконка БЕЗ плашки, отдельным ярусом и АКЦЕНТНАЯ.
 *
 * Акцентная иконка — отступление от общего правила шаблона «иконки
 * красим в fg-muted» (см. lib/icons.ts), и оно оговорено там же. В этом
 * семействе акцент делает всю работу разом: заголовки разделов, цифры,
 * иконки, кнопки. Приглушённая иконка на таком листе читалась бы как
 * забытая от другой раскладки.
 *
 * `iconShape` не читается: плашки нет вовсе, форме нечего задавать.
 * `photo` не поддерживается — роутер уводит такую секцию в `cards`.
 * `fillLastRow` не читается: в сетке с зазором пустой слот — это воздух,
 * и его не видно (в отличие от замкнутой решётки `atelier`).
 */
export function Market(props: FeaturesSection) {
  const {
    id,
    surface = "surface",
    columns = 3,
    number,
    eyebrow,
    title,
    lead,
    action,
    items,
    ticker,
  } = props;

  return (
    <Section id={id} surface={surface}>
      <Container>
        <MarketHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
        />

        <div
          className={cn(
            "mt-14 grid gap-gutter md:mt-20",
            columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {items.map((item, index) => {
            const Icon = getIcon(item.icon);

            return (
              // h-full + flex-col: карточки одного ряда одной высоты, и
              // ссылка внизу прижата mt-auto к общей линии (§1.5, п. 4).
              // Про обязательную рамку — в шапке файла.
              <div
                key={item.title}
                className="flex h-full flex-col rounded-lg border border-rule bg-card p-7 md:p-8"
                data-reveal
                style={revealDelay(index % columns)}
              >
                {Icon ? (
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.75}
                    className="size-7 text-accent [[data-surface=accent]_&]:text-fg [[data-surface=ink]_&]:text-fg"
                  />
                ) : null}

                <h3
                  className={cn(
                    "font-display text-lead font-semibold",
                    Icon && "mt-5",
                  )}
                >
                  {item.number ? (
                    <span className="tabular text-fg-muted">
                      {item.number}.{" "}
                    </span>
                  ) : null}
                  {item.title}
                </h3>

                <p className="mt-3 text-small text-fg-muted">{item.text}</p>

                {item.points?.length ? (
                  <ul className="mt-4 flex flex-col gap-1.5 text-small text-fg-muted">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                ) : null}

                {item.link ? (
                  <Link
                    href={item.link.href}
                    className="mt-auto inline-flex items-center gap-1.5 pt-6 text-small font-medium text-accent"
                  >
                    {item.link.label}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>

        {action ? (
          <div className="mt-12 text-center md:mt-16">
            <Button href={action.href} variant={action.variant ?? "primary"}>
              {action.label}
            </Button>
          </div>
        ) : null}
      </Container>

      {ticker ? <SectionTicker text={ticker} /> : null}
    </Section>
  );
}

export default Market;
