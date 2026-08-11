import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import { COMPACT_H1 } from "../parts/headlineScale";
import { HeroFacts } from "../parts/HeroFacts";
import type { HeroSection } from "@/types/site";

/**
 * Афиша (постер) во всю ширину окна: слева акцентная панель с текстом,
 * справа фото встык к краю экрана. Единственная раскладка hero без
 * Container — в этом и смысл, поэтому Section идёт со spacing="none", а
 * отступы держит сама панель. (Раньше назывался "billboard" — рекламная
 * метафора без опоры в остальном шаблоне; "poster" точнее описывает саму
 * раскладку — цельная афиша, а не рекламный щит.)
 *
 * Как текст встаёт по одной оси с хедером. Панель занимает большую часть
 * ОКНА, а вся остальная страница живёт в контейнере 1600px, отбитом от
 * краёв. Если дать панели обычный px-gutter, её текст прижмётся к краю
 * экрана и разъедется с логотипом в хедере тем сильнее, чем шире монитор.
 * Поэтому левый паддинг панели равен внешнему полю контейнера плюс
 * обычный gutter — левая ось страницы остаётся одна на всех. На узких
 * экранах, где контейнер уже упирается в края, max() вырождает правило в
 * обычный px-gutter.
 *
 * Смещением, а не шириной. Раньше тут стоял
 * max-w-[calc(var(--container-page)/2)] — ту же ось он давал только потому,
 * что панель была ровно половиной окна, и «ширина текста» с «отступом
 * слева» оказывались одним и тем же числом. Настроить одно без другого
 * было нельзя: стоило контейнеру сузиться, как кап начинал срабатывать и
 * резал текст, из-за чего заголовок переносился лишний раз и афиша
 * становилась ВЫШЕ, а не ниже. Ось теперь записана в CSS буквально.
 *
 * Вторая колонка — только фото: виджет на полноэкранной половине читался
 * бы как случайная карточка в пустоте. Без image вариант вырождается в
 * одну акцентную полосу (роутер об этом предупреждает).
 */
export function Poster(props: HeroSection) {
  const {
    id,
    surface = "paper",
    badge,
    headline,
    lead,
    actions = [],
    facts = [],
    image,
    hideMediaOnMobile,
  } = props;

  return (
    <Section id={id} surface={surface} spacing="none">
      {/* На lg+ панель шире половины (7fr/5fr): текстовой колонке нужно
          место под заголовок, а асимметрия афише только к лицу. */}
      <div className="grid md:grid-cols-2 md:items-stretch lg:grid-cols-[7fr_5fr]">
        {/* Панель — собственный контекст поверхности: data-surface
            переопределяет цветовые переменные для всего поддерева, и
            текст, линейки и кнопки внутри сами становятся «на акценте».
            Ни одного цвета руками тут нет. */}
        <div
          data-surface="accent"
          className="bg-bg pt-hero-top pb-hero text-fg"
        >
          <div className="w-full pr-gutter pl-[max(var(--layout-gutter),calc((100vw-var(--container-page))/2+var(--layout-gutter)))]">
            {badge ? (
              <p
                className="text-caption font-medium uppercase text-fg-muted"
                data-reveal
              >
                {badge}
              </p>
            ) : null}

            {/* Заголовок тут свой, а не через HeroLede: на акцентной
                панели правило «последняя строка — акцентным курсивом»
                не работает, акцент по акценту не читается вовсе. Кегль
                при этом берётся из общего модуля, а не заводится заново. */}
            <h1
              className={`font-heading text-h1 break-words ${badge ? "mt-7" : ""}`}
              style={COMPACT_H1}
              data-reveal
            >
              {headline.map((line, index) => (
                <span key={index} className="md:block">
                  {line}
                  {index < headline.length - 1 ? " " : null}
                </span>
              ))}
            </h1>

            {lead ? (
              <p
                className="mt-8 max-w-[46ch] text-lead text-fg-muted"
                data-reveal
                style={revealDelay(2)}
              >
                {lead}
              </p>
            ) : null}

            {actions.length > 0 ? (
              <div
                className="mt-10 flex flex-col flex-wrap gap-4 sm:flex-row sm:items-center"
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

            {/* from="lg", а не дефолтный sm: между md и lg панель — 50vw,
                там три колонки не помещаются. Столбиком (columns={1})
                полоса занимала 423px — больше трети всей афиши. */}
            <HeroFacts facts={facts} from="lg" />
          </div>
        </div>

        {image ? (
          // Высоту строки задаёт панель с текстом; фото просто
          // растягивается на неё (items-stretch + h-full) и кадрируется
          // object-cover. Отдельная min-height тут была бы вторым
          // источником правды о высоте первого экрана.
          <div
            className={cn(
              // До md фото стоит своей строкой, и высоту ему даёт
              // собственная ширина (aspect), а не число в rem.
              "aspect-[4/3] md:aspect-auto",
              hideMediaOnMobile ? "hidden md:relative md:block" : "relative",
            )}
          >
            <Image
              src={image}
              alt={headline.join(" ")}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        ) : null}
      </div>
    </Section>
  );
}

export default Poster;
