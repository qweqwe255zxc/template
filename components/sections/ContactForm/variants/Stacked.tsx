"use client";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Toast } from "@/components/ui/Toast";
import { ContactDetails } from "../parts/ContactDetails";
import { ContactMap } from "../parts/ContactMap";
import { FormColumn } from "../parts/FormColumn";
import { useContactForm } from "../parts/useContactForm";
import type { ContactFormProps } from "../types";

/**
 * Реквизиты компактной строкой над формой, сама форма — узкой колонкой
 * по центру. Ниша варианта: страница, где контакт это единственный блок,
 * а реквизитов немного — фрилансер, консультант, одностраничник с одним
 * адресом. Там боковая колонка split выглядит пустой, а карточки boxed —
 * избыточными.
 *
 * Раньше реквизиты шли тем же вертикальным списком, что и в split: семь
 * строк на 560px над формой отжимали её на второй экран, и вариант
 * получался самым высоким из четырёх (2460px) при самом простом
 * содержимом. Теперь реквизиты идут в 2–3 колонки (ContactDetails
 * layout="inline") и занимают одну полосу.
 *
 * Карта — полосой во всю ширину под формой, см. parts/ContactMap.tsx.
 */
export function Stacked(props: ContactFormProps) {
  const {
    id,
    surface = "surface",
    layout = "plain",
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

  return (
    <Section id={id} surface={surface}>
      <Container>
        <SectionHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
        />

        {/* Реквизиты — во всю ширину контейнера: в inline-раскладке это
            полоса в 2–3 колонки, и сжимать её незачем. */}
        <ContactDetails
          contacts={contacts}
          detailsTitle={detailsTitle}
          layout="inline"
          className="mt-14 md:mt-20"
        />

        {/* Форма — узкой колонкой по центру (max-w-2xl, не max-w-3xl):
            поля во всю ширину контейнера читались как незаполненная
            таблица, а не как форма. Именно эта узкая колонка и есть
            смысл варианта. */}
        <FormColumn
          form={form}
          fields={fields}
          submitLabel={submitLabel}
          consent={consent}
          layout={layout}
          columnClassName="mx-auto mt-12 w-full max-w-2xl md:mt-16"
        />

        {showMap && mapSrc ? <ContactMap mapSrc={mapSrc} /> : null}
      </Container>

      <Toast toast={form.toast} onClose={form.closeToast} />
    </Section>
  );
}

export default Stacked;
