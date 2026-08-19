import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/ui/MarketHeader";
import { Section } from "@/components/ui/Section";
import { SectionTicker } from "@/components/ui/Ticker";
import { revealDelay } from "@/lib/reveal";
import { getInitials } from "../parts/initials";
import { TeamBannerBlock } from "../parts/TeamBannerBlock";
import type { TeamSection } from "@/types/site";

/**
 * Команда семейства `market`: портреты 3:4 без карточек, под кадром имя
 * полужирным и роль приглушённой строкой.
 *
 * В шаблоне уже три раскладки «портреты 3:4 без карточек», и различаются
 * они не сеткой, а тем, ЧЕМ набрана подпись:
 *
 *   • `editorial` — над каждым кадром волосяная линейка с индексом
 *     («01 / 02 / 03»), знак печатной сетки;
 *   • `atelier` — роль капителью с разрядкой 0.16em;
 *   • здесь — обычный набор: имя полужирным, роль строкой ниже. Никаких
 *     капителей и линеек вовсе.
 *
 * Это не «то же самое, только скучнее». В этом семействе всё внимание
 * держит шапка раздела — кричащий акцентный заголовок с шевроном, — и
 * подпись под портретом обязана быть тихой: капитель с разрядкой рядом
 * с таким заголовком спорит с ним за роль главного в блоке.
 *
 * Не читает `social`, `tags`, `link`, `image` и `fillLastRow`: первые
 * три — оправы, вместо которых работает воздух; последний не нужен,
 * потому что пустой слот в сетке с зазором не виден.
 */
export function Market(props: TeamSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    items,
    banner,
    ticker,
  } = props;

  return (
    <Section id={id} surface={surface}>
      <Container>
        <MarketHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
        />

        <ul className="mt-14 grid gap-x-gutter gap-y-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
          {items.map((member, index) => (
            <li
              key={member.name}
              data-reveal
              style={revealDelay(index % 4)}
              className="flex flex-col"
            >
              {/* Бокс кадра один и тот же с фото и без него: без
                  фотографии в нём стоит заглушка с инициалами, и люди с
                  фото и без остаются в ряду одного формата. shrink-0 —
                  ячейка flex-колонка, и без него в высоком ряду кадру
                  подминают высоту. */}
              <div className="ui-media relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-rule">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={`${member.name} — ${member.role}`}
                    fill
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex h-full w-full items-center justify-center font-display text-h1 text-fg-muted"
                  >
                    {getInitials(member.name)}
                  </div>
                )}
              </div>

              <p className="mt-5 text-body font-semibold">{member.name}</p>
              <p className="mt-1 text-small text-fg-muted">{member.role}</p>
              <p className="mt-3 text-small text-fg-muted">{member.focus}</p>

              {/* mt-auto: описания разной длины, стаж обязан стоять на
                  одной линии по всему ряду. */}
              <p className="tabular mt-auto pt-4 text-caption text-fg-muted">
                {member.experience}
              </p>
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

      {ticker ? <SectionTicker text={ticker} /> : null}
    </Section>
  );
}

export default Market;
