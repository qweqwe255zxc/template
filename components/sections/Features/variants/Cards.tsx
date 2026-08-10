import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { revealDelay } from "@/lib/reveal";
import { bentoSpan, bentoMediaAspect, type BentoColumns } from "@/lib/bentoSpan";
import { cn } from "@/lib/cn";
import { FeatureContent } from "../parts/FeatureContent";
import type { FeaturesSection } from "@/types/site";

/**
 * Карточки. Вариант по умолчанию в «Стандарте» и единственный (вместе с
 * bento), который поддерживает photo на элементах: у карточки высота
 * ячейки независимая, а фото сидит в фиксированном aspect-ratio боксе.
 *
 * Ссылка «Подробнее» (`item.link`) и кнопка под сеткой (`action`) раньше
 * жили отдельным вариантом (`cards-cta`) — отличался только этим да
 * центрированной шапкой-пилюлей. Не заводить `cards-cta` обратно
 * отдельным variant: оба поля читаются сами, если заданы в конфиге.
 *
 * Сетка — `sm:grid-cols-2 lg:grid-cols-3` (columns=3, дефолт), а не
 * `md:grid-cols-3` напрямую: между 768 и 1023px три карточки в ряд едва
 * помещались — текст внутри зажимался. Промежуточная ступень в 2 колонки
 * с sm — тот же приём, что раньше был только у cards-cta.
 *
 * Card variant="framed" — «карточка по умолчанию»: её глубину задаёт
 * тариф, а не этот файл. Ставить тут elevated не нужно.
 */
export function Cards(props: FeaturesSection) {
  const {
    id,
    surface = "surface",
    // 3 в ряд по умолчанию: на 2 колонках карточка растягивается почти
    // на половину контейнера, и текст/пункты внутри читаются слишком
    // просторно по сравнению с остальными карточными секциями страницы.
    columns = 3,
    number,
    eyebrow,
    title,
    lead,
    action,
    items,
    iconShape,
    fillLastRow = true,
  } = props;

  const gridColumns: BentoColumns = columns === 2 ? { sm: 2 } : { sm: 2, lg: 3 };

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <Container>
        <SectionHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
        />

        <div
          className={cn(
            "mt-14 grid md:mt-20",
            columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
            "gap-gutter",
          )}
        >
          {items.map((item, index) => (
            <Card
              key={item.title}
              variant="framed"
              className={cn(
                "flex h-full flex-col",
                fillLastRow && bentoSpan(index, items.length, gridColumns),
              )}
            >
              <div
                className="flex flex-1 flex-col"
                data-reveal
                style={revealDelay(index % columns)}
              >
                <FeatureContent
                  item={item}
                  iconLayout="inline"
                  mediaAspectClassName={
                    fillLastRow
                      ? bentoMediaAspect(index, items.length, gridColumns, "4/3")
                      : undefined
                  }
                />

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
            </Card>
          ))}
        </div>

        {action ? (
          <div className="mt-12 text-center md:mt-16">
            <Button href={action.href} variant={action.variant ?? "primary"}>
              {action.label}
            </Button>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

export default Cards;
