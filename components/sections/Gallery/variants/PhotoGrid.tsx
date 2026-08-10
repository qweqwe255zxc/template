import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import { bentoSpan, bentoMediaAspect } from "@/lib/bentoSpan";
import { GalleryHeader } from "../parts/GalleryHeader";
import type { GallerySection } from "@/types/site";

/**
 * Заголовок пилюлей, ряд карточек с фото: категория — плашкой поверх
 * фото (не отдельной строкой), заголовок, ситуация (`problem`), ссылка
 * `link` и дата внизу. Требует `photo` у каждого элемента — без него
 * бокс фото просто не рендерится, карточка остаётся текстовой.
 */
export function PhotoGrid(props: GallerySection) {
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

        <ul className="grid gap-gutter sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <li
              key={`${item.category}-${item.year}-${index}`}
              data-reveal
              style={revealDelay(index % 3)}
              className={fillLastRow ? bentoSpan(index, items.length, { sm: 2, lg: 3 }) : undefined}
            >
              <Card variant="framed" padded={false} className="flex h-full flex-col overflow-hidden">
                {item.photo ? (
                  <div
                    className={cn(
                      "ui-media relative w-full shrink-0 overflow-hidden rounded-none",
                      // bentoMediaAspect несёт и базовый aspect-ratio, и
                      // растяжку под fillLastRow разом — при выключенном
                      // fillLastRow нельзя просто убрать класс целиком
                      // (фото осталось бы без aspect-ratio вовсе), нужен
                      // базовый aspect-[4/3] без каких-либо breakpoint-спанов.
                      fillLastRow
                        ? bentoMediaAspect(index, items.length, { sm: 2, lg: 3 }, "4/3")
                        : "aspect-[4/3]",
                    )}
                  >
                    <Image
                      src={item.photo}
                      alt={item.title ?? item.category}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                      className="object-cover"
                    />
                    <span className="absolute left-4 top-4 rounded-pill bg-bg px-2.5 py-1 text-caption font-medium text-fg">
                      {item.category}
                    </span>
                    {item.status ? (
                      <span className="absolute right-4 top-4 rounded-pill bg-bg px-2.5 py-1 text-caption font-medium text-fg">
                        {item.status}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <div
                  className={cn(
                    "flex flex-1 flex-col p-7 md:p-9",
                    centered && "items-center text-center",
                  )}
                >
                  <h3 className="font-display text-h3">{item.title}</h3>
                  {/* mb-6 — минимальный зазор перед линией независимо от
                      mt-auto: на длинном problem, заполняющем всю карточку,
                      mt-auto схлопывался в 0 и линия ложилась вплотную
                      к тексту. */}
                  <p className="mt-3 mb-6 text-small text-fg-muted">{item.problem}</p>

                  <div
                    className={cn(
                      "mt-auto flex items-center justify-between gap-4 border-t border-rule pt-5",
                      centered && "w-full",
                    )}
                  >
                    {item.link ? (
                      <Link
                        href={item.link.href}
                        className="inline-flex items-center gap-1.5 text-small font-medium text-accent"
                      >
                        {item.link.label}
                        <ArrowRight aria-hidden="true" className="size-4" />
                      </Link>
                    ) : null}
                    {item.date ? (
                      <span className="text-small text-fg-muted">{item.date}</span>
                    ) : null}
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export default PhotoGrid;
