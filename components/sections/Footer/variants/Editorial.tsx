import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "../parts/NewsletterForm";
import type { FooterProps } from "../types";

/**
 * Футер семейства `editorial`: два яруса на линейках, весь служебный
 * текст — капителью с разрядкой, тем же начертанием, что колонтитул
 * раздела (components/ui/EditorialHeader) и бар хедера.
 *
 * Линейки тут работают так же, как в остальных секциях семейства, и это
 * не оформление: СПЛОШНАЯ сверху закрывает страницу (тот же вес, что у
 * полосы цифр и у ряда шагов — «итог, счёт»), ВОЛОСЯНАЯ между ярусами
 * просто делит служебное от навигационного. Выравнивать их «для
 * единообразия» нельзя: без разницы в весе футер читается как ещё одна
 * секция, а не как конец страницы.
 *
 * `social` рендерится ТЕКСТОМ, а не иконками, в отличие от bold/centered:
 * пиктограмма — тот же декор, вместо которого в этом семействе работает
 * типографика. Поле `label` для этого и годится — это настоящее имя
 * ссылки, а не только подпись для скринридера.
 */
export function Editorial({ brand, footer }: FooterProps) {
  const year = new Date().getFullYear();
  const hasColumns = Boolean(footer.columns && footer.columns.length > 0);

  return (
    <footer data-surface="paper" className="bg-bg text-fg">
      <Container>
        <div className="border-t border-rule-strong pt-10 md:pt-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-baseline md:justify-between">
            <span className="text-caption font-bold uppercase tracking-[0.14em]">
              {brand.name}{" "}
              <span className="font-medium text-fg-muted">©</span>
            </span>

            {footer.links.length > 0 ? (
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {footer.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-caption font-medium uppercase tracking-[0.14em] text-fg-muted transition-colors hover:text-fg"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {hasColumns ? (
            <div className="mt-12 grid gap-x-gutter gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {footer.columns?.map((column) => (
                <div key={column.title} className="border-t border-rule pt-4">
                  <h3 className="text-caption font-medium uppercase tracking-[0.14em] text-fg-muted">
                    {column.title}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-small transition-colors hover:text-accent"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}

          {footer.newsletter ? (
            <NewsletterForm
              newsletter={footer.newsletter}
              className="mt-12 max-w-md border-t border-rule pt-6"
            />
          ) : null}
        </div>

        {/* Нижний ярус: всё, что не навигация — примечание, реквизиты,
            копирайт, соцссылки. Отделён волосяной линейкой, потому что
            это другой сорт текста, а не другой раздел. */}
        <div className="mt-12 flex flex-col gap-6 border-t border-rule py-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-[62ch]">
            {footer.note ? (
              <p className="text-small text-fg-muted">{footer.note}</p>
            ) : null}

            <p className="tabular mt-3 text-caption font-medium uppercase tracking-[0.14em] text-fg-muted">
              © {year} {brand.legalName}
            </p>

            {footer.legal.length > 0 ? (
              <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
                {footer.legal.map((line) => (
                  <li
                    key={line}
                    className="tabular text-caption font-medium uppercase tracking-[0.14em] text-fg-muted"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {footer.social && footer.social.length > 0 ? (
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {footer.social.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-caption font-medium uppercase tracking-[0.14em] text-fg-muted transition-colors hover:text-fg"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}

export default Editorial;
