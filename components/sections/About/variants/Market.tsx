import Image from "next/image";
import { ActionGroup } from "@/components/ui/ActionGroup";
import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/ui/MarketHeader";
import { Section } from "@/components/ui/Section";
import { SectionTicker } from "@/components/ui/Ticker";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import type { AboutSection } from "@/types/site";

/**
 * О компании, семейство `market`: фотография 4:5 в одной колонке, текст
 * в другой, под текстом ряд мини-цифр.
 *
 * Ось 1 / 1.1 — текстовая колонка чуть шире фотографии. Это не
 * произвол: у раздела два абзаца и ряд цифр под ними, и при равных
 * колонках текст кончается заметно выше кадра, оставляя под собой
 * пустоту в треть высоты. Колонки выровнены по ЦЕНТРУ, а не по верху,
 * — так короткий текст стоит против середины кадра, а не жмётся к его
 * верхнему краю.
 *
 * Шапка тут своя, по левому краю и БЕЗ шеврона: указатель под прижатым
 * к краю заголовком показывал бы в сторону от колонки, на которую
 * показывает (см. `MarketHeader`). Это же правило действует в исходном
 * приёме — левые заголовки там вызываются с выключенной стрелкой.
 *
 * Мини-цифры берутся из `panel.stats` — того же поля, из которого их
 * берёт `About/product`. Заводить под них ещё одно поле незачем: это
 * ровно те же «значение — подпись», и проект, переключившийся с одного
 * семейства на другое, не должен переписывать конфиг.
 *
 * `photo` НЕ обязателен, в отличие от `editorial`: без него раздел
 * честно сворачивается в одну колонку внутри контейнера, а не оставляет
 * половину экрана пустой.
 *
 * Не читает `aside`, `photoCaption`, `badge`, `decorative`, `frame`,
 * `highlights` и `photoPosition` — набор оправ, вместо которых здесь
 * работает воздух.
 */
export function Market(props: AboutSection) {
  const {
    id,
    surface = "surface",
    number,
    eyebrow,
    title,
    lead,
    text,
    photo,
    photoAlt,
    actions = [],
    panel,
    ticker,
  } = props;

  const stats = panel?.stats ?? [];

  const content = (
    <div className="flex flex-col">
      <MarketHeader
        number={number}
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        align="start"
      />

      {text.length > 0 ? (
        <div className={cn("flex flex-col gap-5", (title || lead) && "mt-7")}>
          {text.map((paragraph, index) => (
            <p
              key={paragraph.slice(0, 32)}
              // Первый абзац крупнее остальных: в исходном приёме
              // раздел открывается им как лидом, а следующие идут
              // обычным набором.
              className={cn(
                "text-fg-muted",
                index === 0 ? "text-lead" : "text-body",
              )}
              data-reveal
              style={revealDelay(index)}
            >
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      {stats.length > 0 ? (
        // Колонок столько, сколько цифр, но не больше трёх: четвёртая в
        // колонке 1.1fr рядом с фото даёт ~130px, и подпись начинает
        // рваться. Чётное число цифр раскладывается по две, нечётное —
        // по три: иначе четыре цифры дают ряд из трёх и одинокую
        // четвёртую под ним.
        <dl
          className={cn(
            "mt-10 grid grid-cols-2 gap-x-gutter gap-y-8",
            stats.length % 3 === 0 ? "sm:grid-cols-3" : "sm:grid-cols-2",
          )}
        >
          {stats.map((stat, index) => (
            <div key={stat.label} data-reveal style={revealDelay(index)}>
              <dt className="tabular font-display text-h2 text-accent [[data-surface=accent]_&]:text-fg [[data-surface=ink]_&]:text-fg">
                {stat.value}
              </dt>
              <dd className="mt-2 text-small text-fg-muted">{stat.label}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {actions.length > 0 ? (
        <div className="mt-10" data-reveal>
          <ActionGroup actions={actions} />
        </div>
      ) : null}
    </div>
  );

  return (
    <Section id={id} surface={surface}>
      <Container>
        {photo ? (
          <div className="grid gap-x-gutter gap-y-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div className="ui-media relative aspect-[4/5] w-full overflow-hidden" data-reveal>
              <Image
                src={photo}
                alt={photoAlt ?? title ?? ""}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            {content}
          </div>
        ) : (
          content
        )}
      </Container>

      {ticker ? <SectionTicker text={ticker} /> : null}
    </Section>
  );
}

export default Market;
