import { AtelierHeader } from "@/components/ui/AtelierHeader";
import { Container } from "@/components/ui/Container";
import { SeamGrid, SEAM_CELL, seamTailSpan } from "@/components/ui/SeamGrid";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/reveal";
import { StepContent } from "../parts/StepContent";
import type { StepsSection } from "@/types/site";

/**
 * Литеральные классы, а не шаблонная строка: сканер Tailwind ищет
 * кандидатов по тексту исходника — та же причина, что у LG_COLS в
 * Steps/editorial и GRID_COLS в Pricing.
 */
const LG_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

/**
 * Этапы семейства `atelier`: тот же разграфлённый бланк, что у цифр —
 * решётка на волосяных швах, по шагу в клетке. Крупный номер стоит
 * первым ярусом клетки, под ним заголовок и описание.
 *
 * Пара «цифры — этапы» намеренно набрана ОДНОЙ решёткой, в отличие от
 * `editorial`, где те же два раздела различаются толщиной линии
 * (волосяная — перечень, сплошная — счёт). В этом семействе роль
 * различителя играет не линия, а содержимое клетки: в цифрах первый
 * ярус — число, в этапах — номер шага, и дальше заголовок с описанием,
 * которых у цифры нет. Разводить их ещё и графикой значило бы завести
 * второй язык внутри одного приёма.
 *
 * Номер набран приглушённым, а не бледной акцентной краской, как в
 * исходном приёме. Причина не вкусовая: номер шага — содержимое, а не
 * декор («позвоните после этапа 03»), и красить его в тон, который на
 * светлой бумаге едва отличим от фона, значит терять текст. Приглушённый
 * тон даёт ту же роль водяного знака при сохранённом контрасте.
 *
 * `icon` и `iconShape` не читаются: плашка иконки в клетке бланка
 * конкурирует с самой клеткой за роль рамки — тот же отказ, что у
 * `Stats/atelier`. `photo` и `featured` тоже не читаются — фотография
 * рвёт высоту ряда, а выделенная заливкой клетка внутри бланка читается
 * как ошибка вёрстки, а не как акцент.
 */
export function Atelier(props: StepsSection) {
  const { id, surface = "surface", number, eyebrow, title, lead, items } = props;

  // Столько колонок, сколько шагов, но не больше четырёх: на 1024px
  // пятая колонка — это 200px на шаг, где «Письменный план и смета»
  // рвётся на четыре строки. Остаток закрывает последняя клетка.
  const lgCols = Math.min(items.length, 4);
  const smCols = Math.min(items.length, 2);

  return (
    <Section id={id} surface={surface}>
      <Container>
        <AtelierHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          className="mb-14 md:mb-20"
        />

        <SeamGrid
          as="ul"
          className={cn(
            smCols === 2 && "sm:grid-cols-2",
            LG_COLS[lgCols],
          )}
        >
          {items.map((item, index) => (
            <li
              key={item.number}
              data-reveal
              style={revealDelay(index)}
              className={cn(
                SEAM_CELL,
                "flex flex-col",
                seamTailSpan(index, items.length, smCols, "sm:"),
                seamTailSpan(index, items.length, lgCols, "lg:"),
              )}
            >
              <p className="tabular font-display text-stat text-fg-muted">
                {item.number}
              </p>

              {/* metaClassName="mt-auto pt-6": срок прижат к низу клетки,
                  то есть стоит на одной линии у всех шагов ряда
                  независимо от длины описания. Работает потому, что
                  клетка — flex-колонка; pt-6 держит отступ в самом
                  высоком шаге, где mt-auto по факту равен нулю. */}
              <StepContent
                item={item}
                titleClassName="mt-6"
                metaClassName="mt-auto pt-6"
              />
            </li>
          ))}
        </SeamGrid>
      </Container>
    </Section>
  );
}

export default Atelier;
