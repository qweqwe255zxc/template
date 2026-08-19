import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";
import { Container } from "@/components/ui/Container";
import { FooterColumns } from "../parts/FooterColumns";
import { NewsletterForm } from "../parts/NewsletterForm";
import { SocialLinks } from "../parts/SocialLinks";
import type { FooterProps } from "../types";

/**
 * Футер семейства `market`: тёмная полоса — вордмарк капслоком слева,
 * навигация по центру, реквизиты справа с часами работы акцентом.
 *
 * Тёмный подвал в каталоге второй (первый — `product`), но устроен
 * иначе: там тёмной сделана только нижняя строка, а колонки и подписка
 * лежат ярусом выше на светлом. Здесь тёмная вся полоса целиком — так в
 * исходном приёме заканчивается кремовая страница, и подвал работает
 * нижней рамой листа.
 *
 * Второй после `atelier` футер, выводящий РЕКВИЗИТЫ из `contacts`, и по
 * той же причине: в общепите подвал — второе место, куда человек
 * смотрит за адресом и телефоном, и заставлять его возвращаться к форме
 * значит терять заказ. Данные не дублируются в конфиге — источник один,
 * `siteConfig.contacts`.
 *
 * Часы работы набраны акцентом и крупнее остального — единственное
 * цветное пятно подвала. Ровно так они стоят в исходнике: для доставки
 * это самая важная строка на странице, важнее адреса.
 *
 * `columns` и `newsletter` рендерятся отдельным ярусом ниже, если
 * заданы, — как в `atelier` и `product`: подвал остаётся компактным у
 * проекта без них и не разъезжается у проекта с ними.
 */
export function Market({ brand, contacts, footer, nav }: FooterProps) {
  const year = new Date().getFullYear();
  const columns = footer.columns ?? [];

  return (
    <footer data-surface="ink" className="bg-bg text-fg">
      <Container>
        {/* 1.4fr / 1fr / auto, а не 1fr / auto / auto. С двумя auto-
            треками навигация из восьми пунктов забирает свой max-content
            целиком, и колонке знака остаётся ~100px: описание под
            вордмарком рвётся на двенадцать строк в колонку шириной в
            слово (поймано на стенде). Дробный трек заставляет навигацию
            переноситься, а не диктовать ширину. */}
        <div className="grid gap-x-gutter gap-y-10 pt-14 pb-10 md:pt-16 lg:grid-cols-[1.4fr_1fr_auto] lg:items-start">
          <div className="min-w-0">
            <Link
              href="#hero"
              className="inline-flex items-center gap-2.5 font-heading text-h3 uppercase"
            >
              <BrandMark mark={brand.mark} alt={brand.name} />
              {brand.name}
            </Link>

            {footer.note ? (
              <p className="mt-5 max-w-[42ch] text-small text-fg-muted">
                {footer.note}
              </p>
            ) : null}

            {footer.social && footer.social.length > 0 ? (
              <SocialLinks items={footer.social} className="mt-6" />
            ) : null}
          </div>

          {nav.length > 0 ? (
            <nav className="min-w-0" aria-label="Навигация в подвале">
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-small text-fg-muted transition-colors hover:text-fg"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <div className="min-w-0 lg:text-right">
            {/* Часы — единственное акцентное пятно подвала. На тёмной
                поверхности чистый --accent проваливается по контрасту,
                поэтому берётся accent-border: на ink это приглушённо
                светлый тон той же роли (тот же токен держит штрих
                семейства atelier). */}
            <p className="tabular font-heading text-h4 text-accent-border">
              {contacts.hours}
            </p>
            <p className="mt-3 text-small text-fg-muted">{contacts.address}</p>
            <p className="mt-1 text-small">
              <a
                href={contacts.phoneHref}
                className="tabular text-fg-muted transition-colors hover:text-fg"
              >
                {contacts.phone}
              </a>
            </p>
            <p className="mt-1 text-small">
              <a
                href={`mailto:${contacts.email}`}
                className="break-words text-fg-muted transition-colors hover:text-fg"
              >
                {contacts.email}
              </a>
            </p>
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

        <div className="flex flex-col gap-5 border-t border-rule py-7 md:flex-row md:items-center md:justify-between">
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

export default Market;
