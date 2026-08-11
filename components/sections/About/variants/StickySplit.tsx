import Image from "next/image";
import { ActionGroup } from "@/components/ui/ActionGroup";
import { Section } from "@/components/ui/Section";
import { StickySplit as SplitLayout } from "@/components/ui/StickySplit";
import { revealDelay } from "@/lib/reveal";
import type { AboutSection } from "@/types/site";

/**
 * Рассказ о компании абзацами справа от залипающего заголовка — член
 * семейства `sticky-split` (общая ось 4/8, см. `ui/StickySplit`).
 *
 * Отличие от `quiet-split` и `split-actions`, которые тоже делят экран
 * пополам: там слева ТЕКСТ, а справа фото — то есть колонки заняты
 * содержимым обеих сторон. Здесь слева только заголовок раздела, и
 * левая колонка держит ту же вертикаль, что у всех соседних секций.
 * Ради этого фото уезжает под текст, а не встаёт второй колонкой.
 *
 * Абзацы идут ступенью `text-lead`, а не `text-body`: в колонке 8/12 у
 * блока «о компании» нет соседей, которые задавали бы масштаб, и
 * обычный body-кегль читается как примечание, а не как основной текст
 * раздела.
 */
export function StickySplit(props: AboutSection) {
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
    actions = [],
  } = props;

  return (
    <Section id={id} surface={surface}>
      <SplitLayout
        number={number}
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        aside={
          actions.length > 0 ? <ActionGroup actions={actions} align="start" /> : undefined
        }
      >
        <div className="space-y-6" data-reveal>
          {text.map((paragraph, index) => (
            <p key={index} className="max-w-[62ch] text-lead text-fg-muted">
              {paragraph}
            </p>
          ))}
        </div>

        {photo ? (
          <div
            className="ui-media relative mt-12 aspect-[16/9] w-full overflow-hidden"
            data-reveal
            style={revealDelay(1)}
          >
            <Image
              src={photo}
              alt={photoAlt ?? ""}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </SplitLayout>
    </Section>
  );
}

export default StickySplit;
