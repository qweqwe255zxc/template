import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { EditorialHeader } from "@/components/ui/EditorialHeader";
import { Section } from "@/components/ui/Section";
import { revealDelay } from "@/lib/reveal";
import { getInitials } from "../parts/initials";
import { TeamBannerBlock } from "../parts/TeamBannerBlock";
import type { TeamSection } from "@/types/site";

/**
 * Команда семейства `editorial`: портреты 3:4 без карточек, над каждым —
 * волосяная линейка с индексом, как в нумерованном перечне Features.
 *
 * Про линейку отдельно, потому что в `columns` её однажды уже снимали
 * (см. комментарий в parts/TeamList.tsx): пустая линейка над фотографией
 * висела в воздухе и читалась обрывком чужой таблицы — делить ей было
 * нечего, соседний столбец начинался на той же высоте. Здесь линейка не
 * пустая: на ней лежит индекс, и это тот же колонтитул, что стоит над
 * каждым разделом страницы. Возвращать её БЕЗ индекса нельзя — вернётся
 * ровно тот дефект.
 *
 * Своя разметка, а не parts/MemberContent: тому компоненту неоткуда
 * взять индекс, а линейка с индексом обязана стоять НАД фотографией, то
 * есть до всего, что он рисует.
 *
 * Чего вариант не читает: `social` (иконки-ссылки — плашки, вместо
 * которых в этом семействе линейка), `tags` (ряд пилюль под описанием —
 * то же самое) и `image` в шапке (это поле bento). `link` читается —
 * тихой ссылкой капителью внизу ячейки, как в Gallery/editorial.
 * `fillLastRow` не читается: ячейки держат линейки, а растянутая на две
 * колонки ячейка сбила бы шаг индексов.
 */
export function Editorial(props: TeamSection) {
  const {
    id,
    surface = "paper",
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
        <EditorialHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
        />

        <ul className="mt-14 grid gap-x-gutter gap-y-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((member, index) => (
            <li
              key={member.name}
              data-reveal
              style={revealDelay(index % 4)}
              className="flex h-full flex-col"
            >
              <p className="tabular border-t border-rule pt-3 text-caption font-medium uppercase text-fg-muted">
                {String(index + 1).padStart(2, "0")}
              </p>

              {/* Единый бокс 3:4 и с фото, и без него: пока портрета нет,
                  в нём стоит заглушка с инициалами — иначе в одном ряду
                  человек с фото и человек без фото дают ячейки разной
                  высоты, и линейки соседних столбцов расходятся. */}
              <div className="ui-media relative mt-6 aspect-[3/4] w-full shrink-0 overflow-hidden bg-rule">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={`${member.name} — ${member.role}`}
                    fill
                    sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover grayscale"
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

              <h3 className="mt-5 font-display text-h3">{member.name}</h3>
              <p className="mt-2 text-caption font-medium uppercase text-fg-muted">
                {member.role}
              </p>
              <p className="mt-4 text-small text-fg-muted">{member.focus}</p>

              {/* mt-auto прижимает стаж к низу ячейки: focus у людей
                  разной длины, и без этого нижние строки ряда стоят на
                  разных высотах (§1.5, п. 4). Работает, потому что <li>
                  выше объявлен flex-колонкой с h-full. */}
              <p className="tabular mt-auto pt-5 text-small text-fg-muted">
                {member.experience}
              </p>

              {member.link ? (
                <Link
                  href={member.link.href}
                  className="mt-3 text-caption font-medium uppercase text-fg-muted transition-colors hover:text-fg"
                >
                  {member.link.label}
                </Link>
              ) : null}
            </li>
          ))}
        </ul>

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

export default Editorial;
