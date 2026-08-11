"use client";

import { Section } from "@/components/ui/Section";
import { StickySplit as SplitLayout } from "@/components/ui/StickySplit";
import { Toast } from "@/components/ui/Toast";
import { ContactDetails } from "../parts/ContactDetails";
import { ContactMap } from "../parts/ContactMap";
import { FormColumn } from "../parts/FormColumn";
import { useContactForm } from "../parts/useContactForm";
import type { ContactFormProps } from "../types";

/**
 * Форма справа от залипающего заголовка — член семейства `sticky-split`
 * (общая ось 4/8, см. `ui/StickySplit`).
 *
 * Реквизиты идут в ЛЕВУЮ колонку, под заголовок (через `aside`), а не
 * отдельным блоком справа: залипающая колонка — самое естественное
 * место для телефона и адреса, они остаются на экране всё время, пока
 * посетитель заполняет форму. Ровно тот случай, ради которого приём и
 * нужен, а не просто ещё одна раскладка в две колонки.
 *
 * Реквизиты в компактной раскладке (`layout="inline"`) — в колонке 4/12
 * вертикальный список на семь строк уехал бы ниже формы и залипать
 * перестал бы: sticky работает, только пока блок короче экрана.
 *
 * Карта — полосой под обеими колонками.
 */
export function StickySplit(props: ContactFormProps) {
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
    iconShape,
  } = props;

  const form = useContactForm({ fields, successTitle, successText, errorText });

  return (
    <Section id={id} surface={surface} iconShape={iconShape}>
      <SplitLayout
        number={number}
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        aside={
          <ContactDetails
            contacts={contacts}
            detailsTitle={detailsTitle}
            layout="inline"
          />
        }
      >
        <FormColumn
          form={form}
          fields={fields}
          submitLabel={submitLabel}
          consent={consent}
          layout={layout}
        />

        {showMap && mapSrc ? <ContactMap mapSrc={mapSrc} /> : null}
      </SplitLayout>

      <Toast toast={form.toast} onClose={form.closeToast} />
    </Section>
  );
}

export default StickySplit;
