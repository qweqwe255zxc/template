import { Section } from "@/components/ui/Section";
import { FaqBody } from "../parts/FaqBody";
import type { FaqSection } from "@/types/site";

/**
 * Полная ширина контейнера (1600px), не узкая колонка — тот же аккордеон,
 * что и narrow, только просторнее. (Раньше назывался "split" — имени не
 * соответствовала ни разу двухколоночная раскладка: её у этого варианта
 * нет и не было. Настоящий двухколоночный вариант — split-sidebar.)
 */
export function Wide(props: FaqSection) {
  const { id, surface = "surface", iconShape } = props;

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <FaqBody {...props} width="page" />
    </Section>
  );
}

export default Wide;
