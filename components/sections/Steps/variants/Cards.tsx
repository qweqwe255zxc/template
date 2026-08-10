import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getIcon } from "@/lib/icons";
import { revealDelay } from "@/lib/reveal";
import { bentoSpan } from "@/lib/bentoSpan";
import { StepsHeader } from "../parts/StepsHeader";
import type { StepsSection } from "@/types/site";

/**
 * Заголовок пилюлей по центру, дальше — ряд карточек: плашка .icon-tile
 * под иконкой (форма — ThemeConfig.iconShape/iconShape секции), «N.
 * Заголовок» одной строкой (номер шага в заголовке, а не отдельным
 * элементом — так короче), описание.
 */
export function Cards(props: StepsSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    items,
    headerAlign,
    iconShape,
    fillLastRow = true,
  } = props;

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <Container>
        <StepsHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          align={headerAlign}
          className="mb-12 md:mb-16"
        />

        {/* lg (1024px) — 3 колонки, не 4: на планшетных/небольших десктопных
            экранах 4 колонки сжимали заголовок с описанием до нечитаемой
            ширины. 4 колонки появляются только на xl (1280px+), где на
            каждую карточку остаётся достаточно места. */}
        <ol className="grid gap-gutter sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, index) => {
            const Icon = getIcon(item.icon);

            return (
              <li
                key={item.number}
                data-reveal
                style={revealDelay(index)}
                className={fillLastRow ? bentoSpan(index, items.length, { sm: 2, lg: 3, xl: 4 }) : undefined}
              >
                <Card variant="framed" className="h-full">
                  {Icon ? (
                    <span className="icon-tile mb-4">
                      <Icon aria-hidden="true" strokeWidth={1.5} className="size-5" />
                    </span>
                  ) : null}

                  <h3 className="max-w-[22ch] font-heading text-h3">
                    {item.number}. {item.title}
                  </h3>
                  <p className="mt-3 text-body text-fg-muted">{item.text}</p>
                </Card>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}

export default Cards;
