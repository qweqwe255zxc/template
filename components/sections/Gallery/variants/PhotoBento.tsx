import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { revealDelay } from "@/lib/reveal";
import { bentoSpan, bentoMediaAspect } from "@/lib/bentoSpan";
import { cn } from "@/lib/cn";
import { GalleryHeader } from "../parts/GalleryHeader";
import type { GallerySection } from "@/types/site";

/**
 * Асимметричная витрина кейсов: первый элемент — крупный, во всю
 * ширину, с фото и `stats` (сумма/срок и т.п.), остальные — сетка со
 * спанами из `lib/bentoSpan.ts` (растягивается на 2 слота только
 * когда это ровно закрывает ряд, фото — если задано, иначе просто
 * карточка).
 */
export function PhotoBento(props: GallerySection) {
  const {
    id,
    surface = "surface",
    number,
    eyebrow,
    title,
    lead,
    action,
    items,
    align = "left",
    fillLastRow = true,
  } = props;
  const centered = align === "center";
  const [first, ...rest] = items;

  return (
    <Section id={id} surface={surface}>
      <Container>
        <GalleryHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          action={action}
          className="mb-12 md:mb-16"
        />

        {first ? (
          <Card
            variant="framed"
            padded={false}
            className={cn(
              "mb-6 grid overflow-hidden",
              // md:grid-cols-2 только когда есть фото на вторую колонку —
              // без него сетка резервировала пустую правую половину карточки.
              first.photo && "md:grid-cols-2",
            )}
            data-reveal
          >
            {first.photo ? (
              <div className="ui-media relative aspect-[4/3] w-full overflow-hidden rounded-none md:aspect-auto">
                <Image
                  src={first.photo}
                  alt={first.title ?? first.category}
                  fill
                  sizes="(min-width: 768px) 42vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}

            <div
              className={cn(
                "flex flex-col justify-center p-7 md:p-10",
                centered && "items-center text-center",
              )}
            >
              <p className="text-caption font-medium uppercase text-fg">
                {first.category}
              </p>
              <h3 className="mt-3 font-display text-h2">{first.title ?? first.category}</h3>
              <p className="mt-4 text-body text-fg-muted">{first.problem}</p>

              {first.stats && first.stats.length > 0 ? (
                <dl
                  className={cn(
                    "mt-6 flex flex-wrap gap-x-8 gap-y-4",
                    centered && "justify-center",
                  )}
                >
                  {first.stats.map((stat) => (
                    <div key={stat.label}>
                      <dt className="text-caption font-medium uppercase text-fg-muted">
                        {stat.label}
                      </dt>
                      <dd className="tabular mt-1 font-display text-h3 text-accent">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {first.link ? (
                <Link
                  href={first.link.href}
                  className="mt-6 inline-flex items-center gap-1.5 text-small font-medium text-fg"
                >
                  {first.link.label}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              ) : null}
            </div>
          </Card>
        ) : null}

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((item, index) => (
            <li
              key={`${item.category}-${item.year}-${index}`}
              data-reveal
              style={revealDelay(index)}
              className={fillLastRow ? bentoSpan(index, rest.length, { sm: 2, lg: 3 }) : undefined}
            >
              <Card
                variant="framed"
                padded={!item.photo}
                className={cn("flex h-full flex-col", item.photo && "overflow-hidden")}
              >
                {item.photo ? (
                  <div
                    className={cn(
                      "ui-media relative w-full shrink-0 overflow-hidden rounded-none",
                      fillLastRow
                        ? bentoMediaAspect(index, rest.length, { sm: 2, lg: 3 }, "4/3")
                        : "aspect-[4/3]",
                    )}
                  >
                    <Image
                      src={item.photo}
                      alt={item.title ?? item.category}
                      fill
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}

                <div
                  className={cn(
                    "flex flex-1 flex-col",
                    item.photo && "p-7 md:p-9",
                    centered && "items-center text-center",
                  )}
                >
                  <p className="text-caption font-medium uppercase text-fg-muted">
                    {item.category}
                  </p>
                  <h3 className="mt-2 font-display text-h4">{item.title ?? item.category}</h3>
                  <p className="mt-2 text-small text-fg-muted">{item.problem}</p>

                  {item.link ? (
                    <Link
                      href={item.link.href}
                      className="mt-auto inline-flex items-center gap-1.5 pt-4 text-small font-medium text-fg"
                    >
                      {item.link.label}
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  ) : null}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export default PhotoBento;
