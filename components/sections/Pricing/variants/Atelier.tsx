import { Button } from "@/components/ui/Button";
import { AtelierHeader } from "@/components/ui/AtelierHeader";
import { Container } from "@/components/ui/Container";
import { SeamGrid, SEAM_CELL, seamTailSpan } from "@/components/ui/SeamGrid";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import { PricingClosing } from "../parts/PricingClosing";
import { PricingComparisonTable } from "../parts/PricingComparisonTable";
import { PricingFootnotes } from "../parts/PricingFootnotes";
import { PricingQuoteBlock } from "../parts/PricingQuoteBlock";
import type { PricingSection } from "@/types/site";

/** Литеральные классы — сканер Tailwind не видит склеенных строк. */
const MD_COLS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

/**
 * Тарифы семейства `atelier`: колонки разграфлённого бланка, выделенный
 * тариф — сплошная акцентная заливка клетки.
 *
 * Иерархия внутри клетки ПЕРЕВЁРНУТА относительно всех остальных
 * вариантов Pricing, и это главное, что отличает раскладку: название
 * тарифа набрано мелкой капителью с разрядкой 0.2em, а первую строку
 * занимает ЦЕНА крупной ступенью. В `cards`/`editorial`/`product`
 * наоборот — название h3, цена под ним. Так подают прайс в клинике или
 * ателье: человек сравнивает суммы, а не имена программ, и имя тут
 * работает подписью к сумме.
 *
 * Поэтому `parts/PlanContent.tsx` тут не используется: он рисует
 * название заголовком третьего уровня, и весь смысл раскладки в том,
 * что это не так. Параметризовать общий кусок флагом «кто из двоих
 * заголовок» значило бы завести два разных компонента в одном файле.
 *
 * Выделенный тариф. `featured` даёт клетке `data-surface="accent"` — то
 * есть собственный контекст поверхности, внутри которого текст, линейки
 * и кнопка перекрашиваются сами, без единого цвета руками. В отличие от
 * `editorial`, где выделение — акцентная РАМКА: здесь рамки нет вовсе
 * (её роль играет шов решётки), и выделить колонку можно только
 * заливкой. Именно так это и сделано в исходном приёме.
 *
 * Чек-лист без галок и без тире — просто строки, разделённые воздухом:
 * маркер перед каждой строкой в клетке бланка спорит со швом за роль
 * разграфки. `checkIcon` в этом смысле не «не поддерживается», а не
 * применим.
 *
 * `photo` вариант не читает: роутер (../index.tsx) форсирует `cards`,
 * если у любого плана задано фото, — как и всем вариантам, кроме
 * `product`. Бокс с фотографией внутри клетки съезжает по высоте от
 * соседей, а выровнять его нечем: рамки у клетки нет.
 */
export function Atelier(props: PricingSection) {
  const {
    id,
    surface = "surface",
    number,
    eyebrow,
    title,
    lead,
    items,
    note,
    footnotes = [],
    quote,
    comparison,
    closing,
  } = props;

  const mdCols = Math.min(items.length, 3);

  return (
    <Section id={id} surface={surface}>
      <Container>
        <AtelierHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          className="mb-14 md:mb-20"
        />

        <SeamGrid className={MD_COLS[mdCols]}>
          {items.map((plan, index) => (
            <div
              key={plan.name}
              data-reveal
              style={revealDelay(index)}
              data-surface={plan.featured ? "accent" : undefined}
              className={cn(
                // Выделенная клетка получает bg-bg своего акцентного
                // контекста, обычная — bg-bg поверхности секции. Класс
                // один и тот же, значение переменной разное — поэтому
                // SEAM_CELL годится обоим.
                SEAM_CELL,
                "flex flex-col",
                plan.featured && "text-fg",
                seamTailSpan(index, items.length, mdCols, "md:"),
              )}
            >
              <p className="text-caption font-medium uppercase tracking-[0.2em] text-fg-muted">
                {[plan.tag, plan.name, plan.badge].filter(Boolean).join(" · ")}
              </p>

              {/* whitespace-nowrap на самой цене — та же причина, что в
                  PlanContent: «от 89 000 ₽» это одна лексема, и браузер
                  рвал её по последнему влезающему пробелу, оставляя «₽»
                  на второй строке. Переносится единица измерения, и это
                  правильное место разрыва. */}
              <p className="tabular mt-5 font-display text-h2">
                <span className="whitespace-nowrap">{plan.price}</span>
              </p>

              {plan.unit ? (
                <p className="mt-2 text-small text-fg-muted">{plan.unit}</p>
              ) : null}

              {plan.text ? (
                <p className="mt-4 text-body text-fg-muted">{plan.text}</p>
              ) : null}

              {plan.features.length > 0 ? (
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => {
                    const isObject = typeof feature !== "string";
                    const label = isObject ? feature.text : feature;
                    const excluded = isObject && feature.excluded;

                    return (
                      <li
                        key={label}
                        // Без альфы поверх приглушённого — см. развёрнутое
                        // объяснение в parts/PlanContent.tsx: пара
                        // «muted + /60» не проходит по контрасту ни в одной
                        // теме, а «исключено» уже сказано зачёркиванием.
                        className={cn(
                          "text-small text-fg-muted",
                          excluded && "line-through",
                        )}
                      >
                        {label}
                      </li>
                    );
                  })}
                </ul>
              ) : null}

              {plan.action ? (
                // mt-auto: списки у тарифов всегда разной длины, а кнопки
                // обязаны стоять на одной линии — иначе ряд читается
                // неровным (§1.5, п. 4). pt-9 держит отступ в самой
                // длинной колонке, где mt-auto по факту равен нулю.
                <div className="mt-auto pt-9">
                  <Button
                    href={plan.action.href}
                    variant={plan.action.variant ?? "secondary"}
                    full
                    wrap
                  >
                    {plan.action.label}
                  </Button>
                </div>
              ) : null}
            </div>
          ))}
        </SeamGrid>

        {note ? (
          <p className="mt-10 max-w-[62ch] text-small text-fg-muted">{note}</p>
        ) : null}

        {footnotes.length > 0 ? (
          <PricingFootnotes items={footnotes} className="mt-12 md:mt-16" />
        ) : null}

        {quote ? (
          <PricingQuoteBlock quote={quote} className="mt-14 md:mt-20" />
        ) : null}

        {comparison ? (
          <PricingComparisonTable
            comparison={comparison}
            className="mt-14 md:mt-20"
          />
        ) : null}

        {closing ? (
          <PricingClosing closing={closing} className="mt-14 md:mt-20" />
        ) : null}
      </Container>
    </Section>
  );
}

export default Atelier;
