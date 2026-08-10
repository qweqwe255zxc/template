import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { revealDelay } from "@/lib/reveal";
import { bentoSpan, bentoMediaAspect } from "@/lib/bentoSpan";
import { cn } from "@/lib/cn";
import { getInitials } from "../parts/initials";
import { MemberSocial } from "../parts/MemberSocial";
import { TeamBannerBlock } from "../parts/TeamBannerBlock";
import { TeamHeader } from "../parts/TeamHeader";
import type { TeamSection } from "@/types/site";

/**
 * Заголовок пилюлей по центру, карточки с фото во всю ширину (без
 * отступа сверху — Card padded={false}, текст в своей обёртке),
 * роль акцентом, имя, описание, `social`. Опциональный баннер снизу
 * (tone="soft").
 */
export function PhotoCards(props: TeamSection) {
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
              <Card variant="framed" padded={false} className="flex h-full flex-col overflow-hidden">
                <div
                  className={cn(
                    "ui-media relative w-full shrink-0 overflow-hidden rounded-none bg-rule",
                    bentoMediaAspect(index, items.length, { sm: 2, lg: 3, xl: 4 }, "3/4"),
                  )}
                >
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={`${member.name} — ${member.role}`}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
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

                <div className="flex flex-1 flex-col p-7 md:p-9">
                  <p className="text-caption font-medium uppercase text-accent">
                    {member.role}
                  </p>
                  <h3 className="mt-2 font-display text-h4">{member.name}</h3>
                  <p className="mt-3 text-small text-fg-muted">{member.focus}</p>

                  <MemberSocial items={member.social} className="mt-auto pt-5" />
                </div>
              </Card>
            </li>
          ))}
        </ul>

        {banner ? (
          <TeamBannerBlock banner={banner} tone={banner.tone ?? "soft"} className="mt-12 md:mt-16" />
        ) : null}
      </Container>
    </Section>
  );
}

export default PhotoCards;
