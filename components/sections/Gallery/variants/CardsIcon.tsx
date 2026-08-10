import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import { bentoSpan } from "@/lib/bentoSpan";
import { GalleryHeader } from "../parts/GalleryHeader";
import type { GallerySection } from "@/types/site";

/**
 * Заголовок с кнопкой в шапке, дальше — карточки: иконка в плашке, год
 * мелким капсом справа, заголовок, ситуация (`problem`), категория и
 * ссылка `link` внизу.
 */
export function CardsIcon(props: GallerySection) {
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
    iconShape,
    fillLastRow = true,
  } = props;
  const centered = align === "center";

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <Container>
        <GalleryHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          action={action}
          className="mb-12 md:mb-16"
        />

        <ul className="grid gap-gutter sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = getIcon(item.icon);

            return (
              <li
                key={`${item.category}-${item.year}-${index}`}
                className={fillLastRow ? bentoSpan(index, items.length, { sm: 2, lg: 3 }) : undefined}
              >
                <Card variant="framed" className="flex h-full flex-col">
                  <div
                    className={cn(
                      "flex flex-1 flex-col",
                      centered && "items-center text-center",
                    )}
                    data-reveal
                    style={revealDelay(index % 3)}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-between gap-4",
                        centered && "w-full",
                      )}
                    >
                      {Icon ? (
                        <span className="icon-tile">
                          <Icon aria-hidden="true" strokeWidth={1.5} className="size-5" />
                        </span>
                      ) : null}
                      <span className="tabular text-caption uppercase text-fg-muted">
                        {item.year}
                      </span>
                    </div>

                    <h3 className="mt-5 font-display text-h3">{item.title ?? item.category}</h3>
                    <p className="mt-3 text-small text-fg-muted">{item.problem}</p>

                    <div
                      className={cn(
                        "mt-auto flex items-center justify-between gap-4 pt-6",
                        centered && "w-full",
                      )}
                    >
                      <span className="text-small font-medium text-accent">
                        {item.category}
                      </span>

                      {item.link ? (
                        <Link
                          href={item.link.href}
                          className="inline-flex items-center gap-1.5 text-small font-medium"
                        >
                          {item.link.label}
                          <ArrowRight aria-hidden="true" className="size-4" />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}

export default CardsIcon;
