import Image from "next/image";
import { ActionGroup } from "@/components/ui/ActionGroup";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionTicker } from "@/components/ui/Ticker";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import { HeroFacts } from "../parts/HeroFacts";
import type { HeroSection } from "@/types/site";

/**
 * Первый экран семейства `market` (см. components/ui/MarketHeader):
 * заголовок капслоком акцентом слева, лид и кнопки справа по нижнему
 * краю, под ними полоса фактов, а замыкает экран бегущая строка.
 *
 * Чем отличается от `split`, у которого тоже «текст слева, что-то
 * справа»:
 *
 *   1. Справа не медиа и не виджет, а ПРОДОЛЖЕНИЕ ТЕКСТА — лид и
 *      кнопки. Колонки выровнены по НИЖНЕМУ краю, то есть заголовок
 *      растёт вверх, а лид остаётся стоять на одной линии с ним. Это
 *      главная особенность раскладки: экран читается как афиша с
 *      подписью, а не как две независимые колонки.
 *   2. Заголовок акцентный ЦЕЛИКОМ и в верхнем регистре. Общее правило
 *      шаблона «акцентная последняя строка» тут не действует: акцент по
 *      акценту не виден, а половина строк обычным цветом читалась бы
 *      как опечатка. Это же правило продолжается в шапках разделов
 *      (`MarketHeader`) — весь приём держится на том, что заголовок
 *      кричит цветом.
 *   3. Экран заканчивается бегущей строкой, если у секции задан
 *      `ticker`. Полоса стоит вне контейнера, во всю ширину окна, и
 *      служит отбивкой между первым экраном и первым разделом.
 *
 * `widget` не читается — второй колонки под карточку метрик нет
 * (роутер предупреждает). `image` не обязателен: в исходном приёме
 * первый экран чисто типографский. Если фото задано, оно идёт полосой
 * во всю ширину окна под фактами — так же, как в `editorial`, и по той
 * же причине: молча выбрасывать заданное поле нельзя, а колонки для
 * него в этой раскладке нет.
 */
export function Market(props: HeroSection) {
  const {
    id,
    surface = "paper",
    number,
    rail,
    headline,
    lead,
    actions = [],
    facts = [],
    image,
    hideMediaOnMobile,
    ticker,
  } = props;

  const hasKicker = Boolean(number || rail);

  return (
    <Section id={id} surface={surface} spacing="hero" tint="hero">
      <Container>
        {hasKicker ? (
          <p
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 break-words text-caption font-semibold text-fg-muted"
            data-reveal
          >
            {number ? <span className="tabular">{number}</span> : null}
            {rail ? <span>{rail}</span> : null}
          </p>
        ) : null}

        {/* items-end — та самая нижняя линия, на которой стоят обе
            колонки. Ниже lg колонок нет вовсе: заголовок в 55% ширины
            на планшете даёт три знака в строке. */}
        <div
          className={cn(
            "grid gap-x-gutter gap-y-10 lg:grid-cols-[1.15fr_1fr] lg:items-end",
            hasKicker && "mt-6",
          )}
        >
          <h1
            className="break-words font-heading text-h1 uppercase text-accent [[data-surface=accent]_&]:text-fg [[data-surface=ink]_&]:text-fg"
            data-reveal
          >
            {headline.map((line, index) => (
              <span key={index} className="md:block">
                {line}
                {index < headline.length - 1 ? " " : null}
              </span>
            ))}
          </h1>

          <div className="flex flex-col gap-7">
            {lead ? (
              <p
                className="max-w-[46ch] text-lead text-fg-muted"
                data-reveal
                style={revealDelay(1)}
              >
                {lead}
              </p>
            ) : null}

            {/* ActionGroup, а не голые Button: кнопки одной группы
                обязаны быть одной ширины (§1.5). В колонке 1fr разница
                особенно заметна. */}
            {actions.length > 0 ? (
              <div data-reveal style={revealDelay(2)}>
                <ActionGroup actions={actions} />
              </div>
            ) : null}
          </div>
        </div>

        {/* from="sm": полоса лежит в контейнере страницы во всю его
            ширину, а не в половинной колонке, — три колонки помещаются
            уже с 640px. */}
        <HeroFacts facts={facts} from="sm" />
      </Container>

      {image ? (
        <div
          className={cn(
            "relative mt-14 aspect-[21/9] w-full md:mt-20",
            hideMediaOnMobile && "hidden md:block",
          )}
          data-reveal
        >
          <Image
            src={image}
            alt={headline.join(" ")}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>
      ) : null}

      {/* Вне Container намеренно: полоса идёт во всю ширину ОКНА и
          садится встык к следующему разделу — арифметику нижнего
          отступа держит SectionTicker, здесь только указано, каким
          spacing живёт секция. */}
      {ticker ? <SectionTicker text={ticker} spacing="hero" /> : null}
    </Section>
  );
}

export default Market;
