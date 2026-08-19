import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/ui/MarketHeader";
import { Section } from "@/components/ui/Section";
import { SectionTicker } from "@/components/ui/Ticker";
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
 * Тарифы семейства `market`: плоские карточки, выделенный тариф —
 * сплошная акцентная заливка.
 *
 * Иерархия внутри карточки перевёрнута так же, как в `atelier`:
 * название тарифа набрано мелкой полужирной строкой, а крупной первой
 * строкой идёт ЦЕНА. Так подают прайс в общепите: человек сравнивает
 * суммы, а имя тарифа работает подписью к сумме. Поэтому
 * `parts/PlanContent.tsx` тут не используется — он рисует название
 * заголовком третьего уровня, и весь смысл раскладки в том, что это не
 * так.
 *
 * Чем отличается от `atelier`, с которым делит перевёрнутую иерархию:
 *
 *   • карточка — отдельный ЛИСТ со скруглением и зазором между
 *     соседями, а не клетка замкнутой решётки на волосяных швах;
 *   • название набрано обычной полужирной строкой, а не капителью с
 *     разрядкой 0.2em;
 *   • цена стоит ПЕРВОЙ строкой карточки, название — над ней мелко;
 *     у `atelier` первой строкой идёт название.
 *
 * Выделенный тариф. `featured` даёт карточке `data-surface="accent"`, то
 * есть собственный контекст поверхности: текст, приглушённый текст и
 * кнопка перекрашиваются сами, без единого цвета руками. Рамкой (как в
 * `product`) выделить нельзя — карточки этого семейства рамок не имеют
 * вовсе.
 *
 * Чек-лист без маркеров — просто строки, разделённые воздухом. Это
 * единственный вариант Pricing без галок и без тире: в исходном приёме
 * состав набора перечислен голыми строками, и маркер перед каждой
 * добавил бы блоку графики ровно там, где раскладка её снимает.
 *
 * `photo` вариант не читает: роутер форсирует `cards`, если у любого
 * плана задано фото, — как и всем вариантам, кроме `product`.
 */
export function Market(props: PricingSection) {
  const {
    id,
    surface = "paper",
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
    ticker,
  } = props;

  const mdCols = Math.min(items.length, 3);

  return (
    <Section id={id} surface={surface}>
      <Container>
        <MarketHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          className="mb-14 md:mb-20"
        />

        <div className={cn("grid gap-gutter", MD_COLS[mdCols])}>
          {items.map((plan, index) => (
            <div
              key={plan.name}
              data-reveal
              style={revealDelay(index)}
              data-surface={plan.featured ? "accent" : undefined}
              className={cn(
                // Выделенная карточка берёт bg-bg своего акцентного
                // контекста, обычная — bg-card поверхности секции.
                "flex h-full flex-col rounded-lg p-7 md:p-8",
                // Рамка только у обычных карточек: без неё плоская
                // карточка исчезает на секции surface="surface" (её
                // --surface-card равен фону секции) — §1.5 требует
                // отличимости от фона. У выделенного тарифа эту роль
                // играет сплошная заливка, и рамка внутри неё была бы
                // вторым контуром на ровном месте.
                plan.featured ? "bg-bg text-fg" : "border border-rule bg-card",
              )}
            >
              <p className="text-small font-semibold text-fg-muted">
                {[plan.tag, plan.name, plan.badge].filter(Boolean).join(" · ")}
              </p>

              {/* whitespace-nowrap на самой цене — та же причина, что в
                  PlanContent: «от 89 000 ₽» это одна лексема, и браузер
                  рвал её по последнему влезающему пробелу, оставляя «₽»
                  на второй строке. Переносится единица измерения, и это
                  правильное место разрыва. */}
              <p className="tabular mt-4 font-display text-h2">
                <span className="whitespace-nowrap">{plan.price}</span>
              </p>

              {plan.unit ? (
                <p className="mt-2 text-caption text-fg-muted">{plan.unit}</p>
              ) : null}

              {plan.text ? (
                <p className="mt-4 text-small text-fg-muted">{plan.text}</p>
              ) : null}

              {plan.features.length > 0 ? (
                <ul className="mt-7 space-y-3">
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
                // неровным (§1.5, п. 4). pt-8 держит отступ в самой
                // длинной колонке, где mt-auto по факту равен нулю.
                <div className="mt-auto pt-8">
                  <Button
                    href={plan.action.href}
                    variant={
                      plan.action.variant ??
                      (plan.featured ? "primary" : "secondary")
                    }
                    full
                    wrap
                  >
                    {plan.action.label}
                  </Button>
                </div>
              ) : null}
            </div>
          ))}
        </div>

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

      {ticker ? <SectionTicker text={ticker} /> : null}
    </Section>
  );
}

export default Market;
