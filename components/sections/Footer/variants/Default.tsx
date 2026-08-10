import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";
import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "../parts/NewsletterForm";
import type { FooterProps } from "../types";

/**
 * Спокойный финал страницы: двойная линейка сверху, мелкий кегль,
 * компактные отступы. Знак бренда тут — последнее место на странице,
 * где ещё используется акцентный цвет.
 *
 * footer.newsletter — опциональная 4-я колонка: без неё сетка остаётся
 * 3 колонки по md:col-span-4 (как раньше), с ней все четыре узла
 * сжимаются до md:col-span-3.
 */
export function Default({ brand, contacts, footer, nav }: FooterProps) {
  const year = new Date().getFullYear();
  const colSpan = footer.newsletter ? "md:col-span-3" : "md:col-span-4";

  return (
    <footer data-surface="paper" className="bg-bg text-fg">
      {/* Двойная линейка вместо декора — просто два hairline подряд */}
      <div className="border-t border-rule">
        <div className="border-t border-rule pt-12 md:pt-16">
          <Container>
            <div className="grid gap-x-gutter gap-y-10 md:grid-cols-12">
              <div className={colSpan}>
                <p className="flex items-center gap-2 font-display text-h3">
                  <BrandMark mark={brand.mark} alt={brand.name} />
                  <span>{brand.name}</span>
                </p>
                <p className="mt-3 text-small text-fg-muted">{brand.tagline}</p>
              </div>

              <nav className={colSpan} aria-label="Разделы сайта">
                {/* auto-fit/minmax вместо фиксированного sm:grid-cols-2 —
                    та же поправка, что в parts/FooterColumns.tsx: колонка
                    реально сужается только с md (768px, colSpan), а sm:
                    включается уже на 640px и на md-ширине сжимал бы список
                    в 2 тесных столбца до того, как в колонке появится
                    место (тот же класс бага, что чинили в ContactForm/Panels). */}
                <ul
                  className="grid gap-2.5"
                  style={{ gridTemplateColumns: "repeat(auto-fit, minmax(8rem, 1fr))" }}
                >
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

              <div className={colSpan}>
                <ul className="grid gap-2.5">
                  <li>
                    <a
                      href={contacts.phoneHref}
                      className="tabular text-small underline decoration-rule-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                    >
                      {contacts.phone}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${contacts.email}`}
                      className="text-small underline decoration-rule-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                    >
                      {contacts.email}
                    </a>
                  </li>
                  <li className="text-small text-fg-muted">{contacts.address}</li>
                  <li className="text-small text-fg-muted">{contacts.hours}</li>
                </ul>
              </div>

              {footer.newsletter ? (
                <div className={colSpan}>
                  <NewsletterForm newsletter={footer.newsletter} />
                </div>
              ) : null}
            </div>

            <div className="mt-12 grid gap-x-gutter gap-y-6 border-t border-rule py-8 md:grid-cols-12">
              <div className="md:col-span-7">
                <p className="measure text-small text-fg-muted">{footer.note}</p>
                {footer.legal.map((line) => (
                  <p key={line} className="tabular mt-1.5 text-small text-fg-muted">
                    {line}
                  </p>
                ))}
              </div>

              <div className="md:col-span-5 md:text-right">
                <ul className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end">
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
                <p className="tabular mt-4 text-small text-fg-muted">
                  © {year} {brand.legalName}
                </p>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </footer>
  );
}

export default Default;
