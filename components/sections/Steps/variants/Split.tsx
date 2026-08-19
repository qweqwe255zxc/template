import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import type { StepsSection } from "@/types/site";

/**
 * Фото с заголовком/лидом поверх слева (та же идея, что у
 * Stats/variants/Photo.tsx), сетка карточек справа. `item.featured`
 * красит карточку акцентной заливкой — обычно последний шаг («Результат»).
 * Требует `image`, без него вариант не рендерится (роутер предупреждает).
 */
export function Split(props: StepsSection) {
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

          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((item, index) => {
              const Icon = getIcon(item.icon);

              return (
                <li
                  key={item.number}
                  data-reveal
                  style={revealDelay(index)}
                  className={item.featured ? "rounded-card bg-bg text-fg" : undefined}
                  data-surface={item.featured ? "accent" : undefined}
                >
                  <Card variant="framed" className="relative h-full overflow-hidden">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "tabular pointer-events-none absolute -right-1 -top-3 font-display text-h1",
                        item.featured ? "text-fg/15" : "text-rule",
                      )}
                    >
                      {item.number}
                    </span>

                    {Icon ? (
                      <span className="icon-tile">
                        <Icon aria-hidden="true" strokeWidth={1.5} className="size-6" />
                      </span>
                    ) : null}

                    <h3 className="relative mt-4 max-w-[22ch] font-heading text-h4">{item.title}</h3>
                    <p className="relative mt-2 text-small text-fg-muted">{item.text}</p>
                  </Card>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}

export default Split;
