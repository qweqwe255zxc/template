import { Section } from "@/components/ui/Section";
import { StickySplit as SplitLayout } from "@/components/ui/StickySplit";
import { revealDelay } from "@/lib/reveal";
import { StatCard } from "../parts/StatCard";
import type { StatsSection } from "@/types/site";

/**
 * Цифры сеткой справа от залипающего заголовка — член семейства
 * `sticky-split` (общая ось 4/8, см. `ui/StickySplit`).
 *
 * Две колонки, а не четыре: правая колонка тут 8/12, и четыре крупных
 * числа в ней встали бы по ~150px — `text-stat` в такой ячейке ломает
 * даже короткое «14 900 ₽». Две колонки дают числу место, а секции —
 * спокойный ритм 2×2, который читается заодно с залипающим заголовком.
 *
 * Разлиновка вместо карточек: у этой секции нет своей оправы, потому что
 * в раскладке уже есть сильная вертикаль — граница между колонками
 * заголовка и содержимого. Карточки добавили бы вторую сетку поверх
 * первой.
 */
export function StickySplit(props: StatsSection) {
  const { id, surface = "paper", number, eyebrow, title, lead, items } = props;

  return (
    <Section id={id} surface={surface}>
      <SplitLayout number={number} eyebrow={eyebrow} title={title} lead={lead}>
        <dl className="grid border-t border-rule sm:grid-cols-2">
          {items.map((item, index) => (
            <div
              key={item.label}
              // Линейка слева только у правой колонки: горизонтальные
              // границы даёт border-b у каждой ячейки, вертикальную —
              // nth-child, потому что «вторая в ряду» зависит от
              // брейкпоинта, а не от индекса в массиве.
              className="border-b border-rule py-8 sm:[&:nth-child(2n)]:border-l sm:[&:nth-child(2n)]:pl-8 sm:[&:nth-child(2n+1)]:pr-8"
              data-reveal
              style={revealDelay(index)}
            >
              <StatCard item={item} />
            </div>
          ))}
        </dl>
      </SplitLayout>
    </Section>
  );
}

export default StickySplit;
