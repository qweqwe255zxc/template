"use client";

import { Container } from "@/components/ui/Container";
import { ProductHeader } from "@/components/ui/ProductHeader";
import { Section } from "@/components/ui/Section";
import { Toast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { ContactDetails } from "../parts/ContactDetails";
import { ContactMap } from "../parts/ContactMap";
import { FormColumn } from "../parts/FormColumn";
import { useContactForm } from "../parts/useContactForm";
import type { ContactFormProps } from "../types";

/**
 * Контакты семейства `product`: реквизиты слева (5/12), форма справа
 * (7/12) — в приподнятой карточке.
 *
 * Карточка под формой и есть то, чем вариант отличается от `split` (там
 * форма лежит прямо на поверхности) и от `editorial` (там она тоже
 * плоская). Поэтому `layout` по умолчанию "cardContainer", а не "plain":
 * в исходном приёме форма — единственный интерактивный объект раздела, и
 * подложка отделяет её от реквизитов, у которых своей рамки нет.
 * Поставить "plain" в конфиге по-прежнему можно, вариант это уважает.
 *
 * Реквизиты идут обычным списком с пиктограммами (`layout="list"`), хотя
 * в исходном лендинге у контактного блока иконок нет. Это осознанное
 * расхождение: иконка в плашке — сквозной элемент этого семейства
 * (Features, Stats, Team), и убрать её только в контактах значило бы
 * скопировать приём соседнего семейства. Реквизиты без пиктограмм — это
 * `variant: "editorial"` у той же секции, и два варианта не должны
 * выглядеть одинаково.
 */
export function Product(props: ContactFormProps) {
  const {
    id,
    surface = "surface",
    layout = "cardContainer",
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
        <ProductHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
        />

        {/* lg, а не md — та же причина, что в split: на 768–1023px
            колонка формы 7/12 слишком узка для полей в два ряда, и ряд
            лейблов читается рваным. Ниже lg секция одноколоночная. */}
        <div className="mt-14 grid gap-x-gutter gap-y-14 lg:mt-20 lg:grid-cols-12">
          <ContactDetails
            contacts={contacts}
            detailsTitle={detailsTitle}
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

export default Product;
