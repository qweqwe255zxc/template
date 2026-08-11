import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { StickySplit as SplitLayout } from "@/components/ui/StickySplit";
import { Section } from "@/components/ui/Section";
import { getIcon } from "@/lib/icons";
import { revealDelay } from "@/lib/reveal";
import type { FeatureItem, FeaturesSection } from "@/types/site";

/**
 * Список возможностей строками на линейках справа от залипающего
 * заголовка. Ниша: длинный перечень (6–10 пунктов), где карточки
 * превратились бы в стену одинаковых прямоугольников, а `table` — в
 * широкую малочитаемую сетку.
 *
 * Саму ось 4/8 и залипание держит общий `ui/StickySplit` — тот же, что
 * у всех остальных секций с `variant="sticky-split"`. Здесь остаётся
 * только правая колонка.
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

export function StickySplit(props: FeaturesSection) {
  const { id, surface = "surface", number, eyebrow, title, lead, items, iconShape } = props;

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <SplitLayout number={number} eyebrow={eyebrow} title={title} lead={lead}>
        <ul>
          {items.map((item, index) => (
            <FeatureRow key={item.title} item={item} index={index} />
          ))}
        </ul>
      </SplitLayout>
    </Section>
  );
}

export default StickySplit;
