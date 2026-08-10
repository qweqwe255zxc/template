import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "../parts/NewsletterForm";
import type { FooterProps } from "../types";

/**
 * Одна строка вместо многоколоночного подвала: знак и копирайт слева,
 * юридические ссылки справа. Верхняя граница акцентная (border-accent),
 * а не hairline — единственный вариант футера, где так.
 *
 * footer.newsletter — опциональная строка над основной, с собственным
 * hairline-разделителем: без неё компакт остаётся честной одной строкой,
 * с ней это единственный вариант, который заранее ломает свою же
 * "compact" идею — но только если продукт явно попросил форму подписки
 * именно здесь.
 */
export function Compact({ brand, footer }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer data-surface="paper" className="bg-bg text-fg">
      <div className="border-t-2 border-accent">
        <Container>
          {footer.newsletter ? (
            <NewsletterForm
              newsletter={footer.newsletter}
              className="max-w-md border-b border-rule py-6"
            />
          ) : null}

          <div className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-heading text-h4 font-bold">{brand.name}</span>
              <span className="tabular text-small text-fg-muted">
                © {year} {brand.legalName}
              </span>
              {footer.legal.map((line) => (
                <span key={line} className="tabular text-small text-fg-muted">
                  {line}
                </span>
              ))}
            </div>

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
        </Container>
      </div>
    </footer>
  );
}

export default Compact;
