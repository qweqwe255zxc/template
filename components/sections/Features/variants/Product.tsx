import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ProductHeader } from "@/components/ui/ProductHeader";
import { Section } from "@/components/ui/Section";
import { bentoMediaAspect, bentoSpan, type BentoColumns } from "@/lib/bentoSpan";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import { FeatureContent } from "../parts/FeatureContent";
import type { FeaturesSection } from "@/types/site";

/**
 * Возможности семейства `product`: карточки с плашкой иконки НАД
 * заголовком.
 *
 * Чем отличается от `cards`, с которым делит сетку и `FeatureContent`:
 *
 *   1. Иконка стоит отдельным ярусом над заголовком (`iconLayout="stack"`),
 *      а не в одну строку с ним. В исходном приёме плашка 44×44 — самый
 *      заметный объект карточки после заголовка, и в строке она эту роль
 *      теряет.
 *   2. Шапка раздела — `ProductHeader`: акцентный колонтитул прямо над
 *      заголовком, без линейки сверху. У `cards` — общий `SectionHeader`
 *      с приглушённым колонтитулом на левом поле.
 *
 * Больше ничем и не должно: сквозное семейство держится на том, что одна
 * и та же страница набрана одним приёмом, а не на том, что каждая его
 * секция придумывает себе новую сетку.
 *
 * `mediaInset` передаётся, потому что фото лежит внутри padded-карточки:
 * радиус фото обязан отставать от радиуса карточки ровно на её паддинг,
 * иначе в «Стандарте» дуги не делят центр (см. .ui-media-inset).
 */
export function Product(props: FeaturesSection) {
  const {
    id,
    surface = "paper",
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
        <ProductHeader
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
                  iconLayout="stack"
                  mediaInset
                  mediaAspectClassName={
                    fillLastRow
                      ? bentoMediaAspect(index, items.length, gridColumns, "4/3")
                      : undefined
                  }
                />

                {item.link ? (
                  // mt-auto: описания у услуг разной длины, а ссылки
                  // обязаны стоять на одной линии по всему ряду (§1.5,
                  // п. 4). Работает, потому что обёртка выше — flex-1
                  // колонка внутри карточки на всю высоту ячейки.
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

export default Product;
