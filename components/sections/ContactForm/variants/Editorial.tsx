"use client";

import { Container } from "@/components/ui/Container";
import { EditorialHeader } from "@/components/ui/EditorialHeader";
import { Section } from "@/components/ui/Section";
import { Toast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { ContactDetails } from "../parts/ContactDetails";
import { ContactMap } from "../parts/ContactMap";
import { FormColumn } from "../parts/FormColumn";
import { useContactForm } from "../parts/useContactForm";
import type { ContactFormProps } from "../types";

/**
 * Контакты семейства `editorial`: реквизиты слева (5/12) подписью
 * капителью и значением крупным `font-display`, форма справа (7/12)
 * прямо на поверхности секции.
 *
 * Ключевое отличие от `split` — не колонки (там те же 5/7), а то, ЧЕМ
 * набраны реквизиты. В `split` это список на линейках с иконкой у
 * каждой строки; здесь иконок нет вовсе, а линейка зарезервирована под
 * колонтитул раздела. Раскладку реквизитов держит общий
 * parts/ContactDetails (`layout="editorial"`), а не своя разметка:
 * список реквизитов собирается из `contacts` с условными мессенджерами
 * и ссылкой на карты, и вторая копия этой логики разъехалась бы с
 * первой при первом же новом поле.
 *
 * `layout` (подложка под формой) остаётся честной ручкой конфига, но по
 * умолчанию тут "plain": форма в приподнятой карточке вернула бы ровно
 * ту оправу, вместо которой в этом семействе работает типографика.
 * Поставить `layout: "cardContainer"` можно — вариант это уважает.
 */
export function Editorial(props: ContactFormProps) {
  const {
    id,
    surface = "paper",
    layout = "plain",
    order = "form-first",
    number,
    eyebrow,
    title,
    lead,
    detailsTitle,
    fields,
    submitLabel,
    consent,
    successTitle,
    successText,
    errorText,
    contacts,
    mapSrc,
    showMap = true,
  } = props;

  const form = useContactForm({
    fields,
    successTitle,
    successText,
    errorText,
  });

  const formFirst = order === "form-first";

  return (
    <Section id={id} surface={surface}>
      <Container>
        <EditorialHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
        />

        {/* lg, а не md — по той же причине, что в split: на 768–1023px
            колонка формы 7/12 слишком узка для полей в два ряда, и ряд
            лейблов читается рваным. Ниже lg секция одноколоночная. */}
        <div className="mt-14 grid gap-x-gutter gap-y-14 lg:mt-20 lg:grid-cols-12">
          <ContactDetails
            contacts={contacts}
            detailsTitle={detailsTitle}
            layout="editorial"
            // order-* работает только ниже lg, где колонок ещё нет: по
            // умолчанию первой идёт форма, реквизиты вторичны. С lg
            // колонки стоят бок о бок и порядок в DOM снова решает
            // вариант — отсюда lg:order-none.
            className={cn("lg:order-none lg:col-span-5", formFirst && "order-2")}
          />

          <FormColumn
            form={form}
            fields={fields}
            submitLabel={submitLabel}
            consent={consent}
            layout={layout}
            columnClassName={cn(
              "lg:order-none lg:col-span-7",
              formFirst && "order-1",
            )}
          />
        </div>

        {showMap && mapSrc ? <ContactMap mapSrc={mapSrc} /> : null}
      </Container>

      <Toast toast={form.toast} onClose={form.closeToast} />
    </Section>
  );
}

export default Editorial;
