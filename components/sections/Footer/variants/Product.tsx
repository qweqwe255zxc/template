import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";
import { Container } from "@/components/ui/Container";
import { getIcon } from "@/lib/icons";
import { NewsletterForm } from "../parts/NewsletterForm";
import type { FooterProps } from "../types";

/**
 * Футер семейства `product`: тёмный подвал одной строкой.
 *
 * Единственный тёмный футер в каталоге — остальные семь живут на `paper`
 * или `surface`. Это не «ещё один тёмный блок ради ритма» (§3): у
 * семейства тёмные и первый экран, и кейсы, и панель финального CTA, и
 * подвал того же тона закрывает страницу той же поверхностью, что её
 * открыла.
 *
 * Тёмный контекст задаётся `data-surface="ink"` — дальше внутри работают
 * обычные `text-fg` / `text-fg-muted` / `bg-bg`, и ни одного цвета в
 * этом файле не прописано руками: подвал одинаково корректен в обеих
 * темах.
 *
 * Основной ярус — одна строка (знак с вордмарком, копирайт, ссылки), как
 * в исходном приёме. Колонки, соцсети и форма подписки рендерятся только
 * если заданы в конфиге, и встают ярусом ВЫШЕ этой строки — так подвал
 * остаётся компактным у проекта без них и не разъезжается у проекта с
 * ними.
 */
export function Product({ brand, footer }: FooterProps) {
  const year = new Date().getFullYear();
  const hasColumns = Boolean(footer.columns && footer.columns.length > 0);
  const hasTopTier = hasColumns || Boolean(footer.newsletter);

  return (
    <footer data-surface="ink" className="bg-bg text-fg">
      <Container>
        {hasTopTier ? (
          <div className="grid gap-x-gutter gap-y-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
            {footer.columns?.map((column) => (
              <div key={column.title}>
                <h3 className="text-caption font-bold uppercase tracking-[0.08em] text-accent">
                  {column.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
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
              </div>
            ))}

            {footer.newsletter ? (
              <NewsletterForm
                newsletter={footer.newsletter}
                className="sm:col-span-2 lg:col-span-2"
              />
            ) : null}
          </div>
        ) : null}

        <div
          className={
            hasTopTier
              ? "flex flex-col gap-6 border-t border-rule py-8 md:flex-row md:items-center md:justify-between"
              : "flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between"
          }
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-2.5 font-heading text-h3 font-bold">
              <BrandMark mark={brand.mark} alt={brand.name} />
              {brand.name}
            </span>
            <span className="tabular text-small text-fg-muted">
              © {year} {brand.legalName}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {footer.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-small text-fg-muted transition-colors hover:text-fg"
              >
                {link.label}
              </Link>
            ))}

            {footer.social && footer.social.length > 0 ? (
              <ul className="flex items-center gap-2">
                {footer.social.map((item) => {
                  const Icon = getIcon(item.icon);
                  if (!Icon) return null;

                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        aria-label={item.label}
                        className="flex size-9 items-center justify-center text-fg-muted transition-colors hover:text-fg"
                      >
                        <Icon
                          aria-hidden="true"
                          strokeWidth={1.5}
                          className="size-4"
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
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

        {footer.note ? (
          <p className="max-w-[72ch] pb-8 text-small text-fg-muted">
            {footer.note}
          </p>
        ) : null}
      </Container>
    </footer>
  );
}

export default Product;
