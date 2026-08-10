"use client";

import { Card } from "@/components/ui/Card";
import { ContactFields } from "./ContactFields";
import type { ContactSection } from "@/types/site";
import type { ContactFormState } from "./useContactForm";

interface FormColumnProps {
  form: ContactFormState;
  fields: ContactSection["fields"];
  submitLabel: string;
  consent: string;
  /** Подложка под формой. Вторая ось секции, независимая от раскладки. */
  layout: NonNullable<ContactSection["layout"]>;
  /** Классы колонки. undefined в stacked — колонка там одна на всю ширину. */
  columnClassName?: string;
  /** См. ContactFields — пробрасывается как есть, дефолт там же. */
  fieldsBreakpoint?: "sm" | "lg";
}

/**
 * Колонка с формой. layout — вторая, независимая от variant ось: variant
 * задаёт колонки секции, layout — подложку под самой формой. Поэтому
 * обёртка живёт в parts/ и переиспользуется обеими раскладками, а не
 * копируется в каждый вариант.
 *
 * В cardContainer колонку держит обёртка вокруг Card, а не сама форма:
 * иначе grid-класс попал бы внутрь карточки и ничего бы не делал.
 */
export function FormColumn({
  form,
  fields,
  submitLabel,
  consent,
  layout,
  columnClassName,
  fieldsBreakpoint,
}: FormColumnProps) {
  const fieldsNode = (
    <ContactFields
      form={form}
      fields={fields}
      submitLabel={submitLabel}
      consent={consent}
      className={layout === "cardContainer" ? undefined : columnClassName}
      fieldsBreakpoint={fieldsBreakpoint}
    />
  );

  if (layout === "cardContainer") {
    return (
      <div className={columnClassName}>
        <Card variant="elevated">{fieldsNode}</Card>
      </div>
    );
  }

  return fieldsNode;
}

export default FormColumn;
