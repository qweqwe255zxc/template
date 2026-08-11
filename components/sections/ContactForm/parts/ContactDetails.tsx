"use client";

import {
  AtSign,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { yandexMapsHref } from "./yandexMapsHref";
import type { ContactsConfig } from "@/types/site";

interface ContactDetailsProps {
  contacts: ContactsConfig;
  detailsTitle?: string;
  /**
   * list — вертикальный список на линейках, по строке на реквизит: для
   * боковой колонки (split). inline — та же информация компактной
   * строкой в несколько колонок: для раскладок, где реквизиты стоят НАД
   * формой (stacked). Вертикальный список там занимал 560px и отжимал
   * форму на второй экран, хотя это всего семь коротких значений.
   */
  layout?: "list" | "inline";
  /** Классы колонки реквизитов. */
  className?: string;
}

/**
 * Реквизиты сторон: телефон, почта, мессенджеры, адрес, часы, ИНН/ОГРН.
 * Строки мессенджеров рендерятся, только если соответствующее поле
 * задано в contacts; без *Href строка выводится текстом, а не ссылкой.
 * Карта сюда не входит — она полосой во всю ширину под этим блоком и
 * формой, см. parts/ContactMap.tsx.
 */
export function ContactDetails({
  contacts,
  detailsTitle,
  layout = "list",
  className,
}: ContactDetailsProps) {
  const details: {
    icon: typeof Phone;
    label: string;
    value: string;
    href?: string;
  }[] = [
    {
      icon: Phone,
      label: "Телефон",
      value: contacts.phone,
      href: contacts.phoneHref,
    },
    {
      icon: Mail,
      label: "Почта",
      value: contacts.email,
      href: `mailto:${contacts.email}`,
    },
    {
      icon: Send,
      label: "Telegram",
      value: contacts.telegram,
      href: contacts.telegramHref,
    },
    ...(contacts.whatsapp
      ? [
          {
            icon: MessageCircle,
            label: "WhatsApp",
            value: contacts.whatsapp,
            href: contacts.whatsappHref,
          },
        ]
      : []),
    ...(contacts.instagram
      ? [
          {
            icon: AtSign,
            label: "Instagram",
            value: contacts.instagram,
            href: contacts.instagramHref,
          },
        ]
      : []),
    {
      icon: MapPin,
      label: "Офис",
      value: contacts.address,
      href: yandexMapsHref(contacts),
    },
    {
      icon: Clock,
      label: "Часы работы",
      value: contacts.hours,
      href: undefined,
    },
  ];

  return (
    <div className={className} data-reveal>
      {detailsTitle ? (
        <h3 className="text-caption font-medium uppercase text-fg-muted">
          {detailsTitle}
        </h3>
      ) : null}

      {/* Число колонок в inline-раскладке решает КОНТЕЙНЕРНЫЙ запрос, а
          не брейкпоинт окна: этот блок стоит и во всю ширину секции
          (stacked), и в залипающей колонке 4/12 (sticky-split). По ширине
          окна во втором случае получалось бы три колонки по 127px. */}
      <dl
        className={
          layout === "inline"
            ? "@container/details mt-7 grid gap-x-gutter gap-y-1 border-y border-rule py-6 @lg/details:grid-cols-2 @4xl/details:grid-cols-3"
            : "mt-7 border-t border-rule"
        }
      >
        {details.map(({ icon: Icon, label, value, href }) => (
          <div
            key={label}
            className={
              layout === "inline"
                ? "flex items-start gap-3 py-2"
                : "flex items-start gap-4 border-b border-rule py-5"
            }
          >
            <Icon
              aria-hidden="true"
              strokeWidth={1.5}
              className="mt-0.5 size-5 shrink-0 text-fg-muted"
            />
            <div className="min-w-0">
              <dt className="text-caption font-medium uppercase text-fg-muted">
                {label}
              </dt>
              <dd className="tabular mt-1.5 text-body">
                {href ? (
                  <a
                    href={href}
                    className="underline decoration-rule-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                    {...(href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {value}
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      {contacts.inn || contacts.ogrn ? (
        <p className="tabular mt-6 text-small text-fg-muted">
          {[
            contacts.inn && `ИНН ${contacts.inn}`,
            contacts.ogrn && `ОГРН ${contacts.ogrn}`,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      ) : null}
    </div>
  );
}

export default ContactDetails;
