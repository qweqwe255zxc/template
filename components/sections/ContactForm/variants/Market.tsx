"use client";

import { Container } from "@/components/ui/Container";
import { MarketHeader } from "@/components/ui/MarketHeader";
import { Section } from "@/components/ui/Section";
import { SectionTicker } from "@/components/ui/Ticker";
import { Toast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { ContactDetails } from "../parts/ContactDetails";
import { ContactMap } from "../parts/ContactMap";
import { FormColumn } from "../parts/FormColumn";
import { useContactForm } from "../parts/useContactForm";
import type { ContactFormProps } from "../types";

/**
 * Контакты семейства `market`: шапка по левому краю, реквизиты слева
 * (5/12) парами «подпись капслоком — значение», форма справа (7/12),
 * карта полосой под ними.
 *
 * Ось та же 5/7, что у `split`, `editorial` и `atelier` — колонки в этой
 * секции диктует не приём, а содержимое: форме нужно место под два поля
 * в ряд, реквизитам хватает трети. Отличие в том, ЧЕМ набраны реквизиты:
 *
 *   • `split` — список на линейках, у каждой строки пиктограмма;
 *   • `editorial` — подпись капителью и значение крупным font-display;
 *   • `atelier` — клетки разграфлённого бланка;
 *   • здесь — пары в две колонки, подпись АКЦЕНТОМ и капслоком. Цветная
 *     подпись и есть всё оформление блока: ни иконок, ни линеек, ни
 *     рамок в нём нет.
 *
 * Раскладку реквизитов держит общий `parts/ContactDetails`
 * (`layout="market"`), а не своя разметка: список собирается из
 * `contacts` с условными мессенджерами и ссылкой на карты, и вторая
 * копия этой логики разъехалась бы с первой при первом же новом поле.
 *
 * Шапка по левому краю и без шеврона — раздел двухколоночный, и
 * центрированный заголовок повис бы над стыком колонок (см.
 * `MarketHeader`).
 *
 * `layout` (подложка под формой) остаётся честной ручкой конфига, но по
 * умолчанию тут "plain": приподнятая карточка рядом с реквизитами без
 * единой рамки дала бы в секции одну оправу на двоих.
 *
 * Отступление от исходного приёма, о котором стоит знать: там этого
 * раздела в виде ФОРМЫ нет вовсе — только реквизиты и карта. Форма
 * оставлена, потому что она и есть смысл секции `contact` в шаблоне;
 * исходная раскладка отдала ей правую колонку.
 */
export function Market(props: ContactFormProps) {
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
    ticker,
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
        <MarketHeader
          number={number}
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          align="start"
        />

        {/* lg, а не md — та же причина, что в split: на 768–1023px
            колонка формы 7/12 слишком узка для полей в два ряда, и ряд
            лейблов читается рваным. Ниже lg секция одноколоночная. */}
        <div className="mt-14 grid gap-x-gutter gap-y-14 lg:mt-20 lg:grid-cols-12">
          <ContactDetails
            contacts={contacts}
            detailsTitle={detailsTitle}
            layout="market"
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

      {ticker ? <SectionTicker text={ticker} /> : null}

      <Toast toast={form.toast} onClose={form.closeToast} />
    </Section>
  );
}

export default Market;
