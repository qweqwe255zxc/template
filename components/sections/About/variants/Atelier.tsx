import Image from "next/image";
import { ActionGroup } from "@/components/ui/ActionGroup";
import { AtelierHeader } from "@/components/ui/AtelierHeader";
import { Container } from "@/components/ui/Container";
import { SeamGrid, SEAM_CELL_SM, seamTailSpan } from "@/components/ui/SeamGrid";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import type { AboutSection } from "@/types/site";

/**
 * О компании, семейство `atelier`: фотография 4:5 в одной половине,
 * текст в другой, под текстом — решётка на волосяных швах с короткими
 * фактами о месте (лицензия, стационар, наблюдение).
 *
 * Ось ровно 1/1, а не 5/7 и не 7/5, как у остальных вариантов About.
 * Это осознанно: портретная фотография 4:5 в узкой колонке становится
 * почти квадратной полоской, а в широкой — перевешивает текст. Половина
 * на половину — единственная пропорция, при которой оба столбца читаются
 * как равноправные, и именно она стоит в исходном приёме.
 *
 * Решётка `highlights` — та же, что в цифрах и этапах, только с меньшим
 * внутренним воздухом (`SEAM_CELL_SM`): это не самостоятельный раздел, а
 * приписка к тексту, и клетка в нём вдвое мельче. `highlight.icon` не
 * читается по той же причине, что в остальных секциях семейства —
 * плашка иконки конкурирует с клеткой за роль рамки.
 *
 * Из `panel` не читается ничего, как и `aside`, `photoCaption`, `badge`,
 * `decorative`, `frame`: всё это оправы, вместо которых здесь работают
 * решётка и воздух. `photoPosition` читается — сторона фотографии это
 * вопрос композиции конкретной страницы, а не приёма.
 *
 * Без `photo` раздел честно становится одноколоночным (тот же выбор, что
 * у `product`, и обратный `editorial`, который откатывается на
 * `type-only`): решётка фактов под текстом держит раздел сама, и терять
 * ради отсутствующего кадра всю раскладку семейства незачем.
 */
export function Atelier(props: AboutSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    text,
    photo,
    photoAlt,
    photoPosition = "left",
    actions = [],
    highlights = [],
  } = props;

  const hasHighlights = highlights.length > 0;

  const media = photo ? (
    <div
      className={cn(
        "relative aspect-[4/5] w-full overflow-hidden",
        // order-* только с lg, где колонки стоят бок о бок. Ниже фото
        // всегда идёт ПОД текстом: на телефоне портретный кадр в
        // 4:5 занимает почти экран, и раздел открывался бы картинкой
        // без единого слова над ней.
        photoPosition === "right" ? "lg:order-2" : "lg:order-1",
      )}
      data-reveal
    >
      <Image
        src={photo}
        alt={photoAlt ?? title ?? ""}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  ) : null;

  return (
    <Section id={id} surface={surface}>
      <Container>
        <div
          className={cn(
            "grid gap-x-gutter gap-y-12",
            photo && "lg:grid-cols-2 lg:items-center lg:gap-x-16",
          )}
        >
          {media}

          <div
            className={cn(
              "min-w-0",
              photo && (photoPosition === "right" ? "lg:order-1" : "lg:order-2"),
            )}
          >
            <AtelierHeader
              number={number}
              eyebrow={eyebrow}
              title={title}
              lead={lead}
              align="start"
            />

            {text.length > 0 ? (
              <div className="mt-8 space-y-5">
                {text.map((paragraph, index) => (
                  <p
                    key={index}
                    className="max-w-[58ch] text-body text-fg-muted"
                    data-reveal
                    style={revealDelay(index)}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}

            {hasHighlights ? (
              <SeamGrid className="mt-10 sm:grid-cols-2">
                {highlights.map((highlight, index) => (
                  <div
                    key={highlight.title}
                    className={cn(
                      SEAM_CELL_SM,
                      seamTailSpan(index, highlights.length, 2, "sm:"),
                    )}
                    data-reveal
                    style={revealDelay(index)}
                  >
                    <h3 className="font-display text-h4">{highlight.title}</h3>
                    <p className="mt-1.5 text-small text-fg-muted">
                      {highlight.text}
                    </p>
                  </div>
                ))}
              </SeamGrid>
            ) : null}

            {actions.length > 0 ? (
              <ActionGroup actions={actions} className="mt-10" />
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default Atelier;
