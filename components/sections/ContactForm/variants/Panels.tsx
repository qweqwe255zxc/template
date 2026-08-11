"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Toast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { FormColumn } from "../parts/FormColumn";
import { useContactForm } from "../parts/useContactForm";
import { yandexMapsHref } from "../parts/yandexMapsHref";
import type { ContactFormProps } from "../types";

/**
 * Полноширинная афиша: слева форма, отцентрованная в своей колонке,
 * справа — тёмная панель со своим data-surface="ink" (адрес, телефон,
 * почта) и картой внахлёст к правому краю окна. Своего Container нет —
 * панели сами держат отступы, поэтому Section идёт со spacing="none".
 *
 * Раньше докстринг обещал выравнивание по оси страницы через
 * mr-auto-блок шириной calc(var(--container-page)/2) — как у Hero/Poster.
 * Ни одно из трёх утверждений коду не соответствовало: блок стоял
 * mx-auto (то есть по центру, а не по левой оси), делитель был *7/12, а
 * содержимое внутри — text-center. Здесь именно центрированная колонка,
 * и кап ширины больше не выводится из контейнера: значение, посчитанное
 * от --container-page, ломается при любой смене контейнера, и в один
 * момент оно оказалось УЖЕ, чем max-w-3xl у самой формы, из-за чего её
 * собственная ширина переставала работать вовсе.
 *
 * number секция тут не показывает — колонтитулу негде стоять на
 * полноширинной панели без общего левого поля (тот же случай, что и у
 * Hero/Poster).
 */
export function Panels(props: ContactFormProps) {
  const {
    id,
    surface = "surface",
    layout = "plain",
    eyebrow,
    title,
    lead,
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

  const form = useContactForm({
    fields,
    successTitle,
    successText,
    errorText,
  });

  return (
    <Section id={id} surface={surface} spacing="none" iconShape={iconShape}>
      {/* 7/5, а не 50/50: панель с адресом/телефоном/почтой — короткий,
          самодостаточный список, а форма с несколькими полями рядом с ней
          выглядела заметно мельче остальных элементов раскладки. Форме
          нужно больше пространства, чем справочной информации. */}
      <div className="grid md:grid-cols-12 md:items-stretch">
        {/* max-w-4xl (896px) — предохранитель на очень широких мониторах,
            а не рабочая ширина: на типовых экранах колонка md:col-span-7
            уже, и ширину задаёт она, оставляя форме её max-w-3xl. */}
        <div className="mx-auto w-full max-w-4xl px-gutter py-section-lg text-center md:col-span-7">
          {eyebrow ? (
            <p className="text-caption font-medium uppercase text-fg-muted" data-reveal>
              {eyebrow}
            </p>
          ) : null}

          {title ? (
            <h2 className={cn("font-heading text-h2", eyebrow && "mt-4")} data-reveal>
              {title}
            </h2>
          ) : null}

          {lead ? (
            <p className="mx-auto mt-5 max-w-[46ch] text-lead text-fg-muted" data-reveal>
              {lead}
            </p>
          ) : null}

          {/* max-w-3xl — тот же потолок, что у ContactForm/Stacked.tsx для
              своей формы: раньше тут стоял max-w-32rem (512px), державший
              форму заметно уже колонки-обёртки даже на широких десктопах.
              Но и без потолка вообще форма растягивалась на всю
              max-w(...)*7/12 колонку (до ~900px) — поля в 2 колонки
              становились неестественно широкими на большом десктопе.
              max-w-3xl — компромисс: шире прежних 512px, но не во всю
              ширину плавающей 7/12-колонки.
              fieldsBreakpoint="lg": колонка тут не 7/12 Container'а, как у
              split/boxed, а 7/12 сырого viewport — на md–lg (768–1023) она
              ещё не доросла до комфортной ширины, дефолтный sm:grid-cols-2
              у ContactFields сжимал бы поля в 2 тесных столбца. lg
              откладывает 2 колонки до момента, когда viewport уже даёт
              колонке достаточно места — тот же сбой, что у split/boxed
              (см. их комментарии), но по другой причине (плавающая ширина
              колонки, а не колонка Container'а). */}
          <FormColumn
            form={form}
            fields={fields}
            submitLabel={submitLabel}
            consent={consent}
            layout={layout}
            columnClassName="mx-auto mt-10 w-full max-w-3xl text-left"
            fieldsBreakpoint="lg"
          />
        </div>

        {/* Панель — собственный контекст поверхности, тот же приём, что
            у Hero/Poster: data-surface переопределяет цветовые
            переменные для всего поддерева. flex-col + h-full: md:items-stretch
            на строке выше уже тянет обе колонки на одну высоту, а тут это
            превращается в реальное вертикальное пространство — карта
            (flex-1) забирает ВЕСЬ остаток под инфоблоком, а не только
            высоту по aspect-ratio. Раньше при этом снизу оставалась чёрная
            (surface ink) полоса под белой картой фиксированной высоты. */}
        <div data-surface="ink" className="flex h-full flex-col bg-bg text-fg md:col-span-5">
          <div className="px-gutter py-section-lg md:px-12">
            <p className="text-caption font-medium uppercase text-fg-muted" data-reveal>
              Офис
            </p>
            {/* md:text-h3 lg:text-h2: тот же сжатый диапазон 768–1023, что
                и у формы слева — панель тут ~224–280px в ширину, полный
                text-h2 разваливался на несколько строк. */}
            <a
              href={yandexMapsHref(contacts)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-w-0 items-start gap-2 break-words font-heading text-h2 underline decoration-rule-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent md:text-h3 lg:text-h2"
              data-reveal
            >
              <MapPin aria-hidden="true" strokeWidth={1.5} className="mt-2 size-6 shrink-0" />
              {contacts.addressShort}
            </a>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-6">
              <div className="flex items-start gap-3" data-reveal>
                <span className="icon-tile">
                  <Phone aria-hidden="true" strokeWidth={1.5} className="size-5" />
                </span>
                <div>
                  <p className="text-caption font-medium uppercase text-fg-muted">
                    Телефон
                  </p>
                  <a
                    href={contacts.phoneHref}
                    className="tabular mt-1 block text-body underline decoration-rule-strong underline-offset-4"
                  >
                    {contacts.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3" data-reveal>
                <span className="icon-tile">
                  <Mail aria-hidden="true" strokeWidth={1.5} className="size-5" />
                </span>
                <div>
                  <p className="text-caption font-medium uppercase text-fg-muted">
                    Почта
                  </p>
                  <a
                    href={`mailto:${contacts.email}`}
                    className="mt-1 block text-body underline decoration-rule-strong underline-offset-4"
                  >
                    {contacts.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {showMap && mapSrc ? (
            <div className="relative min-h-[16rem] flex-1 border-t border-rule">
              <iframe
                src={mapSrc}
                loading="lazy"
                title="Карта проезда"
                className="absolute inset-0 block h-full w-full grayscale transition-[filter] duration-500 hover:grayscale-0"
                style={{ border: 0 }}
              />
            </div>
          ) : null}
        </div>
      </div>

      <Toast toast={form.toast} onClose={form.closeToast} />
    </Section>
  );
}

export default Panels;
