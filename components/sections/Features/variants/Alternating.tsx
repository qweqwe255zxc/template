import Image from "next/image";
import { Check } from "lucide-react";
import { ActionGroup } from "@/components/ui/ActionGroup";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { getIcon } from "@/lib/icons";
import { revealDelay } from "@/lib/reveal";
import type { FeatureItem, FeaturesSection } from "@/types/site";

/**
 * Чередующиеся ряды: фото слева — текст справа, следующий ряд наоборот.
 * Ниша: 3–5 крупных возможностей, каждой из которых есть что показать.
 * Сетка карточек такой контент уравнивает в мелкие плитки, а тут у
 * каждого пункта свой экран.
 *
 * Ряд без photo не ломается: колонка текста просто занимает всю ширину
 * ряда, а не оставляет дыру на месте картинки. Это одна из немногих
 * раскладок Features, которая photo ЧИТАЕТ, а не игнорирует.
 *
 * Порядок колонок переставляется только на md+: на мобильном фото
 * всегда идёт над текстом, независимо от чётности ряда — чередование
 * там читалось бы как случайные скачки, а не как ритм.
 */
function FeatureRow({ item, index }: { item: FeatureItem; index: number }) {
  const Icon = getIcon(item.icon);
  const flipped = index % 2 === 1;
  const withPhoto = Boolean(item.photo);

  return (
    <li className="grid items-center gap-x-gutter gap-y-8 md:grid-cols-12">
      {withPhoto ? (
        <div
          className={cn(
            "ui-media relative aspect-[4/3] w-full overflow-hidden md:col-span-6",
            flipped ? "md:order-2 md:col-start-7" : "md:order-1",
          )}
          data-reveal
          style={revealDelay(index)}
        >
          <Image
            src={item.photo as string}
            alt={item.title}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      {/* Ряд без photo не растягивает текст на все 12 колонок: строка в
          1300px нечитаема, а с max-w текст занимал бы половину ряда,
          оставляя вторую пустой — ряд выглядел бы сломанным. Вместо
          этого заголовок уходит в левую колонку, описание в правую: это
          обычный редакторский ряд, и он выглядит намеренным. */}
      <div
        className={cn(
          withPhoto
            ? cn("md:col-span-6", flipped ? "md:order-1 md:col-start-1" : "md:order-2")
            : "md:col-span-4",
        )}
        data-reveal
        style={revealDelay(index)}
      >
        {item.number ? (
          <p className="tabular text-caption font-medium uppercase text-fg-muted">
            {item.number}
          </p>
        ) : null}

        <div className={cn("flex items-center gap-4", item.number && "mt-4")}>
          {Icon ? (
            <span className="icon-tile shrink-0">
              <Icon aria-hidden="true" strokeWidth={1.5} className="size-5" />
            </span>
          ) : null}
          <h3 className="font-heading text-h3">{item.title}</h3>
        </div>

        {withPhoto ? <FeatureText item={item} /> : null}
      </div>

      {withPhoto ? null : (
        <div className="md:col-span-7 md:col-start-6" data-reveal style={revealDelay(index)}>
          <FeatureText item={item} withTopSpace={false} />
        </div>
      )}
    </li>
  );
}

/** Описание, пункты и ссылка — общий кусок для обеих раскладок ряда. */
function FeatureText({
  item,
  withTopSpace = true,
}: {
  item: FeatureItem;
  withTopSpace?: boolean;
}) {
  return (
    <>
      <p className={cn("max-w-[62ch] text-body text-fg-muted", withTopSpace && "mt-4")}>
        {item.text}
      </p>

      {item.points && item.points.length > 0 ? (
        <ul className="mt-6 space-y-2.5">
          {item.points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-small text-fg-muted">
              <Check
                aria-hidden="true"
                strokeWidth={1.5}
                className="mt-0.5 size-4 shrink-0 text-accent"
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {item.link ? (
        <ActionGroup
          actions={[{ ...item.link, variant: item.link.variant ?? "quiet" }]}
          align="start"
          className="mt-6"
        />
      ) : null}
    </>
  );
}

export function Alternating(props: FeaturesSection) {
  const { id, surface = "surface", number, eyebrow, title, lead, items, action, iconShape } =
    props;

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <Container>
        <SectionHeader number={number} eyebrow={eyebrow} title={title} lead={lead} />

        {/* gap-y между рядами заметно больше внутреннего ритма ряда:
            иначе соседние ряды слипаются и чередование перестаёт
            читаться как отдельные блоки. */}
        <ul className="mt-14 flex flex-col gap-y-16 md:mt-20 md:gap-y-24">
          {items.map((item, index) => (
            <FeatureRow key={item.title} item={item} index={index} />
          ))}
        </ul>

        {action ? <ActionGroup actions={[action]} align="start" className="mt-14 md:mt-20" /> : null}
      </Container>
    </Section>
  );
}

export default Alternating;
