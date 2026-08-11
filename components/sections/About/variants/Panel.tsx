import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getIcon } from "@/lib/icons";
import { revealDelay } from "@/lib/reveal";
import type { AboutSection } from "@/types/site";

/**
 * Самый насыщенный вариант About: текст слева (заголовок, абзацы,
 * реплика), фото с плашкой и боковая карточка со статами — справа.
 * Настоящие 2 колонки, а не заголовок во всю ширину с фото где-то под
 * ним: раньше `text` тут вообще не рендерился (компонент читал только
 * number/eyebrow/title), и колонка с абзацами просто отсутствовала —
 * оставался заголовок и узкая карточка фото с пустотой сбоку.
 */
export function Panel(props: AboutSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    text,
    aside,
    photo,
    photoAlt,
    photoCaption,
    panel,
    highlights = [],
    iconShape,
  } = props;

  if (process.env.NODE_ENV !== "production" && !photo) {
    console.warn(
      `[About] Секция "${id}": variant="panel" требует photo — фото и боковая карточка не отрендерены.`,
    );
  }

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <Container>
        {/* lg (1024), а не md (768): на 768–1023px фото (7/12) прижималось
            к тексту (5/12) почти вплотную — одного gap-x-gutter не хватало
            на этой ширине колонки, картинка «наезжала» на текст. Ниже lg
            секция теперь одноколоночная (уже было так до 768), а с lg сразу
            получает те же 7/12 колонки, но при ширине, где для них
            физически достаточно места. */}
        <div className="grid gap-x-gutter gap-y-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5" data-reveal>
            {number || eyebrow ? (
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
            ) : null}
            {title ? <h2 className="mt-4 font-heading text-h1">{title}</h2> : null}

            <div className="mt-5 space-y-4">
              {text.map((paragraph) => (
                <p key={paragraph} className="max-w-[46ch] text-body text-fg-muted">
                  {paragraph}
                </p>
              ))}
            </div>

            {aside ? (
              <p className="mt-6 max-w-[40ch] border-l border-rule pl-6 text-body text-fg-muted">
                {aside}
              </p>
            ) : null}
          </div>

          {photo ? (
            <div className="lg:col-span-7">
              {/* Обёртка нужна, чтобы плашка была СОСЕДОМ фото-бокса, а не
                  его потомком: у бокса overflow-hidden (кадрирует фото), и
                  плашка внутри него обрезалась бы по его границе. Раньше
                  это лечили line-clamp-2 на заголовке — то есть молча
                  резали текст клиента (§1.5 п.2). */}
              <div className="relative" data-reveal style={revealDelay(1)}>
                <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-[16/11]">
                  <div className="ui-media-raised absolute inset-0 overflow-hidden">
                    <Image
                      src={photo}
                      alt={photoAlt ?? title ?? ""}
                      fill
                      sizes="(min-width: 768px) 55vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                {photoCaption ? (
                  // До sm фото-бокс низкий, и плашка поверх него съедала бы
                  // кадр целиком — там она идёт обычным потоком под фото.
                  <div className="ui-popover mt-4 bg-card p-5 sm:absolute sm:bottom-5 sm:left-5 sm:mt-0 sm:max-w-[16rem]">
                    <p className="text-caption font-medium uppercase text-accent">
                      {photoCaption.eyebrow}
                    </p>
                    <p className="mt-1 font-display text-h4">
                      {photoCaption.title}
                    </p>
                  </div>
                ) : null}
              </div>

              {panel ? (
                <div
                  className="mt-8 border-t border-rule pt-8"
                  data-reveal
                  style={revealDelay(2)}
                >
                  <p className="font-display text-h2">{panel.title}</p>
                  <p className="mt-4 max-w-[42ch] text-body text-fg-muted">{panel.text}</p>

                  {panel.stats && panel.stats.length > 0 ? (
                    // lg, а не sm: эта сетка живёт внутри lg:col-span-7 —
                    // с sm (640px, брейкпоинт вьюпорта, а не колонки) 4
                    // колонки включались ещё до того, как колонка реально
                    // расширялась хотя бы до 7/12 (md, 768px), и в диапазоне
                    // 768–900px ячейки становились ~85–90px — слишком узко
                    // для text-h3 значения с подписью.
                    <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
                      {panel.stats.map((stat) => (
                        <div key={stat.label}>
                          <p className="tabular font-display text-h3 text-accent">
                            {stat.value}
                          </p>
                          <p className="mt-1 text-small text-fg-muted">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {panel.link ? (
                    <Button href={panel.link.href} variant="quiet" className="mt-7 uppercase">
                      {panel.link.label}
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {highlights.length > 0 ? (
          <ul className="mt-12 grid gap-8 border-t border-rule pt-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
            {highlights.map((item, index) => {
              const Icon = getIcon(item.icon);
              return (
                <li key={item.title} data-reveal style={revealDelay(index)}>
                  {Icon ? (
                    <span className="icon-tile">
                      <Icon aria-hidden="true" strokeWidth={1.5} className="size-5" />
                    </span>
                  ) : null}
                  <p className="mt-3 font-display text-h4">{item.title}</p>
                  <p className="mt-1.5 text-small text-fg-muted">{item.text}</p>
                </li>
              );
            })}
          </ul>
        ) : null}
      </Container>
    </Section>
  );
}

export default Panel;
