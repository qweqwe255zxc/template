import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { revealDelay } from "@/lib/reveal";
import { bentoSpan } from "@/lib/bentoSpan";
import { getInitials } from "../parts/initials";
import { MemberSocial } from "../parts/MemberSocial";
import { TeamBannerBlock } from "../parts/TeamBannerBlock";
import { TeamHeader } from "../parts/TeamHeader";
import type { TeamSection } from "@/types/site";

/**
 * Круглый аватар по центру карточки, роль — плашкой (Badge soft), имя,
 * описание, `social`. Опциональный баннер снизу (tone="solid" —
 * акцентная заливка).
 */
export function BadgeAvatars(props: TeamSection) {
  const { id, surface = "paper", number, eyebrow, title, lead, banner, items, headerAlign } = props;

  return (
    <Section id={id} surface={surface}>
      <Container>
        <TeamHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          align={headerAlign}
          className="mb-12 md:mb-16"
        />

        <ul className="grid gap-gutter sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((member, index) => (
            <li
              key={member.name}
              data-reveal
              style={revealDelay(index % 3)}
              className={bentoSpan(index, items.length, { sm: 2, lg: 3, xl: 4 })}
            >
              <Card variant="framed" className="flex h-full flex-col items-center text-center">
                <div className="ui-media relative size-28 shrink-0 overflow-hidden rounded-full bg-rule">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={`${member.name} — ${member.role}`}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="flex h-full w-full items-center justify-center font-display text-h3 text-fg-muted"
                    >
                      {getInitials(member.name)}
                    </div>
                  )}
                </div>

                <h3 className="mt-5 font-display text-h4">{member.name}</h3>
                <Badge variant="soft" className="mt-2">
                  {member.role}
                </Badge>
                <p className="mt-4 text-small text-fg-muted">{member.focus}</p>

                {/* Рамка — на блоке стажа, а не на всей карточке (Card
                    variant="framed" уже даёт карточке свою). */}
                <p className="tabular mt-auto w-full border-t border-rule pt-5 text-small text-fg-muted">
                  {member.experience}
                </p>

                <MemberSocial items={member.social} className="mt-3" />
              </Card>
            </li>
          ))}
        </ul>

        {banner ? (
          <TeamBannerBlock banner={banner} tone={banner.tone ?? "solid"} className="mt-12 md:mt-16" />
        ) : null}
      </Container>
    </Section>
  );
}

export default BadgeAvatars;
