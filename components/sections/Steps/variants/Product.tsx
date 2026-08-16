import { Container } from "@/components/ui/Container";
import { ProductHeader } from "@/components/ui/ProductHeader";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import { StepContent } from "../parts/StepContent";
import type { StepsSection } from "@/types/site";

/**
 * Число колонок выводится из числа шагов, а не задаётся жёстко: пять
 * шагов в четырёх колонках дают одинокую ячейку во втором ряду, три —
 * пустую колонку справа. Классы литеральные, потому что сканер Tailwind
 * не видит склеенных строк.
 */
const LG_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

/**
 * Шаги семейства `product`: колонки на утолщённой линейке, номер
 * акцентом над заголовком, срок — под описанием.
 *
 * Толщина и цвет линейки тут отличают вариант от `editorial`, где та же
 * идея «шаги в ряд на линейке» решена иначе: там СПЛОШНАЯ линейка
 * основного цвета (`border-rule-strong`) и номер со сроком в одной
 * строке колонтитулом. Здесь линейка в два пикселя, но обычного тона
 * (`border-rule`) — она читается не как граница таблицы, а как
 * подчёркивание колонки, и держит ряд карточек, у которых своей рамки
 * нет. Не выравнивать эти два варианта между собой: они специально
 * решают одну задачу разными средствами.
 *
 * Номер акцентный — единственное цветное пятно в ячейке. Это тот же
 * принцип, что у колонтитула `ProductHeader`: в семействе на каждый блок
 * приходится ровно одна акцентная подпись, и по ней глаз ведёт счёт.
 *
 * `item.icon` вариант не читает: у ячейки уже есть номер, и плашка с
 * иконкой рядом с ним даёт два конкурирующих знака на одной высоте.
 * Иконки в этом семействе живут в карточках Features и Stats, где номера
 * нет.
 */
export function Product(props: StepsSection) {
  const {
    id,
    surface = "paper",
    number,
    eyebrow,
    title,
    lead,
    items,
    iconShape,
  } = props;

  const lgCols = LG_COLS[Math.min(items.length, 5)] ?? "lg:grid-cols-4";

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <Container>
        <ProductHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
        />

        <ol className={cn("mt-14 grid gap-gutter sm:grid-cols-2 md:mt-20", lgCols)}>
          {items.map((item, index) => (
            <li
              key={item.title}
              // flex h-full flex-col — опора для mt-auto у meta ниже:
              // без собственного flex-контекста ячейки auto-отступ по
              // спецификации равен нулю, и срок вставал бы сразу под
              // описанием, на разной высоте в каждой колонке.
              className="flex h-full flex-col border-t-2 border-rule pt-6"
              data-reveal
              style={revealDelay(index)}
            >
              <p className="tabular text-caption font-bold uppercase tracking-[0.08em] text-accent">
                {item.number ?? String(index + 1).padStart(2, "0")}
              </p>

              <StepContent
                item={item}
                titleClassName="mt-5"
                metaClassName="mt-auto pt-6"
              />
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

export default Product;
