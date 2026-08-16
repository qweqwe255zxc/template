import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { revealDelay } from "@/lib/reveal";
import { HeroFacts } from "../parts/HeroFacts";
import { HeroLede } from "../parts/HeroLede";
import { HeroProof } from "../parts/HeroProof";
import { HeroWidget } from "../parts/HeroWidget";
import { COMPACT_H1 } from "../parts/headlineScale";
import type { HeroSection } from "@/types/site";

/**
 * Первый экран семейства `product` (см. components/ui/ProductHeader).
 *
 * Тёмная половина экрана слева — пилюля, заголовок, лид, кнопки и строка
 * доверия с аватарами; справа — карточка метрик с диаграммой. Это
 * продуктовая витрина: посетителю показывают не фотографию объекта, а
 * сам интерфейс с живыми цифрами.
 *
 * Почему `surface` по умолчанию "ink". У семейства светлая страница
 * (карточки на бумаге), и первый экран — единственное место, где тёмная
 * поверхность работает не «одним тёмным блоком ради ритма» (§3), а по
 * смыслу: карточка метрик читается как окно приложения, только когда
 * вокруг неё темно. Поставить "paper" можно, вариант это уважает.
 *
 * Ось 6/6, а не 7/5 как у `split`: карточка метрик здесь не иллюстрация
 * сбоку, а второй смысловой центр экрана, и в 5/12 её собственная
 * внутренняя сетка (подпись + значение в строку, диаграмма, список
 * операций) начинает переноситься.
 *
 * `widget` тут не «может быть», а НУЖЕН — роутер откатывает вариант на
 * `centered`, если его нет: без второй колонки от раскладки остаётся
 * половина тёмного экрана и пустота справа. Это ровно тот случай, ради
 * которого в Hero заведён PHOTO_FALLBACK, только по другому полю.
 *
 * `image` вариант НЕ читает: фотография и карточка метрик заняли бы одну
 * колонку, а витрина продукта — это карточка (роутер предупреждает в dev).
 * Запрет §6 CLAUDE.md на «`split` + `widget` во всех Hero подряд» этому не
 * противоречит: он про дефолт, который ставят не думая, а здесь виджет —
 * причина существования раскладки, и других Hero семейства нет.
 */
export function Product(props: HeroSection) {
  const {
    id,
    surface = "ink",
    badge,
    headline,
    lead,
    actions = [],
    facts = [],
    proof,
    widget,
  } = props;

  return (
    <Section id={id} surface={surface} spacing="hero" tint="hero">
      <Container>
        <div className="grid gap-x-gutter gap-y-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            {badge ? (
              <div className="mb-8" data-reveal>
                <Badge variant="soft">{badge}</Badge>
              </div>
            ) : null}

            {/* compact: заголовок живёт в половине контейнера, и полный
                потолок --size-h1 переносил бы авторские строки второй
                раз — та же причина, по которой compact стоит у split
                (см. parts/headlineScale.ts). */}
            <HeroLede
              headline={headline}
              lead={lead}
              actions={actions}
              compact
            />

            {proof ? <HeroProof proof={proof} /> : null}
          </div>

          {widget ? (
            // Виджет остаётся в потоке и на мобильном, в отличие от
            // split: там он прячется ниже lg, потому что уводил бы CTA
            // за первый экран, стоя МЕЖДУ лидом и кнопками. Здесь
            // колонка целиком идёт после кнопок и строки доверия, то
            // есть ничего не разрывает — а прятать единственную витрину
            // продукта на телефоне значило бы оставить мобильному
            // посетителю голый текст.
            <div
              className="lg:col-span-6"
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

export default Product;
