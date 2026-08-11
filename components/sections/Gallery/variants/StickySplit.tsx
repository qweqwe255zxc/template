import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { StickySplit as SplitLayout } from "@/components/ui/StickySplit";
import { revealDelay } from "@/lib/reveal";
import type { CaseItem, GallerySection } from "@/types/site";

/**
 * Реестр кейсов строками справа от залипающего заголовка — член
 * семейства `sticky-split` (общая ось 4/8, см. `ui/StickySplit`).
 *
 * От варианта `table` отличается не только шапкой: там реестр в 12
 * колонок во всю ширину, здесь строка живёт в колонке 8/12, поэтому
 * колонки года и категории не разносятся по краям, а собраны в одну
 * строку-кикер над задачей. Разносить их в узкой колонке значило бы
 * оставить посередине пустоту.
 *
 * Фото кейса не показывается: для фото есть photo-grid и photo-bento.
 */
function CaseRow({ item, index }: { item: CaseItem; index: number }) {
  const body = (
    <>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="tabular text-caption font-medium uppercase text-fg-muted">
          {item.year}
        </span>
        <span className="text-caption font-medium uppercase text-fg-muted">
          {item.category}
        </span>
        {item.status ? (
          <Badge variant="soft" className="uppercase">
            {item.status}
          </Badge>
        ) : null}
      </div>

      <div className="mt-3 flex items-start justify-between gap-4">
        <h3 className="font-heading text-h4">{item.title ?? item.problem}</h3>
        {item.link ? (
          <ArrowRight
            aria-hidden="true"
            strokeWidth={1.5}
            className="mt-0.5 size-5 shrink-0 text-fg-muted transition-transform group-hover:translate-x-1"
          />
        ) : null}
      </div>

      {item.title ? (
        <p className="mt-2 max-w-[62ch] text-body text-fg-muted">{item.problem}</p>
      ) : null}

      <p className="mt-2 max-w-[62ch] text-body">{item.result}</p>

      {item.tags && item.tags.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <li key={tag}>
              <Badge variant="outline">{tag}</Badge>
            </li>
          ))}
        </ul>
      ) : null}
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

export function StickySplit(props: GallerySection) {
  const { id, surface = "ink", number, eyebrow, title, lead, items, note } = props;

  return (
    <Section id={id} surface={surface}>
      <SplitLayout number={number} eyebrow={eyebrow} title={title} lead={lead}>
        <ul>
          {items.map((item, index) => (
            <CaseRow key={`${item.year}-${item.category}`} item={item} index={index} />
          ))}
        </ul>

        {note ? <p className="mt-8 max-w-[62ch] text-small text-fg-muted">{note}</p> : null}
      </SplitLayout>
    </Section>
  );
}

export default StickySplit;
