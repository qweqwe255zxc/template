import Image from "next/image";
import { ActionGroup } from "@/components/ui/ActionGroup";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import { COMPACT_H1 } from "../parts/headlineScale";
import { HeroFacts } from "../parts/HeroFacts";
import type { HeroSection } from "@/types/site";

/**
 * Первый экран семейства `atelier` (см. components/ui/AtelierHeader):
 * текст в левой половине, фотография в правой встык к краю окна.
 *
 * Ярусы слева: колонтитул капителью с разрядкой 0.22em → заголовок →
 * ШТРИХ → лид → кнопки → полоса фактов. Штрих под заголовком — тот же
 * знак семейства, что в шапке раздела, и стоит он ровно на том же месте
 * относительно заголовка. Здесь он появляется впервые на странице, и
 * дальше повторяется в каждом разделе — это и есть то, что связывает
 * первый экран с остальными двенадцатью.
 *
 * Чем отличается от `split`, у которого тоже «текст слева, фото
 * справа»:
 *
 *   1. Фотография идёт ВСТЫК к правому краю окна и на всю высоту
 *      первого экрана, а не колонкой внутри контейнера. Приём тот же,
 *      что в `poster`, и ось левой колонки считается так же (см. ниже) —
 *      иначе текст разъедется с логотипом хедера тем сильнее, чем шире
 *      монитор.
 *   2. Между заголовком и лидом стоит штрих.
 *   3. Колонтитул — строка над заголовком, а не вертикальный рельс на
 *      левом поле: рельс требует свободного поля слева, которого в этой
 *      раскладке нет вовсе.
 *
 * `widget` не читается — вторая колонка занята фотографией (роутер
 * предупреждает). `image` при этом НЕ обязателен: без него раскладка
 * честно вырождается в одноколоночную внутри обычного контейнера, а не
 * оставляет половину экрана пустой. Это то же решение, что у
 * `editorial`, и по той же причине — семейство сквозное, и откат на
 * чужую раскладку сломал бы страницу сильнее, чем отсутствующее фото.
 */
export function Atelier(props: HeroSection) {
  const {
    id,
    surface = "surface",
    number,
    rail,
    headline,
    lead,
    actions = [],
    facts = [],
    image,
    hideMediaOnMobile,
  } = props;

  const hasKicker = Boolean(number || rail);

  const content = (
    <>
      {hasKicker ? (
        <p
          className="flex flex-wrap items-baseline gap-x-3 gap-y-1 break-words text-caption font-medium uppercase tracking-[0.22em] text-fg-muted"
          data-reveal
        >
          {number ? <span className="tabular">{number}</span> : null}
          {rail ? <span>{rail}</span> : null}
        </p>
      ) : null}

      {/* Заголовок свой, а не через HeroLede: ступень та же (COMPACT_H1 —
          колонка примерно в половину экрана), но между заголовком и
          лидом обязан встать штрих, а HeroLede рисует эти три яруса
          одним куском. Правило «последняя строка акцентная» сохранено —
          это общее правило шаблона, и раскладка не имеет права его
          отменять. */}
      <h1
        className={cn("break-words font-heading text-h1", hasKicker && "mt-6")}
        style={COMPACT_H1}
        data-reveal
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

      {/* Штрих — тот же знак и тем же цветом, что в шапке раздела,
          включая доводку под акцентную поверхность. Почему двух классов
          мало и откуда взялся второй — см. комментарий в
          components/ui/AtelierHeader.tsx. */}
      <div
        className="mt-7 h-0.5 w-12 bg-accent-border [[data-surface=accent]_&]:bg-fg"
        data-reveal
      />

      {lead ? (
        <p
          className="mt-7 max-w-[46ch] text-lead text-fg-muted"
          data-reveal
          style={revealDelay(1)}
        >
          {lead}
        </p>
      ) : null}

      {actions.length > 0 ? (
        // ActionGroup, а не голые Button в ряд, как в HeroLede: кнопки
        // одной группы обязаны быть одной ширины (§1.5 CLAUDE.md), и
        // держит это правило один компонент на весь шаблон. В колонке
        // шириной в половину экрана разница особенно заметна: «Смотреть
        // возможности» и «Как собрать лендинг» отличаются на 60px.
        <div className="mt-10" data-reveal style={revealDelay(2)}>
          <ActionGroup actions={actions} />
        </div>
      ) : null}

      {/* from="lg", а не дефолтный sm: между sm и lg текст занимает всю
          ширину окна, но с lg колонка становится половиной — три
          колонки фактов там ужимаются до ~140px и подписи рвутся. */}
      <HeroFacts facts={facts} from="lg" />
    </>
  );

  if (!image) {
    return (
      <Section id={id} surface={surface} spacing="hero" tint="hero">
        <Container>{content}</Container>
      </Section>
    );
  }

  return (
    <Section id={id} surface={surface} spacing="none">
      <div className="grid lg:grid-cols-2 lg:items-stretch">
        {/* Ось левой колонки — ровно та же формула, что в `poster`, и
            заведена по той же причине: колонка занимает половину ОКНА, а
            вся остальная страница живёт в контейнере 1600px, отбитом от
            краёв. С обычным px-gutter текст прижался бы к краю экрана и
            разъехался с логотипом хедера тем сильнее, чем шире монитор.
            На узких экранах, где контейнер и так упирается в края,
            max() вырождает правило в обычный px-gutter. */}
        <div className="flex flex-col justify-center pt-hero-top pr-gutter pb-hero pl-[max(var(--layout-gutter),calc((100vw-var(--container-page))/2+var(--layout-gutter)))] lg:pr-14">
          {content}
        </div>

        {/* Высоту строки задаёт текстовая колонка; фото растягивается на
            неё (items-stretch + fill) и кадрируется object-cover.
            Отдельная высота тут была бы вторым источником правды о
            высоте первого экрана. До lg фото стоит своей строкой, и
            высоту ему даёт собственная ширина (aspect), а не число. */}
        <div
          className={cn(
            "aspect-[4/3] lg:aspect-auto",
            hideMediaOnMobile ? "hidden lg:relative lg:block" : "relative",
          )}
        >
          <Image
            src={image}
            alt={headline.join(" ")}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="object-cover"
          />
        </div>
      </div>
    </Section>
  );
}

export default Atelier;
