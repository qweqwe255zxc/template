import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import { bentoSpan, bentoMediaAspect } from "@/lib/bentoSpan";
import { StepsHeader } from "../parts/StepsHeader";
import type { StepsSection } from "@/types/site";

/**
 * Ряд карточек: кружок-номер с соединительной линией, иконка, заголовок,
 * описание, фото в подвале. `item.featured` переводит карточку на
 * ink-поверхность — обычно последний шаг («Результат»).
 */
export function NumberedCards(props: StepsSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    items,
    headerAlign,
    iconShape,
    fillLastRow = true,
  } = props;

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <Container>
        <StepsHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          align={headerAlign}
          className="mb-12 md:mb-16"
        />

        <ol className="grid gap-gutter sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, index) => {
            const Icon = getIcon(item.icon);

            return (
              <li
                key={item.number}
                data-reveal
                style={revealDelay(index)}
                className={fillLastRow ? bentoSpan(index, items.length, { sm: 2, lg: 3, xl: 4 }) : undefined}
              >
                <Card
                  variant="framed"
                  // data-surface — на самой Card, а не на <li>: .ui-card
                  // красит и фон, и border-radius одним и тем же правилом,
                  // значит скруглённый угол не может просвечивать чужим
                  // фоном родителя. text-fg переезжает вместе с
                  // data-surface: h3/p ниже без своего цвета наследуют уже
                  // вычисленный color, а не пересчитывают var(--color-fg)
                  // заново — без text-fg тут текст остался бы тёмным.
                  className={cn("h-full", item.featured && "text-fg")}
                  data-surface={item.featured ? "ink" : undefined}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "tabular flex size-9 shrink-0 items-center justify-center rounded-full border text-small font-medium",
                        item.featured ? "border-fg-muted/40 text-fg" : "border-rule text-fg",
                      )}
                    >
                      {item.number}
                    </span>
                    <span aria-hidden="true" className="h-px flex-1 bg-rule-strong" />
                  </div>

                  {Icon ? (
                    <span className="icon-tile mt-5">
                      <Icon aria-hidden="true" strokeWidth={1.5} className="size-6" />
                    </span>
                  ) : null}

                  <h3 className="mt-4 max-w-[22ch] font-heading text-h4">{item.title}</h3>
                  <p className="mt-2 text-small text-fg-muted">{item.text}</p>

                  {item.photo ? (
                    <div
                      className={cn(
                        "ui-media relative mt-5 w-full shrink-0 overflow-hidden",
                        // bentoMediaAspect несёт и базовый aspect-ratio, и
                        // растяжку под fillLastRow разом — при false нужен
                        // явный базовый aspect-[4/3], а не полное снятие класса.
                        fillLastRow
                          ? bentoMediaAspect(index, items.length, { sm: 2, lg: 3, xl: 4 }, "4/3")
                          : "aspect-[4/3]",
                      )}
                    >
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

export default NumberedCards;
