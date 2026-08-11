"use client";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Toast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { ContactDetailCards } from "../parts/ContactDetailCards";
import { ContactMap } from "../parts/ContactMap";
import { FormColumn } from "../parts/FormColumn";
import { useContactForm } from "../parts/useContactForm";
import type { ContactFormProps } from "../types";

/**
 * То же деление 5/7, что и у Split, но реквизиты — не список на
 * линейках, а сетка карточек (parts/ContactDetailCards). Форма
 * по-прежнему проходит через FormColumn и слушается layout — эта ось
 * не привязана к variant, см. docs/section-system.md, раздел 7.
 */
export function Boxed(props: ContactFormProps) {
  const {
    id,
    surface = "surface",
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
        <SectionHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
        />

        {/* lg, а не md — тот же корневой случай, что и у Split.tsx (см.
            комментарий там): на 768–1023px 7/12-колонка формы слишком
            узкая под 2 поля в ряд. */}
        <div className="mt-14 grid gap-x-gutter gap-y-14 lg:mt-20 lg:grid-cols-12">
          {/* Карта сюда больше не передаётся. Семь карточек реквизитов
              плюс карта в колонке 5/12 делали левую сторону заметно длиннее
              формы, и блок читался кривым. Карта ушла полосой под обе
              колонки (ниже) — там ей и место, как в split/stacked. */}
          <ContactDetailCards
            contacts={contacts}
            detailsTitle={detailsTitle}
            showMap={false}
            className={cn("lg:order-none lg:col-span-5", formFirst && "order-2")}
          />

          <FormColumn
            form={form}
            fields={fields}
            submitLabel={submitLabel}
            consent={consent}
            layout={layout}
            columnClassName={cn("lg:order-none lg:col-span-7", formFirst && "order-1")}
          />
        </div>

        {showMap && mapSrc ? <ContactMap mapSrc={mapSrc} /> : null}
      </Container>

      <Toast toast={form.toast} onClose={form.closeToast} />
    </Section>
  );
}

export default Boxed;
