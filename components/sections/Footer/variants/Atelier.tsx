import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";
import { Container } from "@/components/ui/Container";
import { FooterColumns } from "../parts/FooterColumns";
import { NewsletterForm } from "../parts/NewsletterForm";
import { SocialLinks } from "../parts/SocialLinks";
import type { FooterProps } from "../types";

/**
 * Футер семейства `atelier`: три колонки на воздухе — знак с описанием,
 * адрес с часами, способы связи, — и нижняя строка на волосяной линейке.
 *
 * Единственный футер в каталоге, который выводит РЕКВИЗИТЫ из
 * `contacts`: адрес, часы работы, телефон и почту. Остальные восемь
 * показывают только навигацию и служебный текст, потому что реквизиты
 * есть в секции контактов. Здесь это осознанное повторение, и оно из
 * исходного приёма: в клинике или ателье подвал — второе место, куда
 * человек смотрит за адресом, и заставлять его возвращаться к форме
 * значит терять звонок. Данные при этом не дублируются в конфиге —
 * источник один, `siteConfig.contacts`.
 *
 * Подписи колонок набраны капителью с разрядкой 0.2em — тем же
 * начертанием, что колонтитул `AtelierHeader` и подписи реквизитов в
 * `ContactDetails layout="atelier"`. Вордмарк — крупный тонкий, как в
 * хедере семейства.
 *
 * `columns` и `newsletter` рендерятся, если заданы, отдельным ярусом
 * ниже — как в `product`: подвал остаётся компактным у проекта без них
 * и не разъезжается у проекта с ними. `social` — иконками (в отличие от
 * `editorial`, где то же поле выводится текстом): здесь роль
 * типографики уже занята подписями колонок, и третья капительная строка
 * подряд превратила бы подвал в стену капители.
 */
export function Atelier({ brand, contacts, footer }: FooterProps) {
  const year = new Date().getFullYear();
  const columns = footer.columns ?? [];

  return (
    <footer data-surface="surface" className="bg-bg text-fg">
      <Container>
        <div className="grid gap-x-gutter gap-y-12 pt-16 pb-12 md:pt-20 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div className="min-w-0">
            <Link
              href="#hero"
              className="inline-flex items-center gap-2.5 font-heading text-h3"
            >
              <BrandMark mark={brand.mark} alt={brand.name} />
              {brand.name}
            </Link>

            {footer.note ? (
              <p className="mt-5 max-w-[42ch] text-body text-fg-muted">
                {footer.note}
              </p>
            ) : null}

            {footer.social && footer.social.length > 0 ? (
              <SocialLinks items={footer.social} className="mt-7" />
            ) : null}
          </div>

          <div className="min-w-0">
            <h2 className="text-caption font-medium uppercase tracking-[0.2em] text-fg-muted">
              Адрес и часы
            </h2>
            <ul className="mt-5 space-y-2.5 text-body">
              <li>{contacts.address}</li>
              <li>{contacts.hours}</li>
            </ul>
          </div>

          <div className="min-w-0">
            <h2 className="text-caption font-medium uppercase tracking-[0.2em] text-fg-muted">
              Связаться
            </h2>
            <ul className="mt-5 space-y-2.5 text-body">
              <li>
                <a
                  href={contacts.phoneHref}
                  className="tabular transition-colors hover:text-accent"
                >
                  {contacts.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contacts.email}`}
                  className="break-words transition-colors hover:text-accent"
                >
                  {contacts.email}
                </a>
              </li>
              <li>
                <a
                  href={contacts.telegramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  {contacts.telegram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {columns.length > 0 || footer.newsletter ? (
          <div className="grid gap-x-gutter gap-y-10 border-t border-rule py-12 lg:grid-cols-[2fr_1fr]">
            {columns.length > 0 ? <FooterColumns columns={columns} /> : null}
            {footer.newsletter ? (
              <NewsletterForm newsletter={footer.newsletter} />
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col gap-5 border-t border-rule py-8 md:flex-row md:items-center md:justify-between">
          <p className="tabular text-small text-fg-muted">
            © {year} {brand.legalName}
          </p>

          {footer.links.length > 0 ? (
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {footer.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-small text-fg-muted transition-colors hover:text-fg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {footer.legal.length > 0 ? (
          <ul className="flex flex-wrap gap-x-6 gap-y-1 border-t border-rule py-6">
            {footer.legal.map((line) => (
              <li key={line} className="tabular text-small text-fg-muted">
                {line}
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </footer>
  );
}

export default Atelier;
