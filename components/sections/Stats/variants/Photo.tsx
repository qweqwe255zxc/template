import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getIcon } from "@/lib/icons";
import { revealDelay } from "@/lib/reveal";
import type { StatsSection } from "@/types/site";

/**
 * Фото с заголовком/лидом поверх (тёмный градиент снизу) слева, сетка
 * карточек-метрик справа. Требует `image` — без фото половине секции
 * нечем закрыться, поэтому без него этот вариант не рендерится вовсе
 * (роутер в dev-режиме предупреждает, см. Stats/index.tsx).
 */
export function Photo(props: StatsSection) {
  const { id, surface = "paper", number, eyebrow, title, lead, image, items, iconShape } = props;

  if (!image) return null;

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <Container>
        <div className="grid gap-x-gutter gap-y-10 md:grid-cols-2 md:items-stretch">
          {/* До md колонки нет, и высоту бокса задаёт САМА подпись: она идёт
              обычным потоком, а ::before добавляет над ней полосу фото в
              четверть собственной ширины. Так длинный заголовок клиента
              раздвигает бокс, а не обрезается о его край — фиксированная
              высота (было min-h-[22rem]) резала бы. На md+ высоту даёт
              строка грида (items-stretch), и подпись возвращается в absolute. */}
          <div className="ui-media-raised relative flex flex-col justify-end overflow-hidden before:block before:pt-[25%] before:content-[''] md:block md:before:hidden">
            <Image
              src={image}
              alt={title ?? ""}
              fill
              sizes="(min-width: 768px) 42vw, 100vw"
              className="object-cover"
            />

            {number || eyebrow || title || lead ? (
              <div className="relative bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-8 pt-20 md:absolute md:inset-x-0 md:bottom-0">
                {number || eyebrow ? (
                  <p className="text-caption font-medium uppercase text-ink-fg/70">
                    {[number, eyebrow].filter(Boolean).join(" · ")}
                  </p>
                ) : null}
                {title ? (
                  <h2
                    className={`font-heading text-h2 text-ink-fg ${number || eyebrow ? "mt-2" : ""}`}
                  >
                    {title}
                  </h2>
                ) : null}
                {lead ? (
                  <p className="mt-3 max-w-[42ch] text-small text-ink-fg/80">{lead}</p>
                ) : null}
              </div>
            ) : null}
          </div>

          <dl className="grid grid-cols-2 gap-4">
            {items.map((item, index) => {
              const Icon = getIcon(item.icon);

              return (
                <Card
                  key={item.label}
                  variant="framed"
                  data-reveal
                  style={revealDelay(index)}
                >
                  {Icon ? (
                    <span className="icon-tile">
                      <Icon aria-hidden="true" strokeWidth={1.5} className="size-6" />
                    </span>
                  ) : null}

                  <dt className="tabular mt-4 font-display text-h2">
                    {item.value}
                    {item.suffix ? (
                      <span className="text-fg-muted">{item.suffix}</span>
                    ) : null}
                  </dt>

                  <dd className="mt-2 text-caption font-medium uppercase text-fg-muted">
                    {item.label}
                  </dd>
                </Card>
              );
            })}
          </dl>
        </div>
      </Container>
    </Section>
  );
}

export default Photo;
