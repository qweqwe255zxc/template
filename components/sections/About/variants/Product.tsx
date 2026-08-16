import Image from "next/image";
import { ActionGroup } from "@/components/ui/ActionGroup";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ProductHeader } from "@/components/ui/ProductHeader";
import { Section } from "@/components/ui/Section";
import { revealDelay } from "@/lib/reveal";
import type { AboutSection } from "@/types/site";

/**
 * «О компании» семейства `product`: текст раздела слева, сетка метрик
 * 2×2 справа.
 *
 * Правая колонка собирается из `panel.stats` — того самого поля, которое
 * читает variant="panel". Новых полей вариант не заводит намеренно: в
 * исходном приёме справа стоят четыре плитки «2021 / 68 / 7 / 4,9», и
 * это ровно `{ value, label }[]`, уже описанные в `AboutPanel`. Заводить
 * под них второе поле значило бы, что один и тот же список цифр в
 * конфиге называется по-разному в зависимости от выбранной раскладки.
 *
 * Если `panel.stats` не заданы, правую колонку занимает `photo`. Если
 * нет ни того, ни другого, раздел честно становится одноколоночным —
 * это не поломка, а тот же текст без витрины; роутер в этом случае
 * ничего не откатывает, потому что раскладка остаётся законченной.
 *
 * Из `panel` читаются ТОЛЬКО `stats`: `title`, `text` и `link` панели —
 * это содержимое боковой карточки варианта `panel`, а здесь боковой
 * карточки нет, справа стоит сетка. Дублировать их рядом с метриками
 * значило бы собрать в одной колонке два разных блока из одного поля.
 *
 * Чего вариант не читает: `aside`, `photoCaption`, `highlights`, `badge`,
 * `decorative`, `frame`, `photoPosition` — плашки поверх фото и вторая
 * ось расположения, которых в этой раскладке просто нет.
 */
export function Product(props: AboutSection) {
  const {
    id,
    surface = "surface",
    number,
    eyebrow,
    title,
    text,
    photo,
    photoAlt,
    actions = [],
    panel,
  } = props;

  const stats = panel?.stats ?? [];
  const showStats = stats.length > 0;
  const showPhoto = !showStats && Boolean(photo);
  const twoColumns = showStats || showPhoto;

  return (
    <Section id={id} surface={surface}>
      <Container>
        <div className="grid gap-x-gutter gap-y-12 lg:grid-cols-12 lg:items-center">
          <div className={twoColumns ? "lg:col-span-6" : "lg:col-span-12"}>
            <ProductHeader
              number={number}
              eyebrow={eyebrow}
              title={title}
            />

            {text.length > 0 ? (
              <div
                className="mt-8 space-y-5"
                data-reveal
                style={revealDelay(1)}
              >
                {text.map((paragraph, index) => (
                  <p
                    key={index}
                    className="max-w-[62ch] text-body text-fg-muted"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}

            {actions.length > 0 ? (
              <div className="mt-10" data-reveal>
                <ActionGroup actions={actions} />
              </div>
            ) : null}
          </div>

          {showStats ? (
            // grid-cols-2 и на мобильном тоже: значения тут короткие по
            // смыслу поля («2021», «68», «4,9»), и в одну колонку четыре
            // такие плитки дают полтора экрана пустоты справа от цифры.
            <dl className="grid grid-cols-2 gap-gutter lg:col-span-6">
              {stats.map((stat, index) => (
                <Card
                  key={stat.label}
                  variant="framed"
                  data-reveal
                  style={revealDelay(index)}
                >
                  <dt className="tabular font-display text-h2">{stat.value}</dt>
                  <dd className="mt-3 text-small text-fg-muted">{stat.label}</dd>
                </Card>
              ))}
            </dl>
          ) : null}

          {showPhoto ? (
            <div className="lg:col-span-6" data-reveal>
              <div className="ui-media relative aspect-[4/3] w-full overflow-hidden bg-rule">
                <Image
                  src={photo as string}
                  alt={photoAlt ?? title ?? ""}
                  fill
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}

export default Product;
