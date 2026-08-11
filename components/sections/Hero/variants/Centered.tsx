import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { revealDelay } from "@/lib/reveal";
import { HeroFacts } from "../parts/HeroFacts";
import type { HeroSection } from "@/types/site";

/**
 * Центрированная афиша: всё стоит на одной оси симметрии — колонтитул,
 * заголовок, лид, кнопки. Второй колонки нет вообще, поэтому image и
 * widget тут не рендерятся (класть их некуда, а молча показывать половину
 * данных хуже, чем не показывать: об этом предупреждает роутер).
 *
 * Поверхность по умолчанию — "ink": на тёмной земле центрированная
 * композиция читается как афиша, на светлой — как незаполненная страница.
 * Значение из конфига, как всегда, главнее.
 *
 * Ширина текста ограничена не пикселями, а мерой строки: заголовок
 * ~18 знаков, лид ~56. Центрированный текст длиннее меры распадается —
 * глаз теряет начало следующей строки, потому что левый край не
 * фиксирован.
 *
 * Рельса (HeroRail) тут намеренно не используется: она вешает
 * вертикальный колонтитул на ЛЕВОЕ поле, то есть ломает ось симметрии,
 * ради которой вариант и существует. Номер и rail идут обычной строкой
 * над заголовком.
 */
export function Centered(props: HeroSection) {
  const {
    id,
    surface = "ink",
    number,
    rail,
    headline,
    lead,
    actions = [],
    facts = [],
  } = props;

  const kicker = [number, rail].filter(Boolean).join(" · ");

  return (
    <Section id={id} surface={surface} spacing="hero" tint="hero">
      <Container>
        <div className="mx-auto max-w-[52rem] text-center">
          {kicker ? (
            <p
              className="tabular text-caption font-medium uppercase text-fg-muted"
              data-reveal
            >
              {kicker}
            </p>
          ) : null}

          {/* Ручные переносы включаются с md, как и в остальных hero: на
              узком экране они дают висячие строки. */}
          <h1
            className={`font-heading text-h1 ${kicker ? "mt-7" : ""}`}
            data-reveal
            style={revealDelay(1)}
          >
            {headline.map((line, index) => (
              <span key={index} className="md:block">
                {index === headline.length - 1 ? (
                  <span className="text-accent">{line}</span>
                ) : (
                  line
                )}
                {index < headline.length - 1 ? " " : null}
              </span>
            ))}
          </h1>

          {lead ? (
            <p
              className="mx-auto mt-8 max-w-[56ch] text-lead text-fg-muted"
              data-reveal
              style={revealDelay(2)}
            >
              {lead}
            </p>
          ) : null}

          {actions.length > 0 ? (
            <div
              className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center"
              data-reveal
              style={revealDelay(3)}
            >
              {actions.map((action, index) => (
                <Button
                  key={index}
                  href={action.href}
                  variant={action.variant ?? "primary"}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>

        <HeroFacts facts={facts} />
      </Container>
    </Section>
  );
}

export default Centered;
