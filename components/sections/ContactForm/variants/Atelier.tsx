"use client";

import { AtelierHeader } from "@/components/ui/AtelierHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Toast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { ContactDetails } from "../parts/ContactDetails";
import { ContactMap } from "../parts/ContactMap";
import { FormColumn } from "../parts/FormColumn";
import { useContactForm } from "../parts/useContactForm";
import type { ContactFormProps } from "../types";

/**
 * Контакты семейства `atelier`: центрированная шапка со штрихом, под ней
 * реквизиты клетками решётки слева (5/12) и форма справа (7/12), карта
 * полосой под ними.
 *
 * Ось та же 5/7, что у `split` и `editorial` — колонки в этой секции
 * диктует не приём, а содержимое: форме нужно место под два поля в ряд,
 * реквизитам хватает трети. Отличие в том, ЧЕМ набраны реквизиты:
 *
 *   • `split` — список на линейках, у каждой строки пиктограмма;
 *   • `editorial` — подпись капителью и значение крупным font-display,
 *     без иконок и без линеек;
 *   • здесь — клетки разграфлённого бланка, по реквизиту в клетке.
 *     Иконок нет по той же причине, что в остальных секциях семейства:
 *     плашка внутри клетки конкурирует с клеткой за роль рамки.
 *
 * Раскладку реквизитов держит общий `parts/ContactDetails`
 * (`layout="atelier"`), а не своя разметка: список собирается из
 * `contacts` с условными мессенджерами и ссылкой на карты, и вторая
 * копия этой логики разъехалась бы с первой при первом же новом поле.
 *
 * `layout` (подложка под формой) остаётся честной ручкой конфига, но по
 * умолчанию тут "plain": приподнятая карточка рядом с решёткой даёт две
 * конкурирующие оправы в одной секции. Поставить `cardContainer` можно —
 * вариант это уважает.
 */
export function Atelier(props: ContactFormProps) {
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
        <AtelierHeader
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
            layout="atelier"
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

export default Atelier;
