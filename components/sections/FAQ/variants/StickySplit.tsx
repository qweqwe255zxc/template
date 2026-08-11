import { Accordion } from "@/components/ui/Accordion";
import { Section } from "@/components/ui/Section";
import { StickySplit as SplitLayout } from "@/components/ui/StickySplit";
import { FaqSupportCard } from "../parts/FaqSupportCard";
import type { FaqSection } from "@/types/site";

/**
 * Аккордеон справа от залипающего заголовка — член семейства
 * `sticky-split` (общая ось 4/8, см. `ui/StickySplit`).
 *
 * Отличие от `split-sidebar`, у которого та же геометрия: там левая
 * колонка прокручивается вместе со страницей, здесь — залипает. Разница
 * в одной строке CSS, но заметна она именно на FAQ: это самая длинная
 * секция сайта, и вопрос «к чему относится этот список» возникает
 * ровно посередине прокрутки. Оба варианта оставлены, потому что
 * залипающая колонка — это ещё и обязательство: она работает только
 * когда все секции страницы собраны одним приёмом. На сайте с обычными
 * шапками одинокий залипающий FAQ выглядит сбоем.
 *
 * Карточка `support` — под обеими колонками, как и в split-sidebar: она
 * адресована ко всем вопросам сразу.
 */
export function StickySplit(props: FaqSection) {
  const { id, surface = "surface", number, eyebrow, title, lead, items, support, iconShape } =
    props;

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <SplitLayout number={number} eyebrow={eyebrow} title={title} lead={lead}>
        <div data-reveal>
          <Accordion items={items} />
        </div>

        {support ? <FaqSupportCard support={support} className="mt-10" /> : null}
      </SplitLayout>
    </Section>
  );
}

export default StickySplit;
