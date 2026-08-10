import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "../parts/NewsletterForm";
import { SocialLinks } from "../parts/SocialLinks";
import type { FooterProps } from "../types";

/**
 * Всё по центру в одну колонку: знак, плоский ряд ссылок (nav — тот же
 * список разделов, что и в хедере, без группировки по колонкам), форма
 * подписки, копирайт, соцссылки. Самый компактный из вариантов по
 * высоте — newsletter опционален и не рендерится без footer.newsletter.
 */
export function Centered({ brand, footer, nav }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer data-surface="paper" className="bg-bg text-fg">
      <div className="border-t border-rule py-14 md:py-16">
        <Container>
          <div className="flex flex-col items-center gap-6 text-center">
            <p className="font-heading text-h3 tracking-wide">{brand.name}</p>

            {nav.length > 0 ? (
              <nav aria-label="Разделы сайта">
                <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
                  {nav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-caption font-medium uppercase tracking-wide text-fg-muted transition-colors hover:text-fg"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            {footer.newsletter ? (
              <NewsletterForm newsletter={footer.newsletter} className="w-full max-w-xs" />
            ) : null}

            <div className="w-full max-w-xs border-t border-rule pt-6">
              <p className="tabular text-small text-fg-muted">
                © {year} {brand.legalName}
              </p>
              {footer.legal.map((line) => (
                <p key={line} className="tabular mt-1.5 text-small text-fg-muted">
                  {line}
                </p>
              ))}
            </div>

            {footer.social ? <SocialLinks items={footer.social} /> : null}
          </div>
        </Container>
      </div>
    </footer>
  );
}

export default Centered;
