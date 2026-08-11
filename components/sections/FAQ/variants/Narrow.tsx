import { Section } from "@/components/ui/Section";
import { FaqBody } from "../parts/FaqBody";
import type { FaqSection } from "@/types/site";

/**
 * Колонка 760px — заметный контраст после широкого реестра дел выше по
 * странице. Вариант по умолчанию во всех тарифах: длинные ответы нельзя
 * растягивать во всю ширину, строка становится нечитаемой.
 */
export function Narrow(props: FaqSection) {
  const { id, surface = "surface", iconShape } = props;

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <FaqBody {...props} width="narrow" />
    </Section>
  );
}

export default Narrow;
