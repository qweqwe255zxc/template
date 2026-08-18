import Image from "next/image";
import { AtelierHeader } from "@/components/ui/AtelierHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { revealDelay } from "@/lib/reveal";
import { getInitials } from "../parts/initials";
import { TeamBannerBlock } from "../parts/TeamBannerBlock";
import type { TeamSection } from "@/types/site";

/**
 * Команда семейства `atelier`: портреты 3:4 в четыре колонки, подпись
 * лежит прямо на поверхности под кадром — имя, роль капителью с
 * разрядкой, строка о практике.
 *
 * Формат кадра общий с кейсами этого же семейства (`Gallery/atelier`) и
 * это не совпадение: два раздела с портретными кадрами одного
 * соотношения читаются как один разворот, и именно на этом держится
 * вертикальный ритм страницы.
 *
 * Чем отличается от `editorial`, где портреты тоже 3:4 и тоже без
 * карточек: там над каждым кадром волосяная линейка с индексом
 * («01 / 02 / 03») — знак печатной сетки. Здесь линейки нет вовсе, а
 * различитель — разрядка роли (0.16em, как у всех капительных строк
 * семейства) и четыре колонки вместо трёх.
 *
 * Не читает `social`, `tags`, `link`, `image` и `fillLastRow`. Первые
 * три — оправы, вместо которых здесь работает воздух; последний — потому
 * что растянутая на две колонки ячейка ломает высоту кадра, а
 * выравнивать её пришлось бы удвоенной пропорцией, которая в ряду
 * портретов читается как чужая фотография (см. память проекта о
 * Team/bento).
 *
 * `alignExperienceBottom` не нужен: ячейка тут всегда flex-колонка, и
 * строка о практике всегда прижата к низу — иначе в ряду с разной
 * длиной описания она стояла бы на четырёх разных высотах (§1.5, п. 4).
 */
export function Atelier(props: TeamSection) {
  const {
    id,
    surface = "surface",
    number,
    eyebrow,
    title,
    lead,
    items,
    banner,
  } = props;

  return (
    <Section id={id} surface={surface}>
      <Container>
        <AtelierHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          className="mb-14 md:mb-20"
        />

        <ul className="grid gap-x-gutter gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((member, index) => (
            <li
              key={member.name}
              data-reveal
              style={revealDelay(index % 4)}
              className="flex flex-col"
            >
              {/* Бокс кадра один и тот же с фото и без него: пока
                  фотография не задана, в нём стоит заглушка с инициалами
                  — так люди с фото и без остаются в ряду одного формата.
                  shrink-0 нужен потому, что ячейка — flex-колонка, и без
                  него в высоком ряду кадру подминают высоту. */}
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

              <h3 className="mt-6 font-display text-h3">{member.name}</h3>

              <p className="mt-2 text-caption font-medium uppercase tracking-[0.16em] text-fg-muted">
                {member.role}
              </p>

              <p className="mt-4 text-small text-fg-muted">{member.focus}</p>

              <p className="tabular mt-auto pt-4 text-small text-fg-muted">
                {member.experience}
              </p>
            </li>
          ))}
        </ul>

        {/* tone="quote" по умолчанию — акцентная линия слева вместо
            карточки: карточка под рядом портретов без карточек читалась
            бы как обломок другой раскладки. Явный banner.tone в конфиге
            по-прежнему главнее, это его ручка. */}
        {banner ? (
          <TeamBannerBlock
            banner={banner}
            tone={banner.tone ?? "quote"}
            className="mt-14 md:mt-20"
          />
        ) : null}
      </Container>
    </Section>
  );
}

export default Atelier;
