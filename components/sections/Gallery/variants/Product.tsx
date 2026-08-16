import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ProductHeader } from "@/components/ui/ProductHeader";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { fillLastRowClasses } from "@/lib/gridFill";
import { revealDelay } from "@/lib/reveal";
import type { GallerySection } from "@/types/site";

const GRID_BREAKPOINTS = [
  { prefix: "sm:", cols: 2 },
  { prefix: "lg:", cols: 3 },
] as const;

/**
 * Кейсы семейства `product`: карточки результатов на тёмной поверхности.
 *
 * `surface` по умолчанию "ink" — это единственный тёмный блок в середине
 * страницы, и он тут не для ритма (§3), а по смыслу: кейс в этом
 * семействе подаётся цифрой, а цифра на тёмном читается как показание
 * прибора. Ровно тот же довод, что у Hero/product.
 *
 * Порядок в карточке повторяет исходный приём: клиент и отрасль в одну
 * строку по базовой линии, дальше что было сделано, дальше — полоса
 * метрик на линейке. Первая метрика акцентная: в паре «−72% времени» и
 * «14 дней» первая и есть результат, вторая её обрамляет.
 *
 * Метрики берутся из `item.stats` — того же поля, что читает
 * `photo-bento`. Без него полоса просто не рисуется, и карточка
 * остаётся текстовой: это нормальный кейс без измеренного результата, а
 * не сбой данных.
 *
 * `photo` вариант НЕ читает, в отличие от `photo-grid`/`photo-bento`.
 * Причина не в лени: карточка тут построена вокруг цифр, а фотография в
 * ней занимает верхние 40% высоты и перебивает их — в исходном приёме
 * блок кейсов тоже без фотографий, хотя фотографии на странице есть.
 * Нужны кадры — у секции есть `photo-grid`.
 */
export function Product(props: GallerySection) {
  const {
    id,
    surface = "ink",
    number,
    eyebrow,
    title,
    lead,
    action,
    items,
    note,
    fillLastRow = true,
  } = props;

  const spanClasses = fillLastRow
    ? fillLastRowClasses(items.length, GRID_BREAKPOINTS)
    : [];

  return (
    <Section id={id} surface={surface}>
      <Container>
        <ProductHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          action={
            action ? (
              <Button href={action.href} variant={action.variant ?? "secondary"}>
                {action.label}
              </Button>
            ) : null
          }
        />

        <ul className="mt-14 grid gap-gutter sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {items.map((item, index) => (
            <li
              key={`${item.category}-${item.year}-${index}`}
              className={cn("flex", spanClasses[index] || undefined)}
            >
              <Card
                variant="framed"
                className="flex h-full w-full flex-col"
                data-reveal
                style={revealDelay(index % 3)}
              >
                <div className="flex items-baseline justify-between gap-4">
                  {/* break-words рядом с min-w-0: min-w-0 разрешает
                      КОРОБКЕ сжаться, но длинное неразрывное название
                      («Штаб-квартира») всё равно не переносится и вылезает
                      за карточку — на 1024 строка требовала 207px при
                      доступных 176. */}
                  <h3 className="min-w-0 break-words font-display text-h3">
                    {item.title ?? item.category}
                  </h3>
                  <span className="tabular shrink-0 text-caption text-fg-muted">
                    {item.year}
                  </span>
                </div>

                {item.title ? (
                  <p className="mt-2 text-caption font-medium uppercase text-fg-muted">
                    {item.category}
                  </p>
                ) : null}

                <p className="mt-5 text-body text-fg-muted">{item.problem}</p>
                <p className="mt-3 text-body">{item.result}</p>

                {item.status || item.tags?.length ? (
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {item.status ? (
                      <Badge variant="soft">{item.status}</Badge>
                    ) : null}
                    {item.tags?.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}

                {/* mt-auto: описания у кейсов разной длины, а полоса
                    метрик — нижняя граница карточки, и по всему ряду она
                    обязана стоять на одной линии (§1.5, п. 4). */}
                {item.stats && item.stats.length > 0 ? (
                  <dl className="mt-auto flex flex-wrap gap-x-10 gap-y-4 border-t border-rule pt-6">
                    {item.stats.map((stat, statIndex) => (
                      <div key={stat.label}>
                        <dt
                          className={cn(
                            "tabular font-display text-h2",
                            statIndex === 0 && "text-accent",
                          )}
                        >
                          {stat.value}
                        </dt>
                        <dd className="mt-1.5 text-caption text-fg-muted">
                          {stat.label}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                {item.link ? (
                  <Link
                    href={item.link.href}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-small font-medium text-accent",
                      item.stats && item.stats.length > 0
                        ? "mt-6"
                        : "mt-auto pt-6",
                    )}
                  >
                    {item.link.label}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>

        {note ? (
          <p className="mt-12 max-w-[62ch] text-small text-fg-muted md:mt-16">
            {note}
          </p>
        ) : null}
      </Container>
    </Section>
  );
}

export default Product;
