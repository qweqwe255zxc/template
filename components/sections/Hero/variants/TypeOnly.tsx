import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HeroFacts } from "../parts/HeroFacts";
import { HeroLede } from "../parts/HeroLede";
import { HeroRail } from "../parts/HeroRail";
import type { HeroSection } from "@/types/site";

/**
 * Самая разреженная секция на сайте, без картинок и графики — держится на
 * крупной серифной типографике и колонтитуле на поле. Вариант по
 * умолчанию в «Экономе».
 *
 * Раскладка 2/10: рельс занимает две колонки, заголовок — остальные
 * десять. Второй колонки нет, поэтому и items-center на строке не нужен —
 * выравнивать не с чем.
 */
export function TypeOnly(props: HeroSection) {
  const {
    id,
    surface = "paper",
    number,
    rail,
    headline,
    lead,
    actions = [],
    facts = [],
  } = props;

  return (
    <Section id={id} surface={surface} spacing="hero" tint="hero">
      <Container>
        <div className="grid gap-x-gutter lg:grid-cols-12">
          <HeroRail number={number} rail={rail} className="lg:col-span-2" />
          <HeroLede
            headline={headline}
            lead={lead}
            actions={actions}
            className="lg:col-span-10"
          />
        </div>

        <HeroFacts facts={facts} />
      </Container>
    </Section>
  );
}

export default TypeOnly;
