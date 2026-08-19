import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/ui/MarketHeader";
import { Section } from "@/components/ui/Section";
import { SectionTicker } from "@/components/ui/Ticker";
import { revealDelay } from "@/lib/reveal";
import type { CaseItem, GallerySection } from "@/types/site";

/**
 * Подпись, которая ложится ВНУТРЬ кадра. Это не название кейса, а его
 * итог одной величиной — «120 обедов каждый день», «180 гостей, две
 * станции»: главная особенность раскладки в том, что цифра результата
 * стоит прямо на фотографии, а название и рассказ идут под ней обычным
 * набором.
 *
 * Источник — первая пара из `stats`, и только она. Откатываться на
 * `category` нельзя, хотя соблазн есть: категория уже напечатана строкой
 * ПОД кадром, и в кадре она встаёт вторым экземпляром того же слова
 * («ЛЕНДИНГ» на фото и «Лендинг · 2025» под ним — поймано на стенде).
 * Кейс без метрики получает чистый кадр без подложки: это ровный,
 * законченный вид, а не пробел.
 */
function frameCaption(item: CaseItem): { headline: string; note?: string } | null {
  const stat = item.stats?.[0];
  return stat ? { headline: stat.value, note: stat.label } : null;
}

/**
 * Кейсы семейства `market`: кадры 4:3, крупная подпись капслоком внутри
 * кадра по нижнему краю, под кадром название и рассказ.
 *
 * Единственная галерея шаблона с текстом ВНУТРИ кадра — этим она и
 * отличается от четырёх остальных фото-раскладок:
 *
 *   • `photo-grid` кладёт поверх фото плашку категории, а весь текст —
 *     под кадром в карточке;
 *   • `photo-bento` выносит метрики в подвал крупной карточки;
 *   • `editorial` и `atelier` вовсе не трогают кадр, подпись лежит на
 *     поверхности секции.
 *
 * Текст на фотографии — приём, требующий подложки: цифра набрана по
 * градиенту от низа кадра (`from-ink`), тем же, которым в шаблоне уже
 * набраны заголовки поверх фото в `Stats/photo` и `Steps/split`. Пара
 * `--palette-ink` / `--palette-ink-fg` переопределяется целиком в
 * тёмной теме, поэтому контраст держится в обеих — в отличие от
 * `text-paper`, который сам инвертируется (это уже ловили).
 *
 * Кейс без `photo` получает текстовую ячейку: сетка не ломается, но ряд,
 * где кадр есть у одного из трёх, выглядит сбоем данных — это
 * ограничение данных, а не раскладки, и чинится в конфиге.
 *
 * `align: "center"` не читается: категория, заголовок и текст образуют
 * левую вертикаль под кадром, и по центру от неё остаются три
 * разъехавшиеся строки.
 */
export function Market(props: GallerySection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    action,
    items,
    note,
    ticker,
  } = props;

  return (
    <Section id={id} surface={surface}>
      <Container>
        <MarketHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          align="start"
          action={
            action ? (
              <Button href={action.href} variant={action.variant ?? "secondary"}>
                {action.label}
              </Button>
            ) : null
          }
        />

        <ul className="mt-14 grid gap-x-gutter gap-y-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {items.map((item, index) => {
            const caption = frameCaption(item);

            return (
              <li
                key={`${item.category}-${item.year}-${index}`}
                data-reveal
                style={revealDelay(index % 3)}
                className="flex flex-col"
              >
                {item.photo ? (
                  // shrink-0: ячейка — flex-колонка, и бокс с
                  // фиксированной пропорцией обязан быть неусадочным,
                  // иначе в высоком ряду кадры перестают быть одного
                  // формата.
                  <div className="ui-media relative aspect-[4/3] w-full shrink-0 overflow-hidden">
                    <Image
                      src={item.photo}
                      alt={item.title ?? item.category}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                      className="object-cover"
                    />

                    {/* pt-16 у подложки — не отступ текста, а высота
                        самого градиента: он обязан начинаться заметно
                        выше строки, иначе край перехода виден полосой. */}
                    {caption ? (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/45 to-transparent p-5 pt-16">
                        <p className="font-heading text-h3 uppercase text-ink-fg">
                          {caption.headline}
                        </p>
                        {caption.note ? (
                          <p className="mt-1 text-small text-ink-fg-muted">
                            {caption.note}
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <p
                  className={
                    item.photo
                      ? "mt-5 text-caption text-fg-muted"
                      : "text-caption text-fg-muted"
                  }
                >
                  {[item.category, item.year].filter(Boolean).join(" · ")}
                </p>

                <h3 className="mt-2 font-display text-lead font-semibold">
                  {item.title ?? item.problem}
                </h3>

                {item.title ? (
                  <p className="mt-2 text-small text-fg-muted">{item.problem}</p>
                ) : null}
                <p className="mt-2 text-small text-fg-muted">{item.result}</p>

                {item.status || item.tags?.length || item.link || item.date ? (
                  // mt-auto: рассказы у кейсов разной длины, а нижние
                  // строки обязаны стоять на одной линии по всему ряду.
                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
                    {item.status ? (
                      <Badge variant="soft">{item.status}</Badge>
                    ) : null}
                    {item.tags?.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                    {item.link ? (
                      <Link
                        href={item.link.href}
                        className="inline-flex items-center gap-1.5 text-small font-medium text-accent"
                      >
                        {item.link.label}
                        <ArrowRight aria-hidden="true" className="size-4" />
                      </Link>
                    ) : null}
                    {item.date ? (
                      <span className="ml-auto text-caption text-fg-muted">
                        {item.date}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>

        {note ? (
          <p className="mt-12 max-w-[62ch] text-small text-fg-muted md:mt-16">
            {note}
          </p>
        ) : null}
      </Container>

      {ticker ? <SectionTicker text={ticker} /> : null}
    </Section>
  );
}

export default Market;
