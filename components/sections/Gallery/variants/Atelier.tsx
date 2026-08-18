import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { AtelierHeader } from "@/components/ui/AtelierHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { revealDelay } from "@/lib/reveal";
import type { GallerySection } from "@/types/site";

/**
 * Кейсы семейства `atelier`: портретные кадры 3:4 без карточек, подпись
 * лежит прямо на поверхности под кадром.
 *
 * Чем отличается от `editorial`, у которого раскладка того же рода:
 *
 *   • Кадр ПОРТРЕТНЫЙ (3:4), а не альбомный (4:3). Разница не
 *     косметическая: три портрета в ряд задают странице вертикальный
 *     ритм, на котором держится весь приём — тот же формат носят
 *     портреты команды в этом семействе, и два раздела читаются как
 *     один разворот.
 *   • Подпись «категория · год» стоит НАД заголовком отдельной строкой
 *     капителью с разрядкой 0.16em. У editorial год выключен вправо в
 *     одну строку с названием (типографская выключка по краям колонки),
 *     здесь — обычная строка-указатель перед заголовком.
 *   • Шапка раздела своя, со штрихом под заголовком, и `action`
 *     («Все кейсы») стоит справа по нижнему краю.
 *
 * Кейсу без `photo` достаётся текстовая ячейка: сетка не ломается, но
 * ряд, где кадр есть у одного из трёх, выглядит сбоем данных — это
 * ограничение данных, а не раскладки, и чинится оно в конфиге.
 *
 * `align: "center"` не читается: подпись-указатель, заголовок и текст
 * образуют левую вертикаль под кадром, и по центру от неё остаются три
 * разъехавшиеся строки.
 */
export function Atelier(props: GallerySection) {
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
        <AtelierHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          align="start"
          action={
            action ? (
              <Link
                href={action.href}
                className="inline-flex border-b border-rule-strong pb-1.5 text-caption font-medium uppercase tracking-[0.16em] text-fg-muted transition-colors hover:border-accent hover:text-accent"
              >
                {action.label}
              </Link>
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
                // shrink-0: ячейка — flex-колонка, и бокс с фиксированной
                // пропорцией обязан быть неусадочным, иначе в высоком
                // ряду кадры перестают быть одного формата.
                <div className="ui-media relative aspect-[3/4] w-full shrink-0 overflow-hidden">
                  <Image
                    src={item.photo}
                    alt={item.title ?? item.category}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <p
                className={
                  item.photo
                    ? "mt-6 text-caption font-medium uppercase tracking-[0.16em] text-fg-muted"
                    : "border-t border-rule pt-5 text-caption font-medium uppercase tracking-[0.16em] text-fg-muted"
                }
              >
                {/* Год отделён средней точкой, а не выключен вправо: это
                    одна строка-указатель, а не таблица с двумя колонками. */}
                {[item.category, item.year].filter(Boolean).join(" · ")}
              </p>

              <h3 className="mt-3 font-display text-h3">
                {item.title ?? item.problem}
              </h3>

              {item.title ? (
                <p className="mt-3 text-small text-fg-muted">{item.problem}</p>
              ) : null}
              <p className="mt-2 text-small text-fg-muted">{item.result}</p>

              {item.status || item.tags?.length || item.link || item.date ? (
                // mt-auto: истории у кейсов разной длины, а нижние строки
                // обязаны стоять на одной линии по всему ряду.
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
                      className="border-b border-rule-strong pb-1 text-caption font-medium uppercase tracking-[0.16em] text-fg-muted transition-colors hover:border-accent hover:text-accent"
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

export default Atelier;
