import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "../parts/NewsletterForm";
import { SocialLinks } from "../parts/SocialLinks";
import type { FooterProps } from "../types";

/**
 * Навигация разбита на два кластера по бокам от вордмарка по центру —
 * та же идея, что и в Header/variants/Split.tsx. Опциональная форма
 * подписки (footer.newsletter) — центрированным блоком между навигацией
 * и нижней строкой. Нижняя строка: копирайт слева, соцссылки справа.
 */
export function Split({ brand, footer, nav }: FooterProps) {
  const year = new Date().getFullYear();
  const mid = Math.ceil(nav.length / 2);
  const left = nav.slice(0, mid);
  const right = nav.slice(mid);

  return (
    <footer data-surface="paper" className="bg-bg text-fg">
      <div className="border-t border-rule py-14 md:py-16">
        <Container>
          {/* minmax(0,1fr): та же поправка, что в Header/variants/Split.tsx —
              голый 1fr держит неявный минимум по содержимому трека, и при
              нечётном числе пунктов один кластер навигации на один пункт
              длиннее другого сдвигал бы вордмарк с центра. Это работает
              только на md+ (там же появляются 3 колонки); ниже — 1 колонка
              и order-* держит вордмарк первым, а оба кластера nav — под
              ним, вflex-wrap строку по центру, а не полностью скрытыми:
              раньше `hidden md:block` убирал nav целиком, и на мобильном
              ссылки футера было физически не открыть (ни бургера, ни
              другого способа до них добраться не было). */}
          <div className="grid grid-cols-1 items-center gap-6 text-center md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:text-left">
            <nav className="order-2 md:order-none md:justify-self-end" aria-label="Разделы сайта">
              <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 md:justify-end">
                {left.map((item) => (
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

            <p className="order-1 max-w-[16rem] truncate justify-self-center font-heading text-h3 font-bold uppercase md:order-none md:col-start-2 md:max-w-none">
              {brand.name}
            </p>

            <nav className="order-3 md:order-none md:justify-self-start" aria-label="Разделы сайта">
              <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 md:justify-start">
                {right.map((item) => (
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
          </div>

          {footer.newsletter ? (
            <NewsletterForm
              newsletter={footer.newsletter}
              className="mx-auto mt-10 w-full max-w-xs text-center"
            />
          ) : null}

          <div className="mt-10 flex flex-col items-center gap-4 border-t border-rule pt-6 md:flex-row md:justify-between">
            <div className="text-center md:text-left">
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

export default Split;
