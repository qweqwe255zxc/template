import { ActionGroup } from "@/components/ui/ActionGroup";
import { Section } from "@/components/ui/Section";
import { StickySplit as SplitLayout } from "@/components/ui/StickySplit";
import { revealDelay } from "@/lib/reveal";
import { COMPACT_H1 } from "../parts/headlineScale";
import { HeroFacts } from "../parts/HeroFacts";
import type { HeroSection } from "@/types/site";

/**
 * Первый экран на оси 4/8 — парный вариант к `sticky-split` остальных
 * секций. Нужен, чтобы страница, собранная этим приёмом, начиналась с
 * той же вертикали, а не с чужой раскладки: у hero нет шапки раздела, и
 * без этого варианта первая же секция ломала бы язык страницы.
 *
 * БЕЗ залипания, в отличие от остальных членов семейства, — и это не
 * упущение. Sticky держит заголовок, пока мимо него прокручивают
 * содержимое; в первом экране прокручивать мимо нечего, липнуть не к
 * чему, а закреплённый h1 просто уехал бы поверх следующей секции.
 * Общий `ui/StickySplit` умеет это через `sticky={false}` — ось и все
 * отступы остаются те же, до пикселя.
 *
 * Слева кикер и заголовок, справа лид, кнопки и факты. Заголовок берёт
 * COMPACT_H1: колонка 4/12 узкая даже по меркам половинной, полный
 * потолок кегля рвал бы его посреди слова.
 *
 * Фото и виджет этот вариант не рендерит: обе колонки уже заняты
 * текстом, третьей нет. Для hero с медиа есть split, showcase и poster.
 */
export function StickySplit(props: HeroSection) {
  const {
    id,
    surface = "paper",
    badge,
    headline,
    lead,
    actions = [],
    facts = [],
  } = props;

  return (
    <Section id={id} surface={surface} spacing="hero" tint="hero">
      <SplitLayout
        sticky={false}
        eyebrow={badge}
        titleSlot={
          <h1 className="font-heading text-h1 break-words" style={COMPACT_H1} data-reveal>
            {headline.map((line, index) => (
              <span key={index} className="lg:block">
                {line}
                {index < headline.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
        }
      >
        {lead ? (
          <p
            className="max-w-[56ch] text-lead text-fg-muted"
            data-reveal
            style={revealDelay(1)}
          >
            {lead}
          </p>
        ) : null}

        <ActionGroup actions={actions} align="start" className="mt-10" />

        <HeroFacts facts={facts} from="lg" />
      </SplitLayout>
    </Section>
  );
}

export default StickySplit;
