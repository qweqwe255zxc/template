import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { revealDelay } from "@/lib/reveal";
import { cn } from "@/lib/cn";
import type { AboutSection } from "@/types/site";

interface AboutLayoutProps extends Omit<AboutSection, "photo"> {
  /** В этом варианте photo обязателен — в отличие от type-only, второй колонки без него не бывает. */
  photo: string;
  /** Фото идёт первой колонкой — единственное, чем отличаются варианты. */
  photoFirst: boolean;
}

/**
 * Единственная секция с содержательной асимметричной раскладкой 5/7 —
 * текст и фото должны читаться как сопоставимые по весу колонки, а не
 * «текст на всю ширину + фото в углу». На мобильном фото держит
 * собственный aspect-[4/3] (колонки ещё нет), на md+ высота колонки
 * задаётся гридом (align-items: stretch), поэтому фото переключается
 * на md:h-full — то же aspect-ratio-правило, что и у Features/Pricing/
 * Team, просто высота приходит от соседней колонки, а не от
 * фиксированного отношения сторон.
 *
 * Заголовок тут не через SectionHeader: он живёт в текстовой колонке,
 * а не на всю ширину (единственная секция с такой шапкой, наравне с Hero).
 */
export function AboutLayout({
  photoFirst,
  number,
  eyebrow,
  title,
  lead,
  text,
  photo,
  photoAlt,
}: AboutLayoutProps) {
  return (
    <Container>
      <div className="border-t border-rule pt-7 md:pt-9">
        <div className="grid gap-x-gutter gap-y-10 md:grid-cols-12 md:items-stretch">
          <div
            className={cn("md:col-span-5", photoFirst && "md:order-2")}
            data-reveal
            style={revealDelay(0)}
          >
            {(number || eyebrow) && (
              <div className="flex items-baseline gap-4">
                {number ? (
                  <span className="tabular text-caption font-medium uppercase text-fg-muted">
                    {number}
                  </span>
                ) : null}
                {eyebrow ? (
                  <span className="text-caption font-medium uppercase text-fg-muted">
                    {eyebrow}
                  </span>
                ) : null}
              </div>
            )}

            {title ? (
              <h2 className="mt-4 max-w-[22ch] font-heading text-h2">
                {title}
              </h2>
            ) : null}
            {lead ? (
              <p className="mt-5 max-w-[52ch] text-lead text-fg-muted">
                {lead}
              </p>
            ) : null}

            <div className="mt-7 space-y-5">
              {text.map((paragraph) => (
                <p
                  key={paragraph}
                  className="max-w-[52ch] text-body text-fg-muted"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div
            className={cn(
              "ui-media-raised relative aspect-[4/3] w-full overflow-hidden md:col-span-7 md:aspect-auto md:h-full",
              // Пол высоты на md+: текстовая колонка бывает короткой (пара
              // абзацев), и растянутое по строке фото схлопывалось в
              // полоску. Пол берётся от собственной ширины колонки через
              // padding-top у ::before — Image здесь absolute и высоту не
              // даёт. Числа в px тут были бы вторым источником правды и
              // ломались бы при смене контейнера (§1.5 п.3).
              // 45% — широкая полоса: при длинном тексте высоту всё равно
              // задаёт соседняя колонка, а на 1920 фото не превращается в
              // огромный квадрат рядом с тремя строками текста.
              "md:before:block md:before:pt-[45%] md:before:content-['']",
              photoFirst && "md:order-1",
            )}
            data-reveal
            style={revealDelay(1)}
          >
            <Image
              src={photo}
              alt={photoAlt ?? title ?? ""}
              fill
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

export default AboutLayout;
