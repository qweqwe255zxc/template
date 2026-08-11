import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import { HeroFacts } from "../parts/HeroFacts";
import { HeroLede } from "../parts/HeroLede";
import { HeroRail } from "../parts/HeroRail";
import { HeroWidget } from "../parts/HeroWidget";
import { resolveHeroLayout } from "../parts/resolveHeroLayout";
import type { HeroSection } from "@/types/site";

/**
 * Двухколоночный hero: рельс (1) + текст (6) + визуал (5).
 * Визуал — фото ИЛИ карточка метрик, см. resolveHeroLayout.
 *
 * Рельс тут col-span-1, а не 2: он просто тонкая подпись сбоку, а не
 * визуальный блок, и на глаз не читается как левая граница композиции —
 * ею читается начало заголовка. При col-span-2 слева перед текстом
 * оставался широкий пустой отступ, а справа фото упиралось прямо в край
 * контейнера — границы читались неровно.
 *
 * items-center на строке: фото заведомо выше текстовой колонки (у него
 * явная высота, см. ниже). При дефолтном stretch все ячейки тянутся от
 * общего верхнего края, и весь лишний рост уходит вниз. items-center
 * центрирует более низкую ячейку (текст) относительно более высокой
 * (фото), причём браузером, а не магическим отступом. Рельсу это не
 * нужно — он переопределён обратно в self-start, чтобы остаться вровень
 * с началом заголовка.
 */
export function Split(props: HeroSection) {
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
    widget,
    hideMediaOnMobile,
  } = props;

  const { withImage, withWidget } = resolveHeroLayout(props);

  return (
    <Section
      id={id}
      surface={surface}
      // Раньше здесь была развилка spacing="none" + ручной pt/pb с тремя
      // брейкпоинтами: она подгоняла верхний отступ под фиксированную
      // высоту фото и прибавляла --header-height вручную. Обе задачи ушли
      // в токены — налог на fixed-хедер теперь в --space-hero-top
      // (spacing="hero" у всех шести вариантов), а фото ведётся аспектом
      // и подгонять под него нечего.
      spacing="hero"
      tint="hero"
    >
      <Container>
        <div className="grid gap-x-gutter lg:grid-cols-12 lg:items-center">
          <HeroRail
            number={number}
            rail={rail}
            className="lg:col-span-1 lg:self-start"
          />

          <HeroLede
            headline={headline}
            lead={lead}
            actions={actions}
            compact
            className="lg:col-span-6"
          />

          {withImage ? (
            // Фото — col-span-5 col-start-8, встык к правому краю
            // контейнера: rail(1)+text(6)=7, разрыва нет. Высоту на всех
            // ширинах держит аспект, без явных lg:h-[34rem]/xl:h-[40rem]:
            // те 544/640px не зависели ни от одного токена, поэтому фото
            // не реагировало на ширину контейнера, и в колонке 402px
            // «фото 4/3» рисовалось портретом 1:1.6 — заявленный аспект
            // нарушался на каждом десктопе, а секция вылезала за первый
            // экран. Квадрат на lg+ компенсирует узкую колонку.
            // pl-10/xl:pl-16 — единственный источник зазора между текстом
            // и фото (плюс стандартный gap-x-gutter). Паддинг на внешнем
            // grid-элементе, overflow-hidden на внутреннем боксе, чтобы
            // паддинг не резал скругление.
            <div
              className={cn(
                "mt-10 lg:col-span-5 lg:col-start-8 lg:mt-0 lg:pl-10 xl:pl-16",
                hideMediaOnMobile && "hidden lg:block",
              )}
            >
              <div className="ui-media-raised relative aspect-[4/3] w-full overflow-hidden lg:aspect-square">
                <Image
                  src={image as string}
                  alt={headline.join(" ")}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover"
                  data-reveal
                  style={revealDelay(1)}
                />
              </div>
            </div>
          ) : null}

          {withWidget && widget ? (
            // Виджет живёт в той же колонке, что и фото, но без явной
            // высоты: карточка ровно такая, какой её делает содержимое, а
            // по вертикали её центрирует items-center на строке.
            // hidden lg:block — сознательно: до lg грид схлопнут в
            // одну колонку, и карточка встала бы между лидом и кнопками,
            // уводя CTA за первый экран. Метрики виджета — витрина, а не
            // единственный источник этих чисел: для мобильного есть facts
            // ниже и секция stats.
            <div
              className="hidden lg:col-span-5 lg:col-start-8 lg:block lg:pl-10 xl:pl-16"
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

export default Split;
