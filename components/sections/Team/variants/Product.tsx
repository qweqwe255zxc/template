import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ProductHeader } from "@/components/ui/ProductHeader";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { fillLastRowClasses } from "@/lib/gridFill";
import { revealDelay } from "@/lib/reveal";
import { getInitials } from "../parts/initials";
import { MemberSocial } from "../parts/MemberSocial";
import { TeamBannerBlock } from "../parts/TeamBannerBlock";
import type { TeamSection } from "@/types/site";

const GRID_BREAKPOINTS = [
  { prefix: "sm:", cols: 2 },
  { prefix: "lg:", cols: 4 },
] as const;

/**
 * Команда семейства `product`: карточки с КРУГЛЫМ аватаром.
 *
 * Это и есть отличие от остальных карточных вариантов Team, где портрет
 * занимает прямоугольник 3:4 во всю ширину карточки (`cards`,
 * `photo-cards`, `tags-cards`). Круглый аватар 64px — знак продуктового
 * интерфейса: так человек подписывает коммент, тикет или комментарий в
 * панели, и рядом с карточками метрик он читается как элемент того же
 * интерфейса, а не как страница журнала.
 *
 * Ближайший сосед — `badge-avatars`, у которого аватар тоже круглый. Там
 * у него значок-иконка в углу, а роль вынесена в плашку `Badge`; здесь
 * значка нет, а роль набрана акцентной капителью. В карточке этого
 * семейства ровно одно акцентное пятно, и роль — оно (в шапке раздела ту
 * же роль играет колонтитул `ProductHeader`).
 *
 * `tags` и `link` вариант не читает — это ручки `tags-cards`/`bento`;
 * четыре плашки под описанием ломают ровный низ ряда, который тут держит
 * стаж на `mt-auto`.
 */
export function Product(props: TeamSection) {
  const {
    id,
    surface = "surface",
    number,
    eyebrow,
    title,
    lead,
    items,
    banner,
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
        />

        <ul className="mt-14 grid gap-gutter sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
          {items.map((member, index) => (
            <li
              key={member.name}
              className={cn("flex", spanClasses[index] || undefined)}
            >
              <Card
                variant="framed"
                className="flex h-full w-full flex-col"
                data-reveal
                style={revealDelay(index % 4)}
              >
                {/* Единый бокс и с фото, и без него: пока портрета нет, в
                    том же круге стоят инициалы — иначе в одном ряду
                    карточка с фото и без фото начинают текст на разной
                    высоте. */}
                <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-rule">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={`${member.name} — ${member.role}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-full w-full items-center justify-center font-display text-h3 text-fg-muted"
                    >
                      {getInitials(member.name)}
                    </span>
                  )}
                </span>

                <h3 className="mt-5 font-display text-h3">{member.name}</h3>
                <p className="mt-2 text-caption font-bold uppercase tracking-[0.08em] text-accent">
                  {member.role}
                </p>
                <p className="mt-4 text-small text-fg-muted">{member.focus}</p>

                {/* mt-auto прижимает стаж к низу: focus у людей разной
                    длины, и без этого нижние строки ряда стоят на разных
                    высотах. Работает, потому что Card выше объявлен
                    flex-колонкой на всю высоту ячейки. */}
                <p className="tabular mt-auto pt-5 text-small text-fg-muted">
                  {member.experience}
                </p>

                <MemberSocial items={member.social} className="mt-4" />
              </Card>
            </li>
          ))}
        </ul>

        {banner ? (
          <TeamBannerBlock
            banner={banner}
            tone={banner.tone ?? "soft"}
            className="mt-14 md:mt-20"
          />
        ) : null}
      </Container>
    </Section>
  );
}

export default Product;
