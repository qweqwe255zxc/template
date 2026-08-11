import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getIcon } from "@/lib/icons";
import { revealDelay } from "@/lib/reveal";
import type { FeatureItem, FeaturesSection } from "@/types/site";

/**
 * Заголовок раздела залипает слева, список возможностей идёт справа
 * строками на линейках. Ниша: длинный перечень (6–10 пунктов), где
 * карточки превратились бы в стену одинаковых прямоугольников, а
 * `table` — в широкую малочитаемую сетку.
 *
 * Заголовок на lg+ становится sticky: при прокрутке длинного списка
 * видно, к чему этот список относится. `top` считается от высоты
 * фиксированного хедера, иначе заголовок уезжал бы под него.
 *
 * Фото у элементов эта раскладка не показывает — роутер секции
 * форсирует `cards`, если хотя бы у одного item задан photo (см.
 * Features/index.tsx, GRID_ONLY).
 */
function FeatureRow({ item, index }: { item: FeatureItem; index: number }) {
  const Icon = getIcon(item.icon);
  const body = (
    <>
      <div className="flex items-start gap-4">
        {Icon ? (
          <span className="icon-tile mt-0.5 shrink-0">
            <Icon aria-hidden="true" strokeWidth={1.5} className="size-5" />
          </span>
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-heading text-h4">{item.title}</h3>
            {item.link ? (
              <ArrowRight
                aria-hidden="true"
                strokeWidth={1.5}
                className="mt-0.5 size-5 shrink-0 text-fg-muted transition-transform group-hover:translate-x-1"
              />
            ) : null}
          </div>

          <p className="mt-2 max-w-[62ch] text-body text-fg-muted">{item.text}</p>

          {item.points && item.points.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
              {item.points.map((point) => (
                <li key={point} className="text-small text-fg-muted">
                  — {point}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </>
  );

  return (
    <li
      className="border-b border-rule py-7 first:border-t md:py-8"
      data-reveal
      style={revealDelay(index)}
    >
      {item.link ? (
        <Link
          href={item.link.href}
          className="group block transition-colors hover:text-accent"
        >
          {body}
        </Link>
      ) : (
        body
      )}
    </li>
  );
}

export function SplitList(props: FeaturesSection) {
  const { id, surface = "surface", number, eyebrow, title, lead, items, iconShape } = props;

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <Container>
        <div className="grid gap-x-gutter gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
              {number ? (
                <p className="tabular text-caption font-medium uppercase text-fg-muted" data-reveal>
                  {number}
                </p>
              ) : null}
              {eyebrow ? (
                <p className="mt-1 text-caption font-medium uppercase text-fg-muted" data-reveal>
                  {eyebrow}
                </p>
              ) : null}
              {title ? (
                <h2 className="mt-5 font-heading section-title-scale" data-reveal>
                  {title}
                </h2>
              ) : null}
              {lead ? (
                <p className="mt-5 max-w-[46ch] text-lead text-fg-muted" data-reveal>
                  {lead}
                </p>
              ) : null}
            </div>
          </div>

          <ul className="lg:col-span-8 lg:col-start-5">
            {items.map((item, index) => (
              <FeatureRow key={item.title} item={item} index={index} />
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

export default SplitList;
