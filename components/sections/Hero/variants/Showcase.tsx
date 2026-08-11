import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import { HeroFacts } from "../parts/HeroFacts";
import { HeroLede } from "../parts/HeroLede";
import { HeroPanel } from "../parts/HeroPanel";
import { HeroProof } from "../parts/HeroProof";
import { HeroWidget } from "../parts/HeroWidget";
import type { HeroSection } from "@/types/site";

/**
 * Витрина продукта: текст слева, панель с медиа справа, плашка-анонс над
 * заголовком. Раскладка 6/6 — в отличие от split (1/6/5), где первую
 * колонку занимает вертикальный рельс.
 *
 * Чем отличается от split по существу, а не по числам:
 *
 * — Рельса нет вообще. Он уводит заголовок от левого края контейнера, а
 *   тут заголовок обязан начинаться там же, где всё остальное на
 *   странице: композиция держится на ровной левой оси, а не на поле.
 *   Номер раздела и rail в этом варианте не читаются (о чём предупреждает
 *   роутер), их место занимает badge.
 * — Медиа лежит не на фоне секции, а в панели (Card variant="elevated"):
 *   собственная поверхность, тень тарифа, при frame="browser" — полоса
 *   окна. Это витрина интерфейса, а не фотография.
 *
 * Вторую колонку занимает image ЛИБО widget — как и в split. Если не
 * задано ни то, ни другое, вариант вырождается в одну колонку: рисовать
 * пустую половину экрана нечем (роутер об этом предупреждает).
 */
export function Showcase(props: HeroSection) {
  const {
    id,
    surface = "paper",
    badge,
    frame = "plain",
    headline,
    lead,
    actions = [],
    facts = [],
    proof,
    image,
    widget,
    hideMediaOnMobile,
  } = props;

  const hasPanel = Boolean(image || widget);

  return (
    <Section id={id} surface={surface} spacing="hero" tint="hero">
      <Container>
        <div className="grid gap-x-gutter gap-y-12 md:grid-cols-12 md:items-center">
          <div className={hasPanel ? "md:col-span-6" : "md:col-span-9"}>
            {badge ? (
              <div className="mb-7" data-reveal>
                <Badge variant="soft">{badge}</Badge>
              </div>
            ) : null}

            {/* compact — тот же пониженный потолок --size-h1, что в split:
                в колонке на половину ширины полный кегль ломает ручные
                переносы заголовка вторым уровнем. */}
            <HeroLede
              headline={headline}
              lead={lead}
              actions={actions}
              compact
            />

            {proof ? <HeroProof proof={proof} /> : null}
          </div>

          {image ? (
            <div
              className={cn(
                "md:col-span-6 md:col-start-7 md:pl-6 lg:pl-10",
                hideMediaOnMobile && "hidden md:block",
              )}
            >
              <HeroPanel image={image} alt={headline.join(" ")} frame={frame} />
            </div>
          ) : widget ? (
            <div
              className={cn(
                "md:col-span-6 md:col-start-7 md:pl-6 lg:pl-10",
                hideMediaOnMobile && "hidden md:block",
              )}
              data-reveal
              style={revealDelay(1)}
            >
              <HeroWidget widget={widget} />
            </div>
          ) : null}
        </div>

        <HeroFacts facts={facts} />
      </Container>
    </Section>
  );
}

export default Showcase;
