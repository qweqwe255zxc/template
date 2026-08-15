import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EditorialHeader } from "@/components/ui/EditorialHeader";
import { Section } from "@/components/ui/Section";
import { revealDelay } from "@/lib/reveal";
import type { GallerySection } from "@/types/site";

/**
 * Кейсы семейства `editorial`: сетка фотографий без карточек — подпись
 * лежит прямо на бумаге под кадром, как в печатном каталоге работ.
 *
 * Порядок подписи под фото: название и год в одну строку по базовой
 * линии (`justify-between`), под ними категория капителью, дальше
 * ситуация и результат обычным мелким набором.
 *
 * Почему тут нет `Card`. Карточка в «Стандарте» приносит свою
 * поверхность, радиус и тень — и фотография, единственный объект
 * ячейки, оказывается вставленной в рамку внутри рамки. В этом
 * семействе объект — сам кадр, а рамку ему даёт край фотографии.
 * Скругление же остаётся тарифным: `.ui-media` в «Экономе» даёт
 * прямой угол исходного приёма, в «Стандарте» — скруглённый.
 *
 * `note` рендерится сноской под сеткой (как в `table`), `action` — в
 * шапке справа от заголовка. `align: "center"` вариант НЕ читает:
 * строка «название — год» держится на выключке по краям колонки, и по
 * центру от неё остаётся два слова, разъехавшихся в разные стороны.
 * Кейсам без `photo` ячейка достаётся текстовой — сетка не ломается,
 * но ряд с одной фотографией из трёх выглядит сбоем данных, а не
 * дизайном.
 */
export function Editorial(props: GallerySection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    action,
    items,
    note,
  } = props;

  return (
    <Section id={id} surface={surface}>
      <Container>
        <EditorialHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          action={
            action ? (
              <Button href={action.href} variant={action.variant ?? "quiet"}>
                {action.label}
              </Button>
            ) : null
          }
        />

        <ul className="mt-14 grid gap-x-gutter gap-y-14 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {items.map((item, index) => (
            <li
              key={`${item.category}-${item.year}-${index}`}
              data-reveal
              style={revealDelay(index % 3)}
              className="flex flex-col"
            >
              {item.photo ? (
                // shrink-0: ячейка — flex-колонка, и бокс с фиксированным
                // aspect-ratio обязан быть неусадочным, иначе в высоком
                // ряду фото перестают быть одного формата.
                <div className="ui-media relative aspect-[4/3] w-full shrink-0 overflow-hidden">
                  <Image
                    src={item.photo}
                    alt={item.title ?? item.category}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <div
                className={
                  item.photo
                    ? "mt-5 flex items-baseline justify-between gap-4"
                    : "flex items-baseline justify-between gap-4 border-t border-rule pt-5"
                }
              >
                <h3 className="min-w-0 font-display text-h3">
                  {item.title ?? item.category}
                </h3>
                <span className="tabular shrink-0 text-caption text-fg-muted">
                  {item.year}
                </span>
              </div>

              {item.title ? (
                <p className="mt-3 text-caption font-medium uppercase text-fg-muted">
                  {item.category}
                </p>
              ) : null}

              <p className="mt-4 text-small text-fg-muted">{item.problem}</p>
              <p className="mt-2 text-small">{item.result}</p>

              {item.status || item.tags?.length || item.link || item.date ? (
                // mt-auto: фабулы у кейсов разной длины, а нижние строки
                // должны стоять на одной линии по всему ряду — иначе
                // низ ряда читается рваным.
                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6">
                  {item.status ? (
                    <Badge variant="soft">{item.status}</Badge>
                  ) : null}
                  {item.tags?.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                  {item.link ? (
                    <Link
                      href={item.link.href}
                      className="text-caption font-medium uppercase text-fg-muted transition-colors hover:text-fg"
                    >
                      {item.link.label}
                    </Link>
                  ) : null}
                  {item.date ? (
                    <span className="ml-auto text-caption text-fg-muted">
                      {item.date}
                    </span>
                  ) : null}
                </div>
              ) : null}
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

export default Editorial;
