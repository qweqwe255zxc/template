import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ActionGroup } from "@/components/ui/ActionGroup";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { getIcon } from "@/lib/icons";
import { revealDelay } from "@/lib/reveal";
import type { FeatureItem, FeaturesSection } from "@/types/site";

/**
 * Плотная сетка без карточек: иконка, короткий заголовок, две-три
 * строки описания. Ниша: 6–9 коротких пунктов, которые нужно показать
 * разом, — «что входит», «стек», «зоны работы». Карточная сетка на таком
 * количестве коротких пунктов даёт девять почти пустых прямоугольников,
 * а `table` рассчитана на 3–4 развёрнутых блока.
 *
 * Разделители — только вертикальные линейки между колонками, и только
 * там, где колонка не первая в ряду. Рисуются через border-l у ячейки с
 * отступом: горизонтальные линейки в плотной сетке дали бы клетчатую
 * бумагу, а не сетку.
 *
 * columns из конфига здесь не читается: смысл варианта в плотности, и
 * число колонок фиксировано ступенями 1 → 2 → 3.
 */
function FeatureCell({ item, index }: { item: FeatureItem; index: number }) {
  const Icon = getIcon(item.icon);

  const body = (
    <>
      <div className="flex items-center gap-3">
        {Icon ? (
          <Icon
            aria-hidden="true"
            strokeWidth={1.5}
            className="size-5 shrink-0 text-fg-muted"
          />
        ) : null}
        <h3 className="font-heading text-h4">{item.title}</h3>
        {item.link ? (
          <ArrowRight
            aria-hidden="true"
            strokeWidth={1.5}
            className="ml-auto size-4 shrink-0 text-fg-muted transition-transform group-hover:translate-x-1"
          />
        ) : null}
      </div>
      <p className="mt-2.5 text-small text-fg-muted">{item.text}</p>
    </>
  );

  return (
    <li data-reveal style={revealDelay(index)}>
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

export function Compact(props: FeaturesSection) {
  const { id, surface = "surface", number, eyebrow, title, lead, items, action, iconShape } =
    props;

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <Container>
        <SectionHeader number={number} eyebrow={eyebrow} title={title} lead={lead} />

        {/* Разлиновка сеткой задаётся ЗДЕСЬ, через nth-child, а не в
            самой ячейке по её индексу: «первая в ряду» — это позиция в
            сетке, а она разная на каждом брейкпоинте (2 колонки на sm,
            3 на lg). Считать её в JS пришлось бы отдельно под каждый
            брейкпоинт, и одна и та же ячейка получала бы конфликтующие
            классы. Селектор же переоценивается браузером сам. */}
        <ul
          className={cn(
            "mt-12 grid border-t border-rule sm:grid-cols-2 lg:grid-cols-3",
            "[&>li]:border-b [&>li]:border-rule [&>li]:py-6",
            "sm:[&>li]:border-l sm:[&>li]:px-6",
            "sm:[&>li:nth-child(2n+1)]:border-l-0 sm:[&>li:nth-child(2n+1)]:pl-0",
            "lg:[&>li:nth-child(2n+1)]:border-l lg:[&>li:nth-child(2n+1)]:pl-6",
            "lg:[&>li:nth-child(3n+1)]:border-l-0 lg:[&>li:nth-child(3n+1)]:pl-0",
          )}
        >
          {items.map((item, index) => (
            <FeatureCell key={item.title} item={item} index={index} />
          ))}
        </ul>

        {action ? <ActionGroup actions={[action]} align="start" className="mt-12" /> : null}
      </Container>
    </Section>
  );
}

export default Compact;
