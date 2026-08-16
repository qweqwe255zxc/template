import Image from "next/image";
import { ActionGroup } from "@/components/ui/ActionGroup";
import { Container } from "@/components/ui/Container";
import { EditorialHeader } from "@/components/ui/EditorialHeader";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import type { AboutSection } from "@/types/site";

/**
 * «О компании» семейства `editorial`: крупная реплика вместо заголовка,
 * под ней колонки-врезки на волосяных линейках, справа портрет 3:4.
 *
 * Раскладка отличается от остальных пяти вариантов About тем, ЧЕМ она
 * открывается. Везде сверху стоит заголовок раздела, а тут — первый
 * абзац `text`, набранный ступенью `text-quote`: в печатном приёме
 * раздел о студии начинается не с названия, а с фразы, которая эту
 * студию описывает. Название раздела при этом никуда не девается, оно
 * уходит в колонтитул на линейке (`number` + `eyebrow`), как и во всех
 * секциях семейства.
 *
 * Отсюда же следует, что `title` этот вариант НЕ рендерит отдельной
 * строкой: два заголовка подряд — крупная реплика и h2 над ней — дают
 * ровно ту кашу, ради отсутствия которой реплика и вынесена наверх.
 * Если `title` задан, он встаёт в колонтитул рядом с `eyebrow`, то есть
 * текст всё равно виден и ничего не теряется (§1.5, п. 2).
 *
 * Ось 7/5, а не 5/7 как у `photo`: слева тут не подпись к фотографии, а
 * основной текст раздела с двумя врезками внутри — ему нужна широкая
 * колонка, фотографии хватает узкой.
 *
 * Чего вариант не читает: `aside`, `panel`, `photoCaption`, `highlights[].icon`,
 * `badge`/`badgeIcon`, `decorative`, `frame` — всё это плашки и оправы
 * поверх фото, то есть ровно тот декор, вместо которого в этом
 * семействе стоит линейка. `photoPosition` читается: сторона фотографии
 * приёму не противоречит.
 */
export function Editorial(props: AboutSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    text,
    photo,
    photoAlt,
    photoPosition = "right",
    actions = [],
    highlights = [],
  } = props;

  const [opening, ...rest] = text;
  const photoLeft = photoPosition === "left";

  /**
   * Какой блок текстовой колонки прижимается к низу ряда.
   *
   * Зачем это вообще нужно. Высоту ряда задаёт фотография: в колонке
   * 5/12 формат 3:4 даёт ~730px, а текст раздела бывает и в четыре
   * строки. На демо-данных (один абзац плюс две кнопки) под кнопками
   * оставалось 477px пустоты — не «воздух», а дыра: низ левой колонки
   * висел на середине фотографии.
   *
   * Прижимать низ к низу, а не растягивать фотографию под текст: кадр
   * 3:4 — часть приёма (в узкой колонке горизонтальный вырождается в
   * ленту), и жертвовать надо расположением, а не форматом. Пустота при
   * этом никуда не девается, но переезжает ВНУТРЬ колонки, между
   * текстом и кнопками, где читается разрядкой, а не обрывом.
   *
   * Если в колонке нет ни кнопок, ни врезок, прижимать нечего — тогда
   * раздел это просто абзац рядом с фотографией, и для него в секции
   * есть `variant: "photo"`.
   */
  const bottomBlock =
    actions.length > 0 ? "actions" : highlights.length > 0 ? "highlights" : null;

  return (
    <Section id={id} surface={surface}>
      <Container>
        <EditorialHeader
          number={number}
          // title уходит в колонтитул, а не рисуется заголовком — см.
          // объяснение в шапке файла. Если заданы оба, они встают через
          // тире одной строкой: колонтитул это подпись, а не заголовок,
          // и вторая строка в нём разъехалась бы с линейкой.
          eyebrow={[eyebrow, title].filter(Boolean).join(" — ") || undefined}
        />

        {/* items-stretch (дефолт grid), а не items-start: колонки должны
            быть одной высоты, иначе lg:mt-auto внутри текстовой колонке
            не на что опереться. */}
        <div className="mt-14 grid gap-x-gutter gap-y-12 md:mt-20 lg:grid-cols-12">
          <div
            className={cn(
              "flex flex-col lg:col-span-7",
              photoLeft && "lg:order-2",
            )}
          >
            {opening ? (
              <p className="max-w-[34ch] font-display text-quote" data-reveal>
                {opening}
              </p>
            ) : null}

            {rest.length > 0 ? (
              <div
                className={cn("space-y-5", opening && "mt-8 md:mt-10")}
                data-reveal
                style={revealDelay(1)}
              >
                {rest.map((paragraph, index) => (
                  <p key={index} className="max-w-[62ch] text-body text-fg-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}

            {highlights.length > 0 ? (
              // sm:grid-cols-2 и не больше: врезок в этом приёме две-три,
              // и на третьей колонке подпись-капитель («Подход»,
              // «Принципы») становится длиннее своей колонки.
              <div
                className={cn(
                  "mt-12 grid gap-x-gutter gap-y-10 sm:grid-cols-2 md:mt-14",
                  // lg:pt-14 обязателен рядом с lg:mt-auto: auto-отступ в
                  // самой высокой колонке равен нулю, и без пола врезки
                  // упирались бы прямо в абзац над ними.
                  bottomBlock === "highlights" && "lg:mt-auto lg:pt-14",
                )}
              >
                {highlights.map((highlight, index) => (
                  <div
                    key={highlight.title}
                    className="border-t border-rule pt-4"
                    data-reveal
                    style={revealDelay(index)}
                  >
                    <h3 className="text-caption font-medium uppercase text-fg-muted">
                      {highlight.title}
                    </h3>
                    <p className="mt-4 text-small text-fg-muted">
                      {highlight.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            {actions.length > 0 ? (
              <div
                className={cn(
                  "mt-12 md:mt-14",
                  bottomBlock === "actions" && "lg:mt-auto lg:pt-14",
                )}
                data-reveal
              >
                <ActionGroup actions={actions} />
              </div>
            ) : null}
          </div>

          {photo ? (
            <div
              className={cn("lg:col-span-5", photoLeft && "lg:order-1")}
              data-reveal
            >
              {/* Формат 3:4 — портретный, как в исходном приёме: в узкой
                  колонке горизонтальный кадр съёжился бы в ленту высотой
                  в треть соседнего текста, и ряд читался бы пустым. */}
              <div className="ui-media relative aspect-[3/4] w-full overflow-hidden bg-rule">
                <Image
                  src={photo}
                  alt={photoAlt ?? title ?? eyebrow ?? ""}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}

export default Editorial;
